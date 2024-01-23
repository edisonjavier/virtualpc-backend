import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RecoveryPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
