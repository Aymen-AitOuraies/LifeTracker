import { IsOptional, IsString } from "class-validator";

export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  date: string;
}
