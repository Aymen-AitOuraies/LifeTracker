import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { TaskModule } from "./task/task.module";
import { FeedbacksModule } from "./feedbacks/feedbacks.module";
import { AiModule } from "./ai/ai.module";

@Module({
  imports: [AuthModule, ScheduleModule, TaskModule, FeedbacksModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
