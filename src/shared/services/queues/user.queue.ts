import { BaseQueue } from '@service/queues/base.queue';
import { userWorker } from '@worker/user.worker';
import { IUserJob } from '@user/interfaces/user.interface';

class UserQueue extends BaseQueue {
  constructor() {
    super('userQueue');
    // when you comment this when it execute on bull dashboard create waiting queue
    this.processJob('addUserToDB', 5, userWorker.addUserToDB); // already called in authQueue variable type AuthQueue and ready to execute
    this.processJob('updateSocialLinksInDB', 5, userWorker.updateSocialLinks);
    this.processJob('updateBasicInfoInDB', 5, userWorker.updateUserInfo);
    this.processJob('updateNotificationSettings', 5, userWorker.updateNotificationSettings);

  }

  public async addUserJob(name: string, data: IUserJob): Promise<void> {
    this.addJob(name, data);
  }
}
export const userQueue: UserQueue = new UserQueue();