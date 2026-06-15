import { IsIn, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(["dark", "light"])
  themePreference?: string;
}

export class UpdateAvatarDto {
  @IsUrl()
  avatarUrl!: string;
}
