import express from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Helpers } from '@global/helpers/helpers';
import { userService } from '@service/db/user.service';
import { ISearchUser } from '@user/interfaces/user.interface';

export class Search {
  public async user(req: express.Request, res: express.Response): Promise<void> {
    const regex = new RegExp(Helpers.escapeRegex(req.params.query), 'i');
    const users: ISearchUser[] = await userService.searchUsers(regex);
    res.status(HTTP_STATUS.OK).json({ message: 'Search results', search: users });
  }
}
