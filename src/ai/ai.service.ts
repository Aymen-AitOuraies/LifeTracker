import { Injectable } from "@nestjs/common";
import { CreateAiDto } from "./dto/create-ai.dto";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { ScheduleService } from "src/schedule/schedule.service";
import { TaskService } from "src/task/task.service";

@Injectable()
export class AiService {
  // private requestTimestamps: number[] = [];
  // private readonly maxRequestsPerMinute = 4;
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly taskServide: TaskService,
  ) {}
  // private async waitForRateLimitSlot(): Promise<void> {
  //   const now = Date.now();
  //   this.requestTimestamps = this.requestTimestamps.filter(
  //     (t) => now - t < 60_000,
  //   );

  //   if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
  //     const oldest = this.requestTimestamps[0];
  //     const waitMs = 60_000 - (now - oldest) + 100;
  //     console.warn(`Rate limit slot full. Waiting ${waitMs}ms...`);
  //     await new Promise((resolve) => setTimeout(resolve, waitMs));
  //     return this.waitForRateLimitSlot();
  //   }

  //   this.requestTimestamps.push(now);
  // }

  async generateAiSchedule(userId: string, createAiDto: CreateAiDto) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API,
    });

    type InteractionResponse = Awaited<
      ReturnType<typeof ai.interactions.create>
    >;

    type FunctionResult = {
      type: "function_result";
      name: string;
      call_id: string;
      result: Array<{
        type: "text";
        text: string;
      }>;
    };

    const scheduleJsonSchema = {
      type: "object",
      properties: {
        tasks: {
          type: "array",
          description: "Tasks included in the generated schedule.",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The title of the task.",
              },
              startTime: {
                type: "string",
                description: "Task start time in HH:mm format",
              },
              endTime: {
                type: "string",
                description: "Task end time in HH:mm format",
              },
            },
            required: ["title", "startTime", "endTime"],
          },
        },
      },
      required: ["tasks"],
    };

    const taskSchema = z.object({
      tasks: z.array(
        z.object({
          title: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        }),
      ),
    });

    const tasksTool = {
      type: "function",
      name: "getLastSchedules",
      description: "get last 7 schedules with tasks",
      parameters: {
        type: "object",
        properties: {},
      },
    } as const;

    let input: string | FunctionResult[] = `
Create a schedule based on the user's request:

${createAiDto.prompt}

First, use getLastSchedules to retrieve the user's recent schedules with the tasks and feedbacks.

Previous schedules are from previous days. Use them only as context to
understand the user's habits, routines, ongoing activities, preferred
times, and typical task durations.

When a task or activity from the user's request also appeared in previous
schedules, use its previous duration as a baseline if the user did not
specify a duration.

IMPORTANT RULES:

1. Respect all times explicitly specified by the user.
   For example, if the user says "gym from 4 to 5pm", the task MUST be
   scheduled from 16:00 to 17:00.

2. Respect all durations explicitly specified by the user.
   For example, if the user says "a 1 hour tutorial", the task MUST last
   exactly 1 hour.

3. If the user specifies both a start and end time, do not change them.

4. If the user specifies a duration but not a time, choose an appropriate
   available time while keeping the exact duration.

5. If the user does not specify a duration, use previous schedules to
   estimate a reasonable duration for that activity.

6. Previous task times belong to previous days. Do NOT copy their exact
   times into today's schedule unless the user explicitly requests that.

7. Previous task durations can be used as a baseline for today's tasks.

8. Do not arbitrarily increase or decrease a task's duration when there
   is historical information available.

9. Create a NEW schedule for today. Do not simply copy a previous schedule.

10. Make sure tasks do not overlap with each other.

Return all tasks with startTime and endTime in HH:mm format.
`;
    let previousId: string | null = null;
    let interaction: InteractionResponse;
    while (true) {
      // await this.waitForRateLimitSlot();
      interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input,
        tools: [tasksTool],
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: scheduleJsonSchema,
        },
        ...(previousId
          ? {
              previous_interaction_id: previousId,
            }
          : {}),
      });
      const functionResults: FunctionResult[] = [];
      for (const step of interaction.steps) {
        if (step.type === "function_call") {
          const result = await this.scheduleService.getLastSchedules(userId);
          functionResults.push({
            type: "function_result",
            name: step.name,
            call_id: step.id,
            result: [{ type: "text", text: JSON.stringify(result) }],
          });
        }
      }
      if (functionResults.length === 0) break;
      input = functionResults;

      previousId = interaction.id;
    }
    const AiSchedule = taskSchema.parse(JSON.parse(interaction.output_text!));
    const schedule = await this.scheduleService.addSchedule(
      userId,
      createAiDto,
    );
    for (const task of AiSchedule.tasks) {
      await this.taskServide.createTask(userId, schedule.id, {
        title: task.title,
        startTime: `${schedule.date}T${task.startTime}:00`,
        endTime: `${schedule.date}T${task.endTime}:00`,
      });
    }
    return AiSchedule;
  }
}
