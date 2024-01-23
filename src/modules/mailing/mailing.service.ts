import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth } from "googleapis";
import { Options as SMTPTransportOptions } from "nodemailer/lib/smtp-transport";

export interface MailData {
  email: string;
  subject: string;
  template: string;
  context?: { [name: string]: string };
}
@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  private async setTransport() {
    const oauth2Client = new Auth.OAuth2Client(
      this.configService.get("EMAIL_CLIENT_ID"),
      this.configService.get("EMAIL_CLIENT_SECRET"),
      this.configService.get("EMAIL_REDIRECT_URL")
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get("EMAIL_REFRESH_TOKEN")
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err);

          reject("Failed to create access token");
        }
        resolve(token);
      });
    });

    const config: SMTPTransportOptions = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.configService.get("EMAIL_USER"),
        clientId: this.configService.get("EMAIL_CLIENT_ID"),
        clientSecret: this.configService.get("EMAIL_CLIENT_SECRET"),
        accessToken
      }
    };

    this.mailerService.addTransporter("gmail", config);
  }

  public async sendMail(mailData: MailData) {
    await this.setTransport();
    return await this.mailerService.sendMail({
      transporterName: "gmail",
      to: mailData.email, // list of receivers
      from: "VIRTUALPC <noreply@gmail.com>", // sender address
      subject: mailData.subject, // Subject line
      template: mailData.template,
      context: mailData.context
    });
  }
}
