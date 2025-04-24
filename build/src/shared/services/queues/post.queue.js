"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQueue = void 0;
const base_queue_1 = require("../queues/base.queue");
const post_worker_1 = require("../../workers/post.worker");
class PostQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('posts');
        this.processJob('addPostToDB', 5, post_worker_1.postWorker.savePostToDB);
        this.processJob('deletePostFromDB', 5, post_worker_1.postWorker.deletePostFromDB);
        this.processJob('updatePostInDB', 5, post_worker_1.postWorker.updatePostInDB);
    }
    addPostJob(name, data) {
        this.addJob(name, data);
    }
}
exports.postQueue = new PostQueue();
//# sourceMappingURL=post.queue.js.map