import { Module } from "@nestjs/common";
import { PersonService } from "../person/person.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PersonService],
  exports: [UserService]
})
export class UserModule {}
