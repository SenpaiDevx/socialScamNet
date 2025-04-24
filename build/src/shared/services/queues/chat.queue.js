"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatQueue = void 0;
const base_queue_1 = require("../queues/base.queue");
const chat_worker_1 = require("../../workers/chat.worker");
class ChatQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('chats');
        this.processJob('addChatMessageToDB', 5, chat_worker_1.chatWorker.addChatMessageToDB);
        this.processJob('markMessageAsDeletedInDB', 5, chat_worker_1.chatWorker.markMessageAsDeleted);
        this.processJob('markMessagesAsReadInDB', 5, chat_worker_1.chatWorker.markMessagesAsReadInDB);
        this.processJob('updateMessageReaction', 5, chat_worker_1.chatWorker.updateMessageReaction);
    }
    addChatJob(name, data) {
        this.addJob(name, data);
    }
}
exports.chatQueue = new ChatQueue();
//# sourceMappingURL=chat.queue.js.map