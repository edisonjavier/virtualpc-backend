import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const newRole = await this.prisma.role.create({ data: createRoleDto });
    return newRole;
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(roleId: number) {
    return this.prisma.role.findUnique({ where: { roleId } });
  }

  async findByName(roleName: string) {
    return this.prisma.role.findUnique({ where: { roleName } });
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.prisma.role.update({ data: updateRoleDto, where: { roleId } });
    return updatedRole;
  }

  async remove(id: number) {
    return this.prisma.role.delete({ where: { roleId: id } });
  }
}
