import { notificationQueue } from '@service/queues/notification.queue';
import { socketIONotificationObject } from '@socket/notification';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Socket } from 'socket.io';

export class Delete {
  public async notification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;

    // socketIONotificationObject.emit('delete notification', notificationId); // Emit to all connected clients
    socketIONotificationObject.on('connection', (socket : Socket) => {
        socket.emit('delete notification', notificationId);
    })
    notificationQueue.addNotificationJob('deleteNotification', { key: notificationId });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification deleted successfully' });
  }
}
