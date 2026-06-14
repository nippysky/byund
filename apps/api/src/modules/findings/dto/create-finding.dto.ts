import { IsString, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum Severity { LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH", CRITICAL = "CRITICAL" }

export class CreateFindingDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: Severity }) @IsEnum(Severity) severity!: Severity;
  @ApiProperty({ required: false }) @IsOptional() @IsString() assetId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reviewId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() assigneeId?: string;
}
