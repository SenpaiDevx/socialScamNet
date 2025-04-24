import { IFileImageDocument } from '@image/interfaces/image.interface';
import { imageService } from '@service/db/image.service';
import express from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Get {
  public async images(req: express.Request, res: express.Response): Promise<void> {
    const images: IFileImageDocument[] = await imageService.getImages(req.params.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User images', images });
  }
}
