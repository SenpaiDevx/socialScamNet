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
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
const signin_1 = require("../../controllers/signin");
const helpers_1 = require("../../../../shared/globals/helpers/helpers");
const auth_services_1 = require("../../../../shared/services/db/auth.services");
const user_service_1 = require("../../../../shared/services/db/user.service");
const user_mock_1 = require("../../../../mocks/user.mock");
const USERNAME = 'sakamoto';
const PASSWORD = '12345';
const WRONG_USERNAME = 'saka';
const WRONG_PASSWORD = '123';
const LONG_PASSWORD = '192323';
const LONG_USERNAME = 'sakamotor_rex';
jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
describe('SignIn', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    it('should throw an error if username is not available', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: '', password: PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field');
        });
    });
    it('should throw an error if username length is less than minimum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: WRONG_USERNAME, password: PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });
    it('should throw an error if username length is greater than maximum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: LONG_USERNAME, password: PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });
    it('should throw an error if password is not available', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: USERNAME, password: '' });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password is a required field');
        });
    });
    it('should throw an error if password length is less than minimum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: USERNAME, password: WRONG_PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw an error if password length is greater than maximum length', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: USERNAME, password: LONG_PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw "Invalid credentials" if username does not exist', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: 'Sakamoto', password: '43211' });
        const res = (0, auth_mocks_1.authMockResponse)();
        jest.spyOn(auth_services_1.authService, 'getAuthUserByUsername').mockResolvedValueOnce(null);
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(auth_services_1.authService.getAuthUserByUsername).toHaveBeenCalledWith(helpers_1.Helpers.firstLetterUppercase(req.body.username));
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid credentials');
        });
    });
    it('should throw "Invalid credentials" if password does not exist', () => {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: 'Sakamoto', password: '910221' });
        const res = (0, auth_mocks_1.authMockResponse)();
        jest.spyOn(auth_services_1.authService, 'getAuthUserByUsername').mockResolvedValueOnce(null);
        signin_1.SignIn.prototype.read(req, res).catch((error) => {
            expect(auth_services_1.authService.getAuthUserByUsername).toHaveBeenCalledWith(helpers_1.Helpers.firstLetterUppercase(req.body.username));
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid credentials');
        });
    });
    it('should set session data for valid credentials and send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: 'Sakamoto', password: PASSWORD });
        console.log(req);
        const res = (0, auth_mocks_1.authMockResponse)();
        auth_mocks_1.authMock.comparePassword = () => Promise.resolve(true);
        jest.spyOn(auth_services_1.authService, 'getAuthUserByUsername').mockResolvedValue(auth_mocks_1.authMock);
        jest.spyOn(user_service_1.userService, 'getUserByAuthId').mockResolvedValue(user_mock_1.mergedAuthAndUserData);
        yield signin_1.SignIn.prototype.read(req, res);
        expect((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt).toBeDefined();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User login successfully',
            user: user_mock_1.mergedAuthAndUserData,
            token: (_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt
        });
    }));
});
//# sourceMappingURL=signin.test.js.map