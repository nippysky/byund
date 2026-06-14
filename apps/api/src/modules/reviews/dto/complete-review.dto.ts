import { IsString, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum ReviewOutcome { PASSED = "PASSED", MINOR_ISSUES = "MINOR_ISSUES", MAJOR_ISSUES = "MAJOR_ISSUES" }

export class CompleteReviewDto {
  @ApiProperty({ enum: ReviewOutcome }) @IsEnum(ReviewOutcome) outcome!: ReviewOutcome;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
