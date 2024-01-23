import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserWithPersonDto } from "./dto/update-user-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":userId")
  findOne(@Param("userId") userId: string) {
    return this.userService.findOne(+userId);
  }

  @Get("/email/:email")
  findByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(":userId")
  update(@Param("userId") userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+userId, updateUserDto);
  }

  @Patch("user-person/:userId")
  updateUserWithPerson(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateUserWithPersonDto: UpdateUserWithPersonDto
  ) {
    return this.userService.updateUserWithPerson(userId, updateUserWithPersonDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
