import { INotificationDocument } from '@notification/interfaces/notification.interface';
import { notificationService } from '@service/db/notification.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Get {
  public async notifications(req: Request, res: Response): Promise<void> {
    console.log(req.currentUser!.userId)
    const notifications: INotificationDocument[] = await notificationService.getNotifications(req.currentUser!.userId);
    console.log(notifications)
    res.status(HTTP_STATUS.OK).json({ message: 'User notifications', notifications });
  }
}
