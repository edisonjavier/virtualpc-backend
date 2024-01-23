import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/modules/person/dto/create-person.dto";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserWithPersonDto {
  @ApiProperty({ type: OmitType(CreateUserDto, ["personId", "password"] as const) })
  @Type(() => OmitType(CreateUserDto, ["personId"] as const))
  @ValidateNested()
  user: Omit<CreateUserDto, "personId" | "password">;

  @ApiProperty()
  @Type(() => CreatePersonDto)
  @ValidateNested()
  person: CreatePersonDto;

  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  roleId: number;
}
