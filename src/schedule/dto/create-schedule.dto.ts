import { IsNotEmpty, IsString } from "class-validator";

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  date: string;
}
