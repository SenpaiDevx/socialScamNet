import express from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostCache } from '@service/redis/post.cache';
import { postService } from '@service/db/post.service';

const postCache: PostCache = new PostCache();
const PAGE_SIZE = 10;


export class GetPosts {
    public async posts(req: express.Request, res: express.Response): Promise<void> {
        const { page } = req.params;
        const skip: number = (parseInt(page) - 1) * PAGE_SIZE; // skip the first (page - 1) * PAGE_SIZE items, so we get the next PAGE_SIZE items
        const limit: number = PAGE_SIZE * parseInt(page); // get the next PAGE_SIZE items, starting from the current skip position
        const newSkip: number = skip === 0 ? skip : skip + 1; // if skip is 0, we don't want to skip any items, so we set it
        let posts: IPostDocument[] = [];
        let totalPosts: number | undefined = 0;
        console.log(typeof(page))
        const cachedPosts: IPostDocument[] = await postCache.getPostsFromCache('post', newSkip, limit); // get the posts from the cache
        if (cachedPosts.length) {
            posts = cachedPosts;
            totalPosts = await postCache.getTotalPostsInCache();
        } else {
            posts = await postService.getPosts({}, skip, limit, { createdAt: -1 });
            totalPosts = await postService.postsCount();
        }
        res.status(HTTP_STATUS.OK).json({ message: 'All posts', posts, totalPosts });
    }

    public async postsWithImages(req: express.Request, res: express.Response): Promise<void> {
        const { page } = req.params;
        const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
        const limit: number = PAGE_SIZE * parseInt(page);
        const newSkip: number = skip === 0 ? skip : skip + 1;
        let posts: IPostDocument[] = [];
        const cachedPosts: IPostDocument[]  = await postCache.getPostsWithImagesFromCache('post', newSkip, limit);
        posts = cachedPosts.length ? cachedPosts : await postService.getPosts({ imgId: '$ne', gifUrl: '$ne' }, skip, limit, { createdAt: -1 });
        res.status(HTTP_STATUS.OK).json({ message: 'All posts with images', posts });
      }

      public async postsWithVideos(req: express.Request, res: express.Response): Promise<void> {
        const { page } = req.params;
        const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
        const limit: number = PAGE_SIZE * parseInt(page);
        const newSkip: number = skip === 0 ? skip : skip + 1;
        let posts: IPostDocument[] = [];
        const cachedPosts: IPostDocument[] = await postCache.getPostsWithVideosFromCache('post', newSkip, limit);
        posts = cachedPosts.length ? cachedPosts : await postService.getPosts({ videoId: '$ne' }, skip, limit, { createdAt: -1 });
        res.status(HTTP_STATUS.OK).json({ message: 'All posts with videos', posts });
      }
}

