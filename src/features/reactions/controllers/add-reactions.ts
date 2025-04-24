import express from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { addReactionSchema } from '@reaction/schemes/reactions';
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';
import { reactionQueue } from '@service/queues/reaction.queue';

const reactionCache: ReactionCache = new ReactionCache();

export class Add {
    @joiValidation(addReactionSchema)
    public async reaction(req: express.Request, res: express.Response): Promise<void> {
        const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body;
        const reactionObject : IReactionDocument = {
            _id : new ObjectId(), // <- conflict id that generate own id
            postId,
            type,
            avataColor : req.currentUser!.avatarColor,
            username : req.currentUser!.username,
            profilePicture
        } as IReactionDocument;
        await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);

        const databaseReactionData: IReactionJob = {
            postId,
            userTo,
            userFrom: req.currentUser!.userId,
            username: req.currentUser!.username, 
            type,
            previousReaction,
            reactionObject
          };
          reactionQueue.addReactionJob('addReactionToDB', databaseReactionData); // this is reference to \workers\reaction.worker.ts -> wherein no "key" & "value" need to desctructured on 
          res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' });
        
    }
}