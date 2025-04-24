import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { find } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('reactionsCache');

export class ReactionCache extends BaseCache {
    constructor() {
        super('reactionsCache');
    }
    
    public async savePostReactionToCache(key: string, reaction: IReactionDocument, postReactions: IReactions, type: string, previousReaction: string): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            
            if (previousReaction) {
                // for remove prev reactions
                this.removePostReactionFromCache(key, reaction.username, postReactions);
            }
            
            if (type) {
                await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction)); // always insert to the start index
                // const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)]
                await this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions));; // overwrite the existing objects ref keys 
            }
            console.log('error log here 1')
            
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again. : ' + error);
        }
    }

    public async removePostReactionFromCache(key: string, username: string, postReactions: IReactions): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const response: string[] = await this.client.LRANGE(`reactions:${key}`, 0, -1); // get a list of reactions as array of object -> 0 , -1 means all elements
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            const userPreviousReaction: IReactionDocument = this.getPreviousReaction(response, username) as IReactionDocument;
            multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction)) // remove the user previous reaction from the list of reactions
            // hash key , no of item to remove, element to remove
            await multi.exec();

            await this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions))
        } catch (error) {

        }
    }

    private getPreviousReaction(response: string[], username: string): IReactionDocument | undefined {
        const list: IReactionDocument[] = [];
        console.log(response)
        for (const item of response) {
            list.push(Helpers.parseJson(item) as IReactionDocument);
        }
        return find(list, (listItem: IReactionDocument) => {
            return listItem.username === username;
        });
    }

    public async getReactionsFromCache (postId : string) : Promise<[IReactionDocument[], number]> {
        try {
            if (!this.client.isOpen) {
              await this.client.connect();
            }
            const reactionsCount: number = await this.client.LLEN(`reactions:${postId}`); // get the length of the list
            const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
            const list: IReactionDocument[] = [];
            for (const item of response) {
              list.push(Helpers.parseJson(item));
            }
            return response.length ? [list, reactionsCount] : [[], 0]; // 1st index is the list of reactions , 2nd index is the count of reactions
          } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
          }
    }

    public async getSingleReactionByUsernameFromCache(postId: string, username: string): Promise<[IReactionDocument, number] | []> {
        try {
          if (!this.client.isOpen) {
            await this.client.connect();
          }
          const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
          const list: IReactionDocument[] = [];
          for (const item of response) {
            list.push(Helpers.parseJson(item));
          }
          const result: IReactionDocument = find(list, (listItem: IReactionDocument) => {
            return listItem?.postId === postId && listItem?.username === username;
          }) as IReactionDocument;
    
          return result ? [result, 1] : [];
        } catch (error) {
          log.error(error); 
          throw new ServerError('Server error. Try again.');
        }
      }

    // get single reaction/postId & username



}