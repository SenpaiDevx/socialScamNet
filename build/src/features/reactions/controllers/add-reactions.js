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
exports.Add = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const joi_validation_decorators_1 = require("../../../shared/globals/decorators/joi-validation.decorators");
const reactions_1 = require("../schemes/reactions");
const reaction_cache_1 = require("../../../shared/services/redis/reaction.cache");
const reaction_queue_1 = require("../../../shared/services/queues/reaction.queue");
const reactionCache = new reaction_cache_1.ReactionCache();
class Add {
    reaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body;
            const reactionObject = {
                _id: new mongodb_1.ObjectId(),
                postId,
                type,
                avataColor: req.currentUser.avatarColor,
                username: req.currentUser.username,
                profilePicture
            };
            yield reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);
            const databaseReactionData = {
                postId,
                userTo,
                userFrom: req.currentUser.userId,
                username: req.currentUser.username,
                type,
                previousReaction,
                reactionObject
            };
            reaction_queue_1.reactionQueue.addReactionJob('addReactionToDB', databaseReactionData); // this is reference to \workers\reaction.worker.ts -> wherein no "key" & "value" need to desctructured on 
            res.status(http_status_codes_1.default.OK).json({ message: 'Reaction added successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorators_1.joiValidation)(reactions_1.addReactionSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "reaction", null);
exports.Add = Add;
//# sourceMappingURL=add-reactions.js.map