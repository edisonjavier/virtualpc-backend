import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";

@Injectable()
export class UserRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    const newUserRol = await this.prisma.userRole.create({ data: createUserRoleDto });
    return newUserRol;
  }

  async findAll() {
    return this.prisma.userRole.findMany();
  }

  async findRolByUserId(userId: number) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: {
        role: {
          select: {
            roleId: true,
            roleName: true
          }
        }
      }
    });
    const roles = userRoles.map((userRol) => userRol.role);
    return roles;
  }

  async remove(userId: number, roleId: number) {
    return this.prisma.userRole.delete({ where: { roleId_userId: { roleId, userId } } });
  }
}
