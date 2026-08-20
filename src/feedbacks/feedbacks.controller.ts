import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { FeedbacksService } from "./feedbacks.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/schedule/schedule.controller";
@Controller()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
  @UseGuards(JwtAuthGuard)
  @Post("schedules/:scheduleId/feedback")
  createFeedback(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbacksService.createFeedback(
      req.user!.userId,
      scheduleId,
      createFeedbackDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("feedbacks")
  findAllUserFeedbacks(@Req() req: AuthenticatedRequest) {
    return this.feedbacksService.findAllUserFeedbacks(req.user!.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("schedules/:scheduleId/feedback")
  findOneFeedback(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
  ) {
    return this.feedbacksService.findOneFeedback(req.user!.userId, scheduleId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("schedules/:scheduleId/feedback")
  updateFeedback(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbacksService.updateFeedback(
      req.user!.userId,
      scheduleId,
      updateFeedbackDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("schedules/:scheduleId/feedback")
  removeFeedback(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
  ) {
    return this.feedbacksService.removeFeedback(req.user!.userId, scheduleId);
  }
}
