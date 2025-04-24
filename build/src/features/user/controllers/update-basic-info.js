"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edit = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_cache_1 = require("../../../shared/services/redis/user.cache");
const user_queue_1 = require("../../../shared/services/queues/user.queue");
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const info_1 = require("../schemes/info");
const userCache = new user_cache_1.UserCache();
class Edit {
    info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [key, value] of Object.entries(req.body)) {
                yield userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, key, `${value}`);
            }
            user_queue_1.userQueue.addUserJob('updateBasicInfoInDB', {
                key: `${req.currentUser.userId}`,
                value: req.body
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Updated successfully' });
        });
    }
    social(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userCache.updateSingleUserItemInCache(`${req.currentUser.userId}`, 'social', req.body);
            user_queue_1.userQueue.addUserJob('updateSocialLinksInDB', {
                key: `${req.currentUser.userId}`,
                value: req.body
            });
            res.status(http_status_codes_1.default.OK).json({ message: 'Updated successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(info_1.basicInfoSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Edit.prototype, "info", null);
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(info_1.socialLinksSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Edit.prototype, "social", null);
exports.Edit = Edit;
//# sourceMappingURL=update-basic-info.js.map