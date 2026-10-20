import { Injectable } from "@nestjs/common";
import { CreateAiDto } from "./dto/create-ai.dto";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { ScheduleService } from "src/schedule/schedule.service";
import { TaskService } from "src/task/task.service";
import {
  InteractionResponse,
  FunctionResult,
  Schedules,
  Feedbacks,
} from "./types/ai.types";
import { FeedbacksService } from "src/feedbacks/feedbacks.service";
import { buildScheduleGenerationPrompt } from "./prompts/schedule-generation.prompt";

@Injectable()
export class AiService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly taskServide: TaskService,
    private readonly feedbackService: FeedbacksService,
  ) {}

  async generateAiSchedule(userId: string, createAiDto: CreateAiDto) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API,
    });

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

    const feedbacksTool = {
      type: "function",
      name: "findAllUserFeedbacks",
      description: "get all user feedbacks",
      parameters: {
        type: "object",
        properties: {},
      },
    } as const;

    let input: string | FunctionResult[] = buildScheduleGenerationPrompt(
      createAiDto.prompt,
    );

    let previousId: string | null = null;
    let interaction: InteractionResponse;

    while (true) {
      interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input,
        tools: [tasksTool, feedbacksTool],
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
          let result: Schedules | Feedbacks;
          switch (step.name) {
            case "getLastSchedules":
              result = await this.scheduleService.getLastSchedules(userId);
              break;

            case "findAllUserFeedbacks":
              result = await this.feedbackService.findAllUserFeedbacks(userId);
              break;

            default:
              throw new Error(`Unknown tool: ${step.name}`);
          }
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
    return {
      scheduleId: schedule.id,
      tasks: AiSchedule,
    };
  }
}
