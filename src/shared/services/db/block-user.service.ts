import mongoose, { Condition } from 'mongoose';
import { ObjectId, PushOperator } from 'mongodb';
import { UserModel } from '@user/models/user.schema';

class BlockUserService {
  public async blockUser(userId: Condition<ObjectId> | undefined | string, followerId: Condition<ObjectId> | undefined | string): Promise<any> {
    UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId, blocked: { $ne: new mongoose.Types.ObjectId(followerId) } },
          update: {
            $push: {
              blocked: new mongoose.Types.ObjectId(followerId)
            }
          }
        }
      },
      {
        updateOne: {
          filter: { _id: followerId, blockedBy: { $ne: new mongoose.Types.ObjectId(userId) } },
          update: {
            $push: {
              blockedBy: new mongoose.Types.ObjectId(userId)
            } as PushOperator<Document>
          }
        }
      }
    ]);
  }

  public async unblockUser(userId: string, followerId: string): Promise<void> {
    UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: {
            $pull: {
              blocked: new mongoose.Types.ObjectId(followerId)
            } as PushOperator<Document>
          }
        }
      },
      {
        updateOne: {
          filter: { _id: followerId },
          update: {
            $pull: {
              blockedBy: new mongoose.Types.ObjectId(userId)
            } as PushOperator<Document>
          }
        }
      }
    ]);
  }
}

export const blockUserService: BlockUserService = new BlockUserService();
