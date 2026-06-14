import { IsString, IsEnum, IsOptional, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum AssetType {
  SERVER      = "SERVER",
  DATABASE    = "DATABASE",
  SSL_CERT    = "SSL_CERT",
  DOMAIN      = "DOMAIN",
  API_KEY     = "API_KEY",
  CLOUD       = "CLOUD",
  STORAGE     = "STORAGE",
  NETWORK     = "NETWORK",
  SERVICE     = "SERVICE",
}

export enum Criticality {
  LOW      = "LOW",
  MEDIUM   = "MEDIUM",
  HIGH     = "HIGH",
  CRITICAL = "CRITICAL",
}

export class CreateAssetDto {
  @ApiProperty() @IsString() @MaxLength(120) name!: string;
  @ApiProperty({ enum: AssetType }) @IsEnum(AssetType) type!: AssetType;
  @ApiProperty({ enum: Criticality }) @IsEnum(Criticality) criticality!: Criticality;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() ownerId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() environment?: string;
  @ApiProperty({ required: false }) @IsOptional() reviewCycleDays?: number;
}
