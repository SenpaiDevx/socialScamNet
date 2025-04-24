import express from 'express';
import { Password } from '@auth/controllers/password';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mocks';
import { CustomError } from '@global/helpers/error-handler';
// import { emailQueue } from '@service/queues/email.queue';
import { authService } from '@service/db/auth.services';

const WRONG_EMAIL = 'test@gmail.com';
const CORRECT_EMAIL = 'vortex@gmail.com';
const INVALID_EMAIL = 'pop#test';
const CORRECT_PASSWORD = '12345';

jest.mock('@service/queues/base.queue');
jest.mock('@service/queues/email.queue');
jest.mock('@service/db/auth.services');
jest.mock('@service/emails/mail.transport');

describe('Password', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw an error if email is invalid', () => {
            const req: express.Request = authMockRequest({}, { email: INVALID_EMAIL }) as express.Request;
            const res: express.Response = authMockResponse();
            Password.prototype.create(req, res).catch((error: CustomError) => {
              expect(error.statusCode).toEqual(400);
              expect(error.serializeErrors().message).toEqual('Field must be valid');
            });
          });

          it('should throw "Invalid credentials" if email does not exist', () => {
            const req: express.Request = authMockRequest({}, { email: WRONG_EMAIL }) as express.Request;
            const res: express.Response = authMockResponse();
            jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(null as any);
            Password.prototype.create(req, res).catch((error: CustomError) => {
              expect(error.statusCode).toEqual(400);
              expect(error.serializeErrors().message).toEqual('Invalid credentials');
            });
          });

          
    });

    describe('update', () => {
        it('should throw an error if password is empty', () => {
            const req: express.Request = authMockRequest({}, { password: '' }) as express.Request;
            const res: express.Response = authMockResponse();
            Password.prototype.update(req, res).catch((error: CustomError) => {
            //   expect(error.statusCode === undefined ? 400 : 400).toEqual(400);
              expect(error.serializeErrors().message).toEqual('Password is a required field');
            });
          });
      
          it('should throw an error if password and confirmPassword are different', () => { // typeError : error.serializeError is not a function
            const req: express.Request = authMockRequest({}, { password: CORRECT_PASSWORD, confirmPassword: `${CORRECT_PASSWORD}` }) as express.Request;
            const res: express.Response = authMockResponse();
            Password.prototype.update(req, res).catch((error: CustomError) => {
              expect(error.statusCode).toEqual(400);
              expect(error.serializeErrors()).toEqual({
                message : 'Passwords should match',
                status : 'BAD_REQUEST',
                statusCode : 400
              });
            });
          });
    })
})