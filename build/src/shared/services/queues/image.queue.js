"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageQueue = void 0;
const base_queue_1 = require("../queues/base.queue");
const image_worker_1 = require("../../workers/image.worker");
class ImageQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('images');
        this.processJob('addUserProfileImageToDB', 5, image_worker_1.imageWorker.addUserProfileImageToDB);
        this.processJob('updateBGImageInDB', 5, image_worker_1.imageWorker.updateBGImageInDB);
        this.processJob('addImageToDB', 5, image_worker_1.imageWorker.addImageToDB);
        this.processJob('removeImageFromDB', 5, image_worker_1.imageWorker.removeImageFromDB);
    }
    addImageJob(name, data) {
        this.addJob(name, data);
    }
}
exports.imageQueue = new ImageQueue();
//# sourceMappingURL=image.queue.js.map