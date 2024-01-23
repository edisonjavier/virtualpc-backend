import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleService } from "./role.service";

@ApiTags("role")
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(":roleId")
  findOne(@Param("roleId") roleId: string) {
    return this.roleService.findOne(+roleId);
  }

  @Patch(":roleId")
  update(@Param("roleId") roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+roleId, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
