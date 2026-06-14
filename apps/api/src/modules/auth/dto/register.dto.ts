import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty() @IsString() @MaxLength(80)  name!: string;
  @ApiProperty() @IsEmail()                  email!: string;
  @ApiProperty() @IsString() @MinLength(8)   password!: string;
  @ApiProperty({ required: false }) @IsString() @MaxLength(80) workspaceName?: string;
}
