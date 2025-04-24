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
exports.Delete = void 0;
const post_cache_1 = require("../../../shared/services/redis/post.cache");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const post_queue_1 = require("../../../shared/services/queues/post.queue");
const post_1 = require("../../../shared/sockets/post");
const postCache = new post_cache_1.PostCache();
class Delete {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            post_1.socketIOPostObject.on('connection', (socket) => {
                socket.emit('delete post', req.params.postId);
            });
            yield postCache.deletePostFromCache(req.params.postId, `${req.currentUser.userId}`);
            post_queue_1.postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser.userId });
            res.status(http_status_codes_1.default.OK).json({ message: 'Post deleted successfully' });
        });
    }
}
exports.Delete = Delete;
//# sourceMappingURL=delete-post.js.map