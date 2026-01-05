import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('❌ RESEND_API_KEY is missing');
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendActivationEmail(to: string, codeId: string) {
    const url = `${process.env.APP_URL}/api/auth/activate/${codeId}`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Kích hoạt tài khoản ProxyHub</title>
      </head>
      <body>
        <h2>ProxyHub</h2>
        <p>Chào mừng bạn đến với ProxyHub!</p>
        <p>Vui lòng click link bên dưới để kích hoạt tài khoản:</p>
        <a href="${url}">${url}</a>
        <p>Link có hiệu lực trong 24 giờ.</p>
      </body>
      </html>
    `;

    const result = await this.resend.emails.send({
      from: 'ProxyHub <no-reply@proxyhub.site>',
      to,
      subject: '🚀 Kích hoạt tài khoản ProxyHub',
      html: htmlTemplate,
    });

    if (result.error) {
      this.logger.error(`Send mail failed: ${result.error.message}`);
      throw new Error(result.error.message);
    }

    this.logger.log(`Activation email sent to ${to} | id=${result.data?.id}`);

    return result.data;
  }
}
