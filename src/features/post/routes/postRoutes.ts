import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Create } from '@post/controllers/create-post';
import { GetPosts } from '@post/controllers/get-posts';
import { Delete } from '@post/controllers/delete-post';
import { Update } from '@post/controllers/update-post';

export class PostRoutes {
    private router : Router;

    constructor () {
        this.router = express.Router();
    }

    public routes() : Router {
        this.router.get('/post/all/:page',  authMiddleware.checkAuthentication, GetPosts.prototype.posts);
        this.router.get('/post/images/:page', authMiddleware.checkAuthentication, GetPosts.prototype.postsWithImages);
        this.router.get('/post/videos/:page', authMiddleware.checkAuthentication, GetPosts.prototype.postsWithVideos);

        this.router.post('/post', authMiddleware.checkAuthentication, Create.prototype.post);
        this.router.post('/post/image/post', authMiddleware.checkAuthentication, Create.prototype.postWithImage);
        this.router.post('/post/video/post', authMiddleware.checkAuthentication, Create.prototype.postWithVideo);

        
        this.router.put('/post/:postId', authMiddleware.checkAuthentication, Update.prototype.posts)
        this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithImage);
        this.router.put('/post/video/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithVideo);
        
        this.router.delete('/post/:postId', authMiddleware.checkAuthentication, Delete.prototype.post)
        
        return this.router;
    }
}

export const postRoutes: PostRoutes = new PostRoutes();