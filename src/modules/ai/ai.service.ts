import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(prompt: string): Promise<string> {
    try {
      const res = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý AI hỗ trợ người dùng trong hệ thống.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return res.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI error:', error);
      throw new InternalServerErrorException('AI service failed');
    }
  }
}
