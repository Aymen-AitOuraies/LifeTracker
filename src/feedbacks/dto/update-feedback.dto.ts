import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;
}
