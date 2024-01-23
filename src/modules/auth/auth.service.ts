import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { HttpErrorException } from "src/commons/exceptions";
import { MailingService } from "../mailing/mailing.service";
import { PersonService } from "../person/person.service";
import { PrismaService } from "../prisma/prisma.service";
import { RoleService } from "../role/role.service";
import { UserRoleService } from "../user-role/user-role.service";
import { UserService } from "../user/user.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RecoveryPasswordDto } from "./dto/recovery-passsword.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private DEFAULT_ROL: string = "USER" as const;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly mailingService: MailingService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const foundUser = await this.userService.findByEmail(email);
    if (!foundUser) throw new HttpErrorException("Correo o contraseña incorrectos", HttpStatus.BAD_REQUEST);
    const isPasswordVerified = await compare(password, foundUser.password);
    if (!isPasswordVerified)
      throw new HttpErrorException("Correo o contraseña incorrectos", HttpStatus.FORBIDDEN);
    const roles = await this.userRoleService.findRolByUserId(foundUser.userId);
    const payload = {
      userId: foundUser.userId,
      email,
      roles
    };
    const token = await this.jwtService.signAsync(payload);
    return { roles, user: foundUser, token };
  }

  async register(registerDto: RegisterDto) {
    const { user, person, roleId } = registerDto;
    const foundPerson = await this.personService.findByPhoneOrDni(person.phone, person.dni);
    if (foundPerson)
      throw new HttpErrorException("EL usuario ya se encuentra registrado", HttpStatus.BAD_GATEWAY);
    const foundUser = await this.userService.findByEmail(user.email);
    if (foundUser)
      throw new HttpErrorException("EL usuario ya se encuentra registrado", HttpStatus.BAD_GATEWAY);
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    return this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          ...user,
          person: {
            create: person
          }
        },
        include: { person: true }
      });
      const rol = roleId
        ? { roleId: registerDto.roleId }
        : await this.roleService.findByName(this.DEFAULT_ROL);
      await tx.userRole.create({ data: { roleId: rol.roleId, userId: newUser.userId } });
      this.mailingService.sendMail({
        email: user.email,
        template: "register",
        subject: "Registro",
        context: {
          name: `${person.names} ${person.surnames}`
        }
      });
      return newUser;
    });
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { newPassword, confirmPassword, oldPassword } = changePasswordDto;
    if (newPassword !== confirmPassword)
      throw new HttpErrorException(
        "La nueva contraseña y la confirmación deben coincidir coinciden",
        HttpStatus.BAD_GATEWAY
      );
    const foundUser = await this.userService.findOne(userId);
    const isPasswordVerified = await compare(oldPassword, foundUser.password);
    if (!isPasswordVerified)
      throw new HttpErrorException("Contraseña anterior incorrecta", HttpStatus.FORBIDDEN);
    await this.userService.update(userId, { password: newPassword });
    return { message: "contraseña cambiada exitosamente" };
  }

  async recoveryPassword(recoverPasswordDto: RecoveryPasswordDto) {
    const { email } = recoverPasswordDto;
    const foundUser = await this.userService.findByEmail(email);
    if (!foundUser) throw new HttpErrorException("Usuario no encontrado", HttpStatus.NOT_FOUND);
    const randomPassword = Math.random().toString(36).slice(-7).toLocaleUpperCase();
    const updatedUser = await this.userService.update(foundUser.userId, { password: randomPassword });
    if (!updatedUser)
      throw new HttpErrorException("Ocurrió un error al cambiar la contraseña", HttpStatus.BAD_REQUEST);

    const mailing = await this.mailingService.sendMail({
      email: foundUser.email,
      subject: "Recuperar contraseña",
      template: "recover-password",
      context: {
        password: randomPassword
      }
    });
    if (mailing.accepted.length === 0)
      throw new HttpErrorException(
        "Ocurrió un error al enviar el correo de recuperación",
        HttpStatus.BAD_REQUEST
      );
    return { message: "SUCCESS" };
  }
}
