import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { UserRoleService } from "./user-role.service";

@ApiTags("user-role")
@Controller("user-role")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
  }

  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Get("rol/:userId")
  findRolByUserId(@Param("userId") userId: string) {
    return this.userRoleService.findRolByUserId(+userId);
  }

  @Delete(":userId/:roleId")
  remove(@Param("id", ParseIntPipe) userId: number, @Param("id", ParseIntPipe) roleId: number) {
    return this.userRoleService.remove(userId, roleId);
  }
}
