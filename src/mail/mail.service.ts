import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendActivationEmail(to: string, codeId: string) {
    const url = `${process.env.APP_URL}/auth/activate/${codeId}`;

    await this.transporter.sendMail({
      from: `"MyApp" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Kích hoạt tài khoản',
      html: `<p>Xin chào, vui lòng click vào link sau để kích hoạt tài khoản:</p>
             <a href="${url}">${url}</a>`,
    });
  }
}
