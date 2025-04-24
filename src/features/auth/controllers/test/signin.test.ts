import { authMock, authMockRequest, authMockResponse, IAuthMock } from '@root/mocks/auth.mocks';
import express from 'express';
import { CustomError } from '@global/helpers/error-handler';
import { SignIn } from '@auth/controllers/signin';
import { Helpers } from '@global/helpers/helpers';
import { authService } from '@service/db/auth.services';
import { userService } from '@service/db/user.service';
import { mergedAuthAndUserData } from '@root/mocks/user.mock';

const USERNAME = 'sakamoto';
const PASSWORD = '12345';
const WRONG_USERNAME = 'saka';
const WRONG_PASSWORD = '123';
const LONG_PASSWORD = '192323';
const LONG_USERNAME = 'sakamotor_rex';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');

describe('SignIn', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should throw an error if username is not available', () => {
    const req: express.Request = authMockRequest({}, { username: '', password: PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });

  it('should throw an error if username length is less than minimum length', () => {
    const req: express.Request = authMockRequest({}, { username: WRONG_USERNAME, password: PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if username length is greater than maximum length', () => {
    const req: express.Request = authMockRequest({}, { username: LONG_USERNAME, password: PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if password is not available', () => {
    const req: express.Request = authMockRequest({}, { username: USERNAME, password: '' }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  it('should throw an error if password length is less than minimum length', () => {
    const req: express.Request = authMockRequest({}, { username: USERNAME, password: WRONG_PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw an error if password length is greater than maximum length', () => {
    const req: express.Request = authMockRequest({}, { username: USERNAME, password: LONG_PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw "Invalid credentials" if username does not exist', () => {
    const req: express.Request = authMockRequest({}, { username: 'Sakamoto', password: '43211' }) as express.Request;
    const res: express.Response = authMockResponse();
    jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValueOnce(null as any);

    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(authService.getAuthUserByUsername).toHaveBeenCalledWith(Helpers.firstLetterUppercase(req.body.username));
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  it('should throw "Invalid credentials" if password does not exist', () => {
    const req: express.Request = authMockRequest({}, { username: 'Sakamoto', password: '910221' }) as express.Request;
    const res: express.Response = authMockResponse();
    jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValueOnce(null as any);

    SignIn.prototype.read(req, res).catch((error: CustomError) => {
      expect(authService.getAuthUserByUsername).toHaveBeenCalledWith(Helpers.firstLetterUppercase(req.body.username));
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: express.Request = authMockRequest({}, { username: 'Sakamoto', password: PASSWORD }) as express.Request;
    console.log(req)
    const res: express.Response = authMockResponse();
    authMock.comparePassword = () => Promise.resolve(true);

    jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValue(authMock);
    jest.spyOn(userService, 'getUserByAuthId').mockResolvedValue(mergedAuthAndUserData);

    await SignIn.prototype.read(req, res)

    expect(req.session?.jwt).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User login successfully',
      user: mergedAuthAndUserData,
      token: req.session?.jwt
    });
  });


})