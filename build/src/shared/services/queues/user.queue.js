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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueue = void 0;
const base_queue_1 = require("../queues/base.queue");
const user_worker_1 = require("../../workers/user.worker");
class UserQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('userQueue');
        // when you comment this when it execute on bull dashboard create waiting queue
        this.processJob('addUserToDB', 5, user_worker_1.userWorker.addUserToDB); // already called in authQueue variable type AuthQueue and ready to execute
        this.processJob('updateSocialLinksInDB', 5, user_worker_1.userWorker.updateSocialLinks);
        this.processJob('updateBasicInfoInDB', 5, user_worker_1.userWorker.updateUserInfo);
        this.processJob('updateNotificationSettings', 5, user_worker_1.userWorker.updateNotificationSettings);
    }
    addUserJob(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addJob(name, data);
        });
    }
}
exports.userQueue = new UserQueue();
//# sourceMappingURL=user.queue.js.map