import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { db } from "src/db";
import { scheduleTable, taskTable } from "src/db/schema";
import type { TaskStatus } from "src/db/schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
  async createTask(
    userId: string,
    scheduleId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .limit(1);

    if (!schedule) throw new NotFoundException("Schedule not found");

    const [task] = await db
      .insert(taskTable)
      .values({
        scheduleId,
        title: createTaskDto.title,
        status: createTaskDto.status,
        startTime: createTaskDto.startTime
          ? new Date(createTaskDto.startTime)
          : null,
        endTIme: createTaskDto.endTime ? new Date(createTaskDto.endTime) : null,
      })
      .returning();

    return task;
  }

  async getTasksBySchedule(userId: string, scheduleId: string) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .limit(1);

    if (!schedule) throw new NotFoundException("Schedule not found");

    return db
      .select()
      .from(taskTable)
      .where(eq(taskTable.scheduleId, scheduleId));
  }

  async getTaskById(userId: string, taskId: string) {
    const [taskWithSchedule] = await db
      .select({ task: taskTable })
      .from(taskTable)
      .innerJoin(scheduleTable, eq(taskTable.scheduleId, scheduleTable.id))
      .where(and(eq(taskTable.id, taskId), eq(scheduleTable.userId, userId)))
      .limit(1);

    if (!taskWithSchedule) throw new NotFoundException("Task not found");

    return taskWithSchedule.task;
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const [taskWithSchedule] = await db
      .select({ task: taskTable })
      .from(taskTable)
      .innerJoin(scheduleTable, eq(taskTable.scheduleId, scheduleTable.id))
      .where(and(eq(taskTable.id, taskId), eq(scheduleTable.userId, userId)))
      .limit(1);

    if (!taskWithSchedule) throw new NotFoundException("Task not found");

    const updates: {
      title?: string;
      status?: TaskStatus;
      startTime?: Date | null;
      endTIme?: Date | null;
    } = {};

    if (updateTaskDto.title !== undefined) updates.title = updateTaskDto.title;
    if (updateTaskDto.status !== undefined)
      updates.status = updateTaskDto.status;
    if (updateTaskDto.startTime !== undefined) {
      updates.startTime = updateTaskDto.startTime
        ? new Date(updateTaskDto.startTime)
        : null;
    }
    if (updateTaskDto.endTime !== undefined) {
      updates.endTIme = updateTaskDto.endTime
        ? new Date(updateTaskDto.endTime)
        : null;
    }

    const [updatedTask] = await db
      .update(taskTable)
      .set(updates)
      .where(eq(taskTable.id, taskId))
      .returning();

    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    const [taskWithSchedule] = await db
      .select({ task: taskTable })
      .from(taskTable)
      .innerJoin(scheduleTable, eq(taskTable.scheduleId, scheduleTable.id))
      .where(and(eq(taskTable.id, taskId), eq(scheduleTable.userId, userId)))
      .limit(1);

    if (!taskWithSchedule) throw new NotFoundException("Task not found");

    const [deletedTask] = await db
      .delete(taskTable)
      .where(eq(taskTable.id, taskId))
      .returning();

    return deletedTask;
  }
}
