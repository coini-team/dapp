// Third party Dependencies.
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { resolve } from 'path';

// Local Dependencies.
import { SmtpService } from './services/smtp.service';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { Smtp } from 'src/config/config.keys';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(Smtp.SMTP_HOST),
          port: config.get(Smtp.SMTP_PORT),
          secure: false,
          auth: {
            user: config.get(Smtp.SMTP_USER),
            pass: config.get(Smtp.SMTP_PASSWORD),
          },
        },
        defaults: {
          from: `"Coini Team" <${config.get(Smtp.SMTP_FROM)}>`,
        },
        template: {
          dir: resolve(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
        },
        options: {
          strict: true,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [SmtpService],
  exports: [SmtpService],
})
export class SmtpModule {}
