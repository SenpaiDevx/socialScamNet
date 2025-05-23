import express from 'express';
import { PostCache } from '@service/redis/post.cache';
import HTTP_STATUS from 'http-status-codes';
import { postQueue } from '@service/queues/post.queue';
import { socketIOPostObject } from '@socket/post';
import { Socket } from 'socket.io';

const postCache: PostCache = new PostCache();

export class Delete {
  public async post(req: express.Request, res: express.Response): Promise<void> {

    socketIOPostObject.on('connection', (socket: Socket) => {
      socket.emit('delete post', req.params.postId)
    })
    await postCache.deletePostFromCache(req.params.postId, `${req.currentUser!.userId}`);
    postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser!.userId });
    res.status(HTTP_STATUS.OK).json({ message: 'Post deleted successfully' });
  }
}
