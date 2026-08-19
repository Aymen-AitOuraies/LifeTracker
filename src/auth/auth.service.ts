import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { Resend } from "resend";
import "dotenv/config";
import { randomInt } from "crypto";
import * as bcrypt from "bcrypt";
import { db } from "../db/index";
import { userTable } from "../db/schema";
import { VerificationDto } from "./dto/verification.dto";
import { eq } from "drizzle-orm";
import { SigninDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async signup(signupDto: SignupDto) {
    if (signupDto.password !== signupDto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    const resend = new Resend(process.env.RESEND_KEY);
    const otp = randomInt(100000, 1000000).toString();
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: signupDto.email,
      subject: otp,
      html: "Test",
    });
    const user: typeof userTable.$inferInsert = {
      username: signupDto.username,
      email: signupDto.email,
      passwordHash: await bcrypt.hash(signupDto.password, 10),
      otpHash: await bcrypt.hash(otp, 10),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await db.insert(userTable).values(user);
    const users = await db.select().from(userTable);
    return users;
  }

  async verify(verificationDto: VerificationDto) {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.verificationId, verificationDto.verificationId));
    const user = users[0];
    if (!user) {
      throw new NotFoundException("Verification not found");
    }
    if (new Date() > user.expiresAt)
      throw new BadRequestException("OTP has expired");
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, user.id));
    return { message: "Email verified successfully" };
  }

  async signin(signinDto: SigninDto) {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, signinDto.email))
      .limit(1);
    if (users.length === 0) {
      throw new BadRequestException("Wrong email");
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(
      signinDto.password,
      user.passwordHash,
    );
    if (!validPassword) throw new BadRequestException("Wrong password");

    if (!user.emailVerified)
      return {
        verified: false,
        verificationId: user.verificationId,
      };
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: "7d",
      },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  refresh(refreshToken: string) {
    try {
      const payload: { sub: string } = this.jwtService.verify(refreshToken);
      return this.jwtService.sign({
        sub: payload.sub,
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
