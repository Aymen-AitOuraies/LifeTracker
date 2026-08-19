ALTER TABLE "feedback" RENAME TO "feedbacks";--> statement-breakpoint
ALTER TABLE "schedule" RENAME TO "schedules";--> statement-breakpoint
ALTER TABLE "task" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedback_schedule_id_schedule_id_fk";
--> statement-breakpoint
ALTER TABLE "schedules" DROP CONSTRAINT "schedule_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "task_schedule_id_schedule_id_fk";
--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedules_user_id_idx" ON "schedules" USING btree ("user_id");