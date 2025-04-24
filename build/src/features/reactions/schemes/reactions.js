"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeReactionSchema = exports.addReactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addReactionSchema = joi_1.default.object().keys({
    userTo: joi_1.default.string().required().messages({
        'any.required': 'userTo is a required property'
    }),
    postId: joi_1.default.string().required().messages({
        'any.required': 'postId is a required property'
    }),
    type: joi_1.default.string().required().messages({
        'any.required': 'Reaction type is a required property'
    }),
    profilePicture: joi_1.default.string().optional().allow(null, ''),
    previousReaction: joi_1.default.string().optional().allow(null, ''),
    postReactions: joi_1.default.object().optional().allow(null, '')
});
exports.addReactionSchema = addReactionSchema;
const removeReactionSchema = joi_1.default.object().keys({
    postReactions: joi_1.default.object().optional().allow(null, '')
});
exports.removeReactionSchema = removeReactionSchema;
//# sourceMappingURL=reactions.js.map