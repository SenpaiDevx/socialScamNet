import HTTP_STATUS from 'http-status-codes';
import express from 'express';

export class SignOut {
  public async update(req: express.Request, res: express.Response): Promise<void> {
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' });
  }
} 