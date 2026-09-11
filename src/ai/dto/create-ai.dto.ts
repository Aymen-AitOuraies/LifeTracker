import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateAiDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
