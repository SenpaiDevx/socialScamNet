"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = require("../../../features/user/models/user.schema");
class BlockUserService {
    blockUser(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            user_schema_1.UserModel.bulkWrite([
                {
                    updateOne: {
                        filter: { _id: userId, blocked: { $ne: new mongoose_1.default.Types.ObjectId(followerId) } },
                        update: {
                            $push: {
                                blocked: new mongoose_1.default.Types.ObjectId(followerId)
                            }
                        }
                    }
                },
                {
                    updateOne: {
                        filter: { _id: followerId, blockedBy: { $ne: new mongoose_1.default.Types.ObjectId(userId) } },
                        update: {
                            $push: {
                                blockedBy: new mongoose_1.default.Types.ObjectId(userId)
                            }
                        }
                    }
                }
            ]);
        });
    }
    unblockUser(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            user_schema_1.UserModel.bulkWrite([
                {
                    updateOne: {
                        filter: { _id: userId },
                        update: {
                            $pull: {
                                blocked: new mongoose_1.default.Types.ObjectId(followerId)
                            }
                        }
                    }
                },
                {
                    updateOne: {
                        filter: { _id: followerId },
                        update: {
                            $pull: {
                                blockedBy: new mongoose_1.default.Types.ObjectId(userId)
                            }
                        }
                    }
                }
            ]);
        });
    }
}
exports.blockUserService = new BlockUserService();
//# sourceMappingURL=block-user.service.js.map