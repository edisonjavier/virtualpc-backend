import { HttpStatus, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { HttpErrorException } from "src/commons/exceptions";
import { RegisterDto } from "../auth/dto/register.dto";
import { PersonService } from "../person/person.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserWithPersonDto } from "./dto/update-user-with-person.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly personService: PersonService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const newUser = await this.prisma.user.create({ data: createUserDto, include: { person: true } });
    return newUser;
  }

  async createUserWithPerson(registerDto: RegisterDto) {
    const { user, person } = registerDto;
    const foundPerson = await this.personService.findByPhoneOrDni(person.phone, person.dni);
    if (foundPerson)
      throw new HttpErrorException("EL usuario ya se encuentra registrado", HttpStatus.BAD_GATEWAY);
    const foundUser = await this.findByEmail(user.email);
    if (foundUser)
      throw new HttpErrorException("EL usuario ya se encuentra registrado", HttpStatus.BAD_GATEWAY);
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        person: {
          create: person
        }
      },
      include: { person: true }
    });
    return newUser;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        person: true,
        UserRole: {
          include: {
            role: true
          }
        }
      },
      where: { NOT: { personId: null } }
    });
    const mappedUsers = users.map((user) => ({
      user: {
        userId: user.userId,
        email: user.email,
        password: user.password
      },
      person: user.person,
      role: user.UserRole.length > 0 ? user.UserRole[0].role : { roleName: "No Definido", roleId: null }
    }));
    return mappedUsers;
  }

  async findOne(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { person: true } });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    const updatedUser = await this.prisma.user.update({ data: updateUserDto, where: { userId } });
    return updatedUser;
  }

  async updateUserWithPerson(userId: number, updateUserWithPersonDto: UpdateUserWithPersonDto) {
    const { user, person, roleId } = updateUserWithPersonDto;
    return this.prisma.$transaction(async (tx) => {
      const foundRole = await this.prisma.userRole.findFirst({ where: { userId } });
      if (foundRole === null) {
        await tx.userRole.create({ data: { roleId, userId } });
        await tx.user.update({
          data: {
            ...user,
            person: {
              update: { data: person }
            }
          },
          where: { userId },
          include: { person: true }
        });
      } else {
        await tx.user.update({
          data: {
            ...user,
            person: {
              update: { data: person }
            },
            UserRole: {
              update: {
                data: {
                  roleId: roleId
                },
                where: {
                  roleId_userId: {
                    roleId: foundRole.roleId,
                    userId
                  }
                }
              }
            }
          },
          where: { userId },
          include: { person: true }
        });
      }
      return { success: true };
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.prisma.$transaction([
      this.prisma.person.delete({ where: { personId: user.personId } }),
      this.prisma.userRole.deleteMany({ where: { userId: id } }),
      this.prisma.user.delete({ where: { userId: id } })
    ]);
  }
}
