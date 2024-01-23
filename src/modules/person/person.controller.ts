import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { PersonService } from "./person.service";

@ApiTags("person")
@Controller("person")
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(":personId")
  findOne(@Param("personId") personId: string) {
    return this.personService.findOne(+personId);
  }

  @Patch(":personId")
  update(@Param("personId") personId: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+personId, updatePersonDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.personService.remove(+id);
  }
}
