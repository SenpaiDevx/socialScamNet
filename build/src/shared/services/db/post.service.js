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
exports.postService = void 0;
const post_schema_1 = require("../../../features/post/models/post.schema");
const user_schema_1 = require("../../../features/user/models/user.schema");
class PostService {
    addPostToDB(userId, createdPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = post_schema_1.PostModel.create(createdPost);
            const user = user_schema_1.UserModel.updateOne({ _id: userId }, { $inc: { postsCount: 1 } });
            yield Promise.all([post, user]);
        });
    }
    getPosts(query, skip = 0, limit = 0, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            let postQuery = {};
            if ((query === null || query === void 0 ? void 0 : query.imgId) && (query === null || query === void 0 ? void 0 : query.gifUrl)) {
                postQuery = { $or: [{ imgId: { $ne: '' } }, { gifUrl: { $ne: '' } }] }; // mongo db or condition
            }
            else if (query === null || query === void 0 ? void 0 : query.videoId) {
                postQuery = { $or: [{ videoId: { $ne: '' } }] };
            }
            else {
                postQuery = query;
            }
            const posts = yield post_schema_1.PostModel.aggregate([{ $match: postQuery }, { $sort: sort }, { $skip: skip }, { $limit: limit }]);
            return posts;
        });
    }
    postsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield post_schema_1.PostModel.find({}).countDocuments(); // find() with empty query returns all documents
            return count;
        });
    }
    ;
    deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePost = post_schema_1.PostModel.deleteOne({ _id: postId });
            const decrementPostCount = user_schema_1.UserModel.updateOne({ _id: userId }, { $inc: { postsCount: -1 } });
            yield Promise.all([deletePost, decrementPostCount]);
        });
    }
    editPost(postId, updatedPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePost = post_schema_1.PostModel.updateOne({ _id: postId }, { $set: updatedPost });
            yield Promise.all([updatePost]);
        });
    }
}
exports.postService = new PostService();
//# sourceMappingURL=post.service.js.map