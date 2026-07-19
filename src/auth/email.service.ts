import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationLink(email: string, token: string) {
    const verificationUrl = `${process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`}/api/v1/auth/verify-email?token=${token}`;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? smtpUser,
        to: email,
        subject: 'Verify your email address',
        html: `<p>Use the following link to verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
        text: `Verify your email: ${verificationUrl}`,
      });

      this.logger.log(`Verification email sent to ${email}`);
      return {
        success: true,
        info: `Verification link sent to ${email}`,
        verificationUrl,
      };
    }

    this.logger.warn(`SMTP not configured. Verification link for ${email}: ${verificationUrl}`);
    return {
      success: true,
      info: `Verification link prepared for ${email}`,
      verificationUrl,
    };
  }
}
