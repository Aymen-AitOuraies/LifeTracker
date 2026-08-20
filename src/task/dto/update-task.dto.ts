import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";
import type { TaskStatus } from "src/db/schema";
import { taskStatuses } from "src/db/schema";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsIn(taskStatuses)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
