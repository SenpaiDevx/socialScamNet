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
const signout_1 = require("../../controllers/signout");
const USERNAME = 'Sakamoto';
const PASSWORD = '12345';
describe('SignOut', () => {
    it('should set session to null', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: USERNAME, password: PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        yield signout_1.SignOut.prototype.update(req, res);
        expect(req.session).toBeNull();
    }));
    it('should send correct json response', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, auth_mocks_1.authMockRequest)({}, { username: USERNAME, password: PASSWORD });
        const res = (0, auth_mocks_1.authMockResponse)();
        yield signout_1.SignOut.prototype.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Logout successful',
            user: {},
            token: ''
        });
    }));
});
//# sourceMappingURL=signout.test.js.map