import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/modules/person/dto/create-person.dto";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";

export class RegisterDto {
  @ApiProperty({
    type: OmitType(CreateUserDto, ["personId"] as const),
    properties: { password: { type: "string" } }
  })
  @Type(() => OmitType(CreateUserDto, ["personId"] as const))
  @ValidateNested()
  user: Omit<CreateUserDto, "personId">;

  @ApiProperty()
  @Type(() => CreatePersonDto)
  @ValidateNested()
  person: CreatePersonDto;

  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  roleId: number;
}
