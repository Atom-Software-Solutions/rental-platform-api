import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationLink(email: string, token: string) {
    const verificationUrl = `${process.env.APP_URL ?? 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    this.logger.log(`Sending verification email to ${email}: ${verificationUrl}`);
    return {
      success: true,
      info: `Verification link sent to ${email}`,
      verificationUrl,
    };
  }
}
