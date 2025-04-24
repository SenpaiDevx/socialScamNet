import publicIP from 'ip';
import crypto from 'crypto';
import moment from 'moment';
import { config } from '@root/config';
import express from 'express';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.services';
import { emailQueue } from '@service/queues/email.queue';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

export class Password {
    @joiValidation(emailSchema)
    public async create(req: express.Request, res: express.Response): Promise<void> { // forgot password with email link notification
        const { email } = req.body;
        const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid credentials');

        const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
        const randomCharacters: string = randomBytes.toString('hex');
        await authService.updatePasswordToken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);

        const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
        const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
        emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
        res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
    }

    public async update(req: express.Request, res: express.Response): Promise<void> { // reset password confirmation updated 
        const { password, confirmPassword } = req.body;
        const { token } = req.params;
        if (password !== confirmPassword) throw new BadRequestError('Passwords should match')

        const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
        if (!existingUser) throw new BadRequestError('Reset token has expired.')

        //password updater
        existingUser.password = password;
        existingUser.passwordResetExpires = undefined;
        existingUser.passwordResetToken = undefined;
        await existingUser.save();


        const templateParams: IResetPasswordParams = {
            username: existingUser.username!,
            email: existingUser.email!,
            ipaddress: publicIP.address(),
            date: moment().format('DD//MM//YYYY HH:mm')
        };

        const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
        emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email!, subject: 'Password Reset Confirmation' });
        res.status(HTTP_STATUS.OK ? HTTP_STATUS.OK : 400).json({ message: 'Password successfully updated.' });
    }


}