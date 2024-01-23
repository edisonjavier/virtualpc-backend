import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { IsIdCard } from "src/commons/decorators/is-id-card.decorator";

export class CreatePersonDto {
  @ApiProperty()
  @IsIdCard()
  dni: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  names: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surnames: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}
