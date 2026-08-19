import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  Put,
  Patch,
  Delete,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ReplaceScheduleDto } from "./dto/replace-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

type AuthenticatedRequest = {
  user?: {
    userId: string;
  };
};

@Controller("schedules")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSchedules(@Req() req: AuthenticatedRequest) {
    return this.scheduleService.getSchedules(req.user!.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getScheduleById(
    @Req() req: AuthenticatedRequest,
    @Param("id") scheduleId: string,
  ) {
    return this.scheduleService.getScheduleById(req.user!.userId, scheduleId);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  addSchedule(
    @Req() req: AuthenticatedRequest,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.scheduleService.addSchedule(
      req.user!.userId,
      createScheduleDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put("id")
  replaceSchedule(
    @Req() req: AuthenticatedRequest,
    @Param("id") scheduleId: string,
    @Body() replaceScheduleDto: ReplaceScheduleDto,
  ) {
    return this.scheduleService.replaceSchedule(
      req.user!.userId,
      scheduleId,
      replaceScheduleDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch("id")
  updateSchedule(
    @Req() req: AuthenticatedRequest,
    @Param("id") scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(
      req.user!.userId,
      scheduleId,
      updateScheduleDto,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete("id")
  deleteSchedule(
    @Req() req: AuthenticatedRequest,
    @Param("id") scheduleId: string,
  ) {
    return this.scheduleService.deleteSchedule(req.user!.userId, scheduleId);
  }
}
