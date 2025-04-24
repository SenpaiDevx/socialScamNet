import publicIP from 'ip';
import moment from 'moment';
import express from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';
import { loginSchema } from '@auth/schemes/signin';
import { userService } from '@service/db/user.service';
import { authService } from '@service/db/auth.services';
import { emailQueue } from '@service/queues/email.queue';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { IUserDocument, IResetPasswordParams } from '@user/interfaces/user.interface';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

export class SignIn {
    @joiValidation(loginSchema)
    public async read(req: express.Request, res: express.Response): Promise<void> {
        const { username, password } = req.body
        const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
        if (!existingUser) throw new BadRequestError('Invalid credentials');

        const passwordsMatch: boolean = await existingUser.comparePassword(password);
        if (!passwordsMatch) throw new BadRequestError('Invalid password');

        const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
        const userJwt: string = JWT.sign(
            {
                userId: user._id,
                uId: existingUser.uId,
                email: existingUser.email,
                username: existingUser.username,
                avatarColor: existingUser.avatarColor
            },
            config.JWT_TOKEN!
        );
        req.session = { jwt: userJwt };
        const userDocument: IUserDocument = {
            ...user,
            authId: existingUser!._id,
            username: existingUser!.username,
            email: existingUser!.email,
            avatarColor: existingUser!.avatarColor,
            uId: existingUser!.uId, 
            createdAt: existingUser!.createdAt
        } as IUserDocument;

        // const resetLink = `${config.CLIENT_URL}/reset-password?token=${userJwt}`
        // const template = forgotPasswordTemplate.passwordResetTemplate(username, resetLink);
        // emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: 'kali23@ethereal.email', subject: 'I think you forgot your password click the link' })

        // const templateParam: IResetPasswordParams = {
        //     username: existingUser.username!,
        //     email: existingUser.email!,
        //     ipaddress: publicIP.address(),
        //     date: moment().format('DD/MM/YY HH:mm')
        // }

        // const resetTemplate = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParam);
        // emailQueue.addEmailJob('resetPasswordEmail', {template : resetTemplate, receiverEmail : 'kali23@ethereal.email', subject : 'click the button to get the reset email confirmation! =)'})



        res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJwt });
    }
}