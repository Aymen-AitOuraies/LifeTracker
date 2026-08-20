import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { db } from "src/db";
import { feedbackTable, scheduleTable } from "src/db/schema";
import { eq, and } from "drizzle-orm";
@Injectable()
export class FeedbacksService {
  async createFeedback(
    userId: string,
    scheduleId: string,
    createFeedbackDto: CreateFeedbackDto,
  ) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.userId, userId), eq(scheduleTable.id, scheduleId)),
      )
      .limit(1);
    if (!schedule) throw new NotFoundException("Schedule not found");
    const [feedback] = await db
      .insert(feedbackTable)
      .values({
        scheduleId,
        text: createFeedbackDto.text,
      })
      .returning();
    return feedback;
  }

  async findAllUserFeedbacks(userId: string) {
    return db
      .select({
        id: feedbackTable.id,
        scheduleId: feedbackTable.scheduleId,
        text: feedbackTable.text,
      })
      .from(feedbackTable)
      .innerJoin(scheduleTable, eq(scheduleTable.id, feedbackTable.scheduleId))
      .where(eq(scheduleTable.userId, userId));
  }

  async findOneFeedback(userId: string, scheduleId: string) {
    const [feedback] = await db
      .select()
      .from(feedbackTable)
      .innerJoin(scheduleTable, eq(scheduleTable.id, feedbackTable.scheduleId))
      .where(
        and(eq(scheduleTable.userId, userId), eq(scheduleTable.id, scheduleId)),
      )
      .limit(1);
    if (!feedback) throw new NotFoundException("Feedback not found");
    return feedback;
  }

  async updateFeedback(
    userId: string,
    scheduleId: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.userId, userId), eq(scheduleTable.id, scheduleId)),
      )
      .limit(1);
    if (!schedule) throw new NotFoundException("Schedule not found");
    const [feedback] = await db
      .update(feedbackTable)
      .set(updateFeedbackDto)
      .where(eq(feedbackTable.scheduleId, scheduleId))
      .returning();

    if (!feedback) throw new NotFoundException("Feedback not found");

    return feedback;
  }

  async removeFeedback(userId: string, scheduleId: string) {
    const [schedule] = await db
      .select()
      .from(scheduleTable)
      .where(
        and(eq(scheduleTable.userId, userId), eq(scheduleTable.id, scheduleId)),
      )
      .limit(1);
    if (!schedule) throw new NotFoundException("Schedule not found");
    const [feedback] = await db
      .delete(feedbackTable)
      .where(eq(feedbackTable.scheduleId, scheduleId))
      .returning();

    if (!feedback) throw new NotFoundException("Feedback not found");

    return feedback;
  }
}
