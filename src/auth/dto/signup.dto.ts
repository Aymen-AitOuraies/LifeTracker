import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from "class-validator";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      "Password must contain uppercase, lowercase, number, and special character",
  })
  password: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
