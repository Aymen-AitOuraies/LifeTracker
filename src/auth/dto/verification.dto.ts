import { IsEmail, IsNumber, IsString } from "class-validator";

export class VerificationDto {
  @IsString()
  verificationId: string;

  @IsNumber()
  otp: number;
}
