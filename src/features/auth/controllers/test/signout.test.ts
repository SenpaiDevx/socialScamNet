import express from 'express';
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mocks';
import { SignOut } from '@auth/controllers/signout';

const USERNAME = 'Sakamoto';
const PASSWORD = '12345';

describe('SignOut', () => {
  it('should set session to null', async () => {
    const req: express.Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    await SignOut.prototype.update(req, res);
    expect(req.session).toBeNull();
  });

  it('should send correct json response', async () => {
    const req: express.Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }) as express.Request;
    const res: express.Response = authMockResponse();
    await SignOut.prototype.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logout successful',
      user: {},
      token: ''
    });
  });
});