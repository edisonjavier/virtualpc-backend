import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { join } from "path";
import { MailingService } from "./mailing.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: "smtps://user@domain.com:pass@smtp.domain.com",
      template: {
        dir: join(__dirname, "/templates/"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  providers: [MailingService],
  exports: [MailingService]
})
export class MailingModule {}
