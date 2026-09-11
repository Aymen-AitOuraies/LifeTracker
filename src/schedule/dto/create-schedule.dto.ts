import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
