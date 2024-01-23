import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailingModule } from "../mailing/mailing.module";
import { PersonModule } from "../person/person.module";
import { RoleModule } from "../role/role.module";
import { UserRoleModule } from "../user-role/user-role.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>("JWT_SECRET")
        };
      }
    }),
    UserModule,
    PersonModule,
    RoleModule,
    UserRoleModule,
    MailingModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
