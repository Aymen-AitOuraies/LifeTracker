import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { ScheduleService } from "src/schedule/schedule.service";
import { TaskService } from "src/task/task.service";

@Module({
  controllers: [AiController],
  providers: [AiService, ScheduleService, TaskService],
})
export class AiModule {}
