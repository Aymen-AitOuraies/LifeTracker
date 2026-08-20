import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from './schedule/schedule.module';
import { TaskModule } from './task/task.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';

@Module({
  imports: [AuthModule, ScheduleModule, TaskModule, FeedbacksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
