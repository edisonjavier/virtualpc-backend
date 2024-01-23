import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RecoveryPasswordDto } from "./dto/recovery-passsword.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Patch("change-password/:userId")
  changePassword(@Param("userId") userId: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(+userId, changePasswordDto);
  }

  @Post("recovery-password")
  recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(recoveryPasswordDto);
  }
}
