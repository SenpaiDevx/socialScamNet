import { notificationQueue } from '@service/queues/notification.queue';
import { socketIONotificationObject } from '@socket/notification';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Socket } from 'socket.io';

export class Update {
  public async notification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    socketIONotificationObject.on('connection', (socket : Socket) => {
        socket.emit('update notification', notificationId)
    })
    notificationQueue.addNotificationJob('updateNotification', { key: notificationId });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification marked as read' });
  }
}
