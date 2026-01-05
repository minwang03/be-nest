import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendActivationEmail(to: string, codeId: string) {
    const url = `${process.env.APP_URL}/api/auth/activate/${codeId}`;

    try {
      await this.resend.emails.send({
        from: 'ProxyHub <noreply@proxyhub.dev>',
        to,
        subject: '🚀 Kích hoạt tài khoản ProxyHub',
        html: `
          <h2>Chào mừng bạn đến với ProxyHub</h2>
          <p>Click vào link bên dưới để kích hoạt tài khoản:</p>
          <a href="${url}">${url}</a>
          <p>Link có hiệu lực trong 24h.</p>
        `,
      });

      this.logger.log(`Activation email sent to ${to}`);
    } catch (err) {
      this.logger.error('Send email failed', err);
    }
  }
}
