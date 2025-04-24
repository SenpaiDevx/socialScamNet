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
exports.GetPosts = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const post_cache_1 = require("../../../shared/services/redis/post.cache");
const post_service_1 = require("../../../shared/services/db/post.service");
const postCache = new post_cache_1.PostCache();
const PAGE_SIZE = 10;
class GetPosts {
    posts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE; // skip the first (page - 1) * PAGE_SIZE items, so we get the next PAGE_SIZE items
            const limit = PAGE_SIZE * parseInt(page); // get the next PAGE_SIZE items, starting from the current skip position
            const newSkip = skip === 0 ? skip : skip + 1; // if skip is 0, we don't want to skip any items, so we set it
            let posts = [];
            let totalPosts = 0;
            console.log(typeof (page));
            const cachedPosts = yield postCache.getPostsFromCache('post', newSkip, limit); // get the posts from the cache
            if (cachedPosts.length) {
                posts = cachedPosts;
                totalPosts = yield postCache.getTotalPostsInCache();
            }
            else {
                posts = yield post_service_1.postService.getPosts({}, skip, limit, { createdAt: -1 });
                totalPosts = yield post_service_1.postService.postsCount();
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'All posts', posts, totalPosts });
        });
    }
    postsWithImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = PAGE_SIZE * parseInt(page);
            const newSkip = skip === 0 ? skip : skip + 1;
            let posts = [];
            const cachedPosts = yield postCache.getPostsWithImagesFromCache('post', newSkip, limit);
            posts = cachedPosts.length ? cachedPosts : yield post_service_1.postService.getPosts({ imgId: '$ne', gifUrl: '$ne' }, skip, limit, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'All posts with images', posts });
        });
    }
    postsWithVideos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            const skip = (parseInt(page) - 1) * PAGE_SIZE;
            const limit = PAGE_SIZE * parseInt(page);
            const newSkip = skip === 0 ? skip : skip + 1;
            let posts = [];
            const cachedPosts = yield postCache.getPostsWithVideosFromCache('post', newSkip, limit);
            posts = cachedPosts.length ? cachedPosts : yield post_service_1.postService.getPosts({ videoId: '$ne' }, skip, limit, { createdAt: -1 });
            res.status(http_status_codes_1.default.OK).json({ message: 'All posts with videos', posts });
        });
    }
}
exports.GetPosts = GetPosts;
//# sourceMappingURL=get-posts.js.map