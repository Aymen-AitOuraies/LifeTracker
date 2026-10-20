import { GoogleGenAI } from "@google/genai";
import { ScheduleService } from "src/schedule/schedule.service";
import { FeedbacksService } from "src/feedbacks/feedbacks.service";

type AiClient = InstanceType<typeof GoogleGenAI>;

export type InteractionResponse = Awaited<
  ReturnType<AiClient["interactions"]["create"]>
>;

export type FunctionResult = {
  type: "function_result";
  name: string;
  call_id: string;
  result: Array<{
    type: "text";
    text: string;
  }>;
};

export type Schedules = Awaited<
  ReturnType<ScheduleService["getLastSchedules"]>
>;

export type Feedbacks = Awaited<
  ReturnType<FeedbacksService["findAllUserFeedbacks"]>
>;
