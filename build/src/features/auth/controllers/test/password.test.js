"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_1 = require("../../controllers/password");
const auth_mocks_1 = require("../../../../mocks/auth.mocks");
// import { emailQueue } from '../../../../shared/services/queues/email.queue';
const auth_services_1 = require("../../../../shared/services/db/auth.services");
const WRONG_EMAIL = 'test@gmail.com';
const CORRECT_EMAIL = 'vortex@gmail.com';
const INVALID_EMAIL = 'pop#test';
const CORRECT_PASSWORD = '12345';
jest.mock('@service/queues/base.queue');
jest.mock('@service/queues/email.queue');
jest.mock('@service/db/auth.services');
jest.mock('@service/emails/mail.transport');
describe('Password', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should throw an error if email is invalid', () => {
            const req = (0, auth_mocks_1.authMockRequest)({}, { email: INVALID_EMAIL });
            const res = (0, auth_mocks_1.authMockResponse)();
            password_1.Password.prototype.create(req, res).catch((error) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Field must be valid');
            });
        });
        it('should throw "Invalid credentials" if email does not exist', () => {
            const req = (0, auth_mocks_1.authMockRequest)({}, { email: WRONG_EMAIL });
            const res = (0, auth_mocks_1.authMockResponse)();
            jest.spyOn(auth_services_1.authService, 'getAuthUserByEmail').mockResolvedValue(null);
            password_1.Password.prototype.create(req, res).catch((error) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Invalid credentials');
            });
        });
    });
    describe('update', () => {
        it('should throw an error if password is empty', () => {
            const req = (0, auth_mocks_1.authMockRequest)({}, { password: '' });
            const res = (0, auth_mocks_1.authMockResponse)();
            password_1.Password.prototype.update(req, res).catch((error) => {
                //   expect(error.statusCode === undefined ? 400 : 400).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Password is a required field');
            });
        });
        it('should throw an error if password and confirmPassword are different', () => {
            const req = (0, auth_mocks_1.authMockRequest)({}, { password: CORRECT_PASSWORD, confirmPassword: `${CORRECT_PASSWORD}` });
            const res = (0, auth_mocks_1.authMockResponse)();
            password_1.Password.prototype.update(req, res).catch((error) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors()).toEqual({
                    message: 'Passwords should match',
                    status: 'BAD_REQUEST',
                    statusCode: 400
                });
            });
        });
    });
});
//# sourceMappingURL=password.test.js.map