import { IsNotEmpty, IsDateString } from "class-validator";

export class ReplaceScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
