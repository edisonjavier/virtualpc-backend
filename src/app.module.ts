import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./commons/filters";
import { PersonModule } from "./modules/person/person.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { RoleModule } from "./modules/role/role.module";
import { UserRoleModule } from "./modules/user-role/user-role.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from './modules/auth/auth.module';
import { MailingModule } from './modules/mailing/mailing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PersonModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    AuthModule,
    MailingModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
