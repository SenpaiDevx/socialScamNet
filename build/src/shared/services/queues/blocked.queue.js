"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockedUserQueue = void 0;
const base_queue_1 = require("../queues/base.queue");
const blocked_worker_1 = require("../../workers/blocked.worker");
class BlockedUserQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('blockedUsers');
        this.processJob('addBlockedUserToDB', 5, blocked_worker_1.blockedUserWorker.addBlockedUserToDB);
        this.processJob('removeBlockedUserFromDB', 5, blocked_worker_1.blockedUserWorker.addBlockedUserToDB);
    }
    addBlockedUserJob(name, data) {
        this.addJob(name, data);
    }
}
exports.blockedUserQueue = new BlockedUserQueue();
//# sourceMappingURL=blocked.queue.js.map