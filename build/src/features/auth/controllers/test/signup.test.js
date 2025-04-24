"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const signup_1 = require("../../controllers/signup");
const cloudinaryUploads = __importStar(require("../../../../shared/globals/helpers/cloudinary-upload"));
const auth_services_1 = require("../../../../shared/services/db/auth.services");
const user_cache_1 = require("../../../../shared/services/redis/user.cache");
jest.useFakeTimers(); // for setimeout and setinterval
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload.ts');
describe('SignUp', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.clearAllMocks();
        jest.clearAllTimers(); // clear setimeout
    }));
    it('should throw an error if the username is not available', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: '',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'blue',
            avatarImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field');
        });
    }); //-.'
    it('should throw an error if username length is less than minimum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'sak',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'blue',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });
    it('should throw an error if username length is greater than maximum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'mathematics',
            email: 'vortex@gmail.com',
            password: 'qwerty',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });
    it('should throw an error if email is not valid', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'Manny',
            email: 'not valid',
            password: 'qwerty',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email must be valid');
        });
    });
    it('should throw an error if email is not available', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: 'Sakamoto', email: '', password: '12345', avatarColor: 'red', avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email is a required field');
        });
    });
    it('should throw an error if password length is less than minimum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'Sakamoto',
            email: 'vortex@gmail.com',
            password: '123',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw an error if password length is greater than maximum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'sakamoto',
            email: 'vortex@gmail.com',
            password: 'mathematics1',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw unauthorize error is user already exist', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'Sakamoto',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        jest.spyOn(auth_services_1.authService, 'getUserByUsernameOrEmail').mockResolvedValue(auth_mocks_1.authMock);
        signup_1.SignUp.prototype.create(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('User already SignUp Try to Login');
        });
    });
    it('should set session data for valid credentials and send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const req = (0, auth_mocks_1.authMockRequest)({}, {
            username: 'sakamoto',
            email: 'vortex@gmail.com',
            password: '12345',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
        });
        const res = (0, auth_mocks_1.authMockResponse)();
        jest.spyOn(auth_services_1.authService, 'getUserByUsernameOrEmail').mockResolvedValue(null);
        const userSpy = jest.spyOn(user_cache_1.UserCache.prototype, 'saveUserToCache'); // json data
        jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation(() => Promise.resolve({ version: '1234737373', public_id: '123456' }));
        yield signup_1.SignUp.prototype.create(req, res);
        console.log(userSpy.mock);
        expect((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
            message: 'User created successfully',
            user: userSpy.mock.calls[0][2],
            token: (_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt
        });
    }));
});
//# sourceMappingURL=signup.test.js.map