import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskService } from "./task.service";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
  };
};

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post("schedules/:scheduleId/tasks")
  createTask(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.createTask(
      req.user!.userId,
      scheduleId,
      createTaskDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("schedules/:scheduleId/tasks")
  getTasksBySchedule(
    @Req() req: AuthenticatedRequest,
    @Param("scheduleId") scheduleId: string,
  ) {
    return this.taskService.getTasksBySchedule(req.user!.userId, scheduleId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("tasks/:id")
  getTaskById(@Req() req: AuthenticatedRequest, @Param("id") taskId: string) {
    return this.taskService.getTaskById(req.user!.userId, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("tasks/:id")
  updateTask(
    @Req() req: AuthenticatedRequest,
    @Param("id") taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(req.user!.userId, taskId, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("tasks/:id")
  deleteTask(@Req() req: AuthenticatedRequest, @Param("id") taskId: string) {
    return this.taskService.deleteTask(req.user!.userId, taskId);
  }
}
