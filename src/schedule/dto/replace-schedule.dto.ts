import { IsNotEmpty, IsString } from "class-validator";

export class ReplaceScheduleDto {
  @IsString()
  @IsNotEmpty()
  date: string;
}
