import express from "express";
import { authMockRequest, authMockResponse, authMock } from "@root/mocks/auth.mocks";
import { SignUp } from "@auth/controllers/signup"
import { CustomError } from "@global/helpers/error-handler";
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { authService } from "@service/db/auth.services";
import { UserCache } from "@service/redis/user.cache";


jest.useFakeTimers(); // for setimeout and setinterval
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload.ts');

describe('SignUp', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

    afterAll(async () => {
      jest.clearAllMocks();
      jest.clearAllTimers(); // clear setimeout
    })
  
  
    it('should throw an error if the username is not available', () => {
      const req : express.Request = authMockRequest({}, {
        username : '',
        email : 'vortex@gmail.com',
        password : '12345',
        avatarColor : 'blue',
        avatarImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
      }) as express.Request
  
      const res : express.Response = authMockResponse();
      SignUp.prototype.create(req, res).catch((error: CustomError) => {
        expect(error.statusCode).toEqual(400)
        expect(error.serializeErrors().message).toEqual('Username is a required field')
      })
    }); //-.'

    it('should throw an error if username length is less than minimum length', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'sak',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'blue',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res:express. Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Invalid username');
        });
      });

      it('should throw an error if username length is greater than maximum length', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'mathematics',
            email: 'vortex@gmail.com',
            password: 'qwerty',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Invalid username');
        });
      });

      it('should throw an error if email is not valid', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'Manny',
            email: 'not valid',
            password: 'qwerty',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
    
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Email must be valid');
        });
      });

      it('should throw an error if email is not available', () => {
        const req: express.Request = authMockRequest(
          {},
          { username: 'Sakamoto', email: '', password: '12345', avatarColor: 'red', avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' }
        ) as express.Request;
        const res: express.Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Email is a required field');
        });
      });

      it('should throw an error if password length is less than minimum length', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'Sakamoto',
            email: 'vortex@gmail.com',
            password: '123',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Invalid password');
        });
      });

      it('should throw an error if password length is greater than maximum length', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'sakamoto',
            email: 'vortex@gmail.com',
            password: 'mathematics1',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('Invalid password');
        });
      });

      it('should throw unauthorize error is user already exist', () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'Sakamoto',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
    
        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
        SignUp.prototype.create(req, res).catch((error: CustomError) => {
          expect(error.statusCode).toEqual(400);
          expect(error.serializeErrors().message).toEqual('User already SignUp Try to Login');
        });
      });

      it('should set session data for valid credentials and send correct json response', async () => {
        const req: express.Request = authMockRequest(
          {},
          {
            username: 'sakamoto',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
          }
        ) as express.Request;
        const res: express.Response = authMockResponse();
    
        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);
        const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache'); // json data
        jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '1234737373', public_id: '123456' }));
    
        await SignUp.prototype.create(req, res);
        console.log(userSpy.mock)
        expect(req.session?.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
          message: 'User created successfully',
          user: userSpy.mock.calls[0][2],
          token: req.session?.jwt
        });
      });

  })