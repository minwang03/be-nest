import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    console.log('MAIL_USER =', process.env.MAIL_USER);
    console.log('MAIL_PASS tồn tại =', !!process.env.MAIL_PASS);
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendActivationEmail(to: string, codeId: string) {
    const url = `${process.env.APP_URL}/api/auth/activate/${codeId}`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kích hoạt tài khoản ProxyHub</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #ffffff;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
          }
          .header {
            text-align: center;
            padding: 40px 20px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%);
          }
          .logo {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .logo svg {
            width: 40px;
            height: 40px;
            color: white;
          }
          .header h1 {
            position: relative;
            z-index: 1;
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .welcome-text {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .description {
            font-size: 16px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 40px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          .activate-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 30px;
          }
          .activate-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.6);
          }
          .features {
            margin: 40px 0;
            padding: 0;
            list-style: none;
          }
          .features li {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #94a3b8;
          }
          .features li::before {
            content: '✓';
            display: inline-block;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
            font-size: 12px;
            margin-right: 12px;
            color: white;
          }
          .footer {
            padding: 30px;
            text-align: center;
            border-top: 1px solid #334155;
            margin-top: 40px;
          }
          .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #64748b;
          }
          .footer a {
            color: #10b981;
            text-decoration: none;
          }
          .security-note {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
          }
          .security-note h3 {
            color: #22c55e;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .security-note p {
            color: #94a3b8;
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
          }
          @media (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .header h1 {
              font-size: 28px;
            }
            .welcome-text {
              font-size: 20px;
            }
            .activate-button {
              padding: 14px 28px;
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3"></path>
              </svg>
            </div>
            <h1>ProxyHub</h1>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="welcome-text">Chào mừng bạn đến với ProxyHub!</div>
            
            <p class="description">
              Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký và bắt đầu sử dụng dịch vụ proxy chất lượng cao của chúng tôi, vui lòng click vào nút bên dưới để kích hoạt tài khoản.
            </p>

            <a href="${url}" class="activate-button">
              🚀 Kích Hoạt Tài Khoản
            </a>

            <ul class="features">
              <li>Hơn 10 triệu IP từ 50+ quốc gia</li>
              <li>99.9% uptime đảm bảo</li>
              <li>Tốc độ gigabit không giới hạn</li>
              <li>Hỗ trợ 24/7 từ team chuyên nghiệp</li>
            </ul>

            <div class="security-note">
              <h3>🔒 Lưu ý bảo mật</h3>
              <p>
                Link kích hoạt này chỉ có hiệu lực trong 24 giờ. Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>ProxyHub Team</strong></p>
            <p>Email: support@proxyhub.com | Website: <a href="#">proxyhub.com</a></p>
            <p>Nếu bạn gặp khó khăn, hãy liên hệ với chúng tôi qua email hỗ trợ.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              © 2024 ProxyHub. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"ProxyHub" <${process.env.MAIL_USER}>`,
      to,
      subject: '🚀 Kích hoạt tài khoản ProxyHub - Chỉ còn 1 bước nữa!',
      html: htmlTemplate,
    });
  }
}
