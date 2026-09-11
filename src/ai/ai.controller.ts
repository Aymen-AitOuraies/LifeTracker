import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AiService } from "./ai.service";
import { CreateAiDto } from "./dto/create-ai.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/schedule/schedule.controller";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @UseGuards(JwtAuthGuard)
  @Post("schedule")
  generateAiSchedule(
    @Req() req: AuthenticatedRequest,
    @Body() createAiDto: CreateAiDto,
  ) {
    return this.aiService.generateAiSchedule(req.user!.userId, createAiDto);
  }
}
