import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EmailToCustomerDto, SingleEmailDto } from '../dto/smtp.dto';
import { ConfigService } from 'src/config/config.service';
import { Coini } from 'src/config/config.keys';

@Injectable()
export class SmtpService {
  // Logger Instance.
  private readonly _logger = new Logger(':::: SmtpService ::::', {
    timestamp: true,
  });

  constructor(
    private readonly mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}

  async sendMultipleEmails<T>(emailDetails: EmailToCustomerDto<T>) {
    const { emails, subject, templateName, context } = emailDetails;
    try {
      await this.mailerService.sendMail({
        to: emails,
        subject,
        template: `${__dirname}/../templates/${templateName}`,
        context: context,
      });
      console.log('=> email sent OK');
    } catch (error) {
      console.log('=> smtp error:', error.message);
    }
  }

  async sendSingleEmail(emailDetails: SingleEmailDto) {
    try {
      console.log('=> sending single email:', emailDetails.email);
      await this.mailerService.sendMail({
        to: emailDetails.email,
        subject: emailDetails.subject,
        template: `${process.cwd()}/src/modules/smtp/templates/confirmEmail.hbs`,
        context: emailDetails.context,
      });
      console.log('=> email sent OK');
    } catch (error) {
      this._logger.error(error.message);
      console.log('=> smtp error:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  // Send Email to Confirm Email Address.
  async sendEmailToConfirmEmailAddress(name, email, token) {
    try {
      const mailDetails: SingleEmailDto = {
        email: email,
        template: 'confirmEmail',
        subject: 'Confirma Tu Email',
        context: {
          name: name,
          url: `${this._configService.get(
            Coini.COINI_BACKOFFICE_URL,
          )}/confirm-account/${token}`,
          message: 'Confirma Tu Correo',
        },
      };

      // Send Mail.
      await this.sendSingleEmail(mailDetails);
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @memberof SmtpService
   * @description This method is used to send email to Successfull Account Activation.
   * @param {string} name
   * @param {string} email
   * @returns {Promise<void>}
   * @throws {BadRequestException}
   */
  async sendEmailToSuccessfullAccountActivation(name: string, email: string) {
    try {
      // Prepare and Send Email.
      this.mailerService.sendMail({
        to: email,
        subject: 'Cuenta Activada',
        template: `${process.cwd()}/src/modules/smtp/templates/succesfullAccountActivation.hbs`,
        context: {
          name: name,
          message: 'Cuenta Activada',
        },
      });
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  sendEmailToResetPassword(name: string, email: string, token: string) {
    try {
      // Prepare and Send Email.
      this.mailerService.sendMail({
        to: email,
        subject: 'Restablecer Contraseña',
        template: `${process.cwd()}/src/modules/smtp/templates/resetPassword.hbs`,
        context: {
          name: name,
          url: `${this._configService.get(
            Coini.COINI_BACKOFFICE_URL,
          )}/reset-password/${token}`,
          message: 'Restablecer Contraseña',
        },
      });
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  sendEmailToSuccessfullPasswordReset(name: string, email: string) {
    try {
      // Prepare and Send Email.
      this.mailerService.sendMail({
        to: email,
        subject: 'Contraseña Restablecida',
        template: `${process.cwd()}/src/modules/smtp/templates/succesfullPasswordReset.hbs`,
        context: {
          name: name,
          message: 'Contraseña Restablecida',
        },
      });
    } catch (error) {
      this._logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
