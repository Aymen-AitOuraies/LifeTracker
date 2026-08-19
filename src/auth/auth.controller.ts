import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";
import { VerificationDto } from "./dto/verification.dto";
import { SigninDto } from "./dto/signin.dto";
import type { Request, Response } from "express";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post("verify")
  verify(@Body() verificationDto: VerificationDto) {
    return this.authService.verify(verificationDto);
  }
  @Post("signin")
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signin(signinDto);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      accessToken,
    };
  }
  @Post("refresh")
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies.refresh_token as string;
    return this.authService.refresh(refreshToken);
  }
}
