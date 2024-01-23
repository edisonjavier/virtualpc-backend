import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UppercaseTransform } from "src/commons/decorators";

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @UppercaseTransform()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty()
  @IsString()
  @UppercaseTransform()
  @IsNotEmpty()
  roleDesc: string;
}
