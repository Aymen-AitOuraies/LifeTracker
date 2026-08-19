import { Injectable, NotFoundException } from "@nestjs/common";
import { db } from "src/db";
import { scheduleTable } from "src/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ReplaceScheduleDto } from "./dto/replace-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
@Injectable()
export class ScheduleService {
  async getSchedules(userId: string) {
    const schedules = await db
      .select()
      .from(scheduleTable)
      .where(eq(scheduleTable.userId, userId));
    return schedules;
  }

  async getScheduleById(userId: string, scheduleId: string) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .limit(1);
    if (!schedule) throw new NotFoundException("Schedule not found");
    return schedule;
  }

  async addSchedule(userId: string, createScheduleDto: CreateScheduleDto) {
    const [schedule] = await db
      .insert(scheduleTable)
      .values({ userId: userId, date: createScheduleDto.date })
      .returning();
    return schedule;
  }

  async replaceSchedule(
    userId: string,
    scheduleId: string,
    replaceScheduleDto: ReplaceScheduleDto,
  ) {
    const [schedule] = await db
      .update(scheduleTable)
      .set(replaceScheduleDto)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .returning();
    if (!schedule) throw new NotFoundException("Schedule not found");
    return schedule;
  }

  async updateSchedule(
    userId: string,
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const [schedule] = await db
      .update(scheduleTable)
      .set(updateScheduleDto)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .returning();
    if (!schedule) throw new NotFoundException("Schedule not found");
    return schedule;
  }

  async deleteSchedule(userId: string, scheduleId: string) {
    const [schedule] = await db
      .delete(scheduleTable)
      .where(
        and(eq(scheduleTable.id, scheduleId), eq(scheduleTable.userId, userId)),
      )
      .returning();
    if (!schedule) throw new NotFoundException("Schedule not found");
    return schedule;
  }
}
