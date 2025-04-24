import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import Logger from 'bunyan'
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

//
interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions')
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {

  public async sendEmail (receiverEmail: string, subject: string, body: string) : Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developementEmailSender(receiverEmail, subject, body)
    } else {
      this.productionEmailSender(receiverEmail, subject, body)
    }
  }

  private async developementEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter : Mail = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: config.SENDER_EMAIL!,
        pass: config.SENDER_EMAIL_PASSWORD!,
      },
    });

    const mailOptions : IMailOptions = {
      from : `Social Scam Provider : <${config.SENDER_EMAIL}>`,
      to : receiverEmail,
      subject,
      html : body
    }


    try {
      await transporter.sendMail(mailOptions)
      log.info(' Email are sending properly withp8t hesiteation')
    } catch (error) {
      log.error('Error sending email to me i can isiis ', error);
      throw new BadRequestError('Error Sending Email can check it please ugh');
    }

  }

  private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {


    const mailOptions : IMailOptions = {
      from : `Social Scam Provider : <${config.SENDER_EMAIL}>`,
      to : receiverEmail,
      subject,
      html : body
    }


    try {
        await sendGridMail.send(mailOptions)
        log.info('Prod email has been sending to Earth')
    } catch (error) {
      log.error('Error sending email to me i can isiis ', error);
      throw new BadRequestError('Error Sending Email can check it please ugh');
    }

  }
}
 export const mailTransport : MailTransport = new MailTransport();
//
