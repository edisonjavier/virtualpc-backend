import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class CreateUserRoleDto {
  @ApiProperty()
  @IsPositive()
  roleId: number;

  @ApiProperty()
  @IsPositive()
  userId: number;
}
