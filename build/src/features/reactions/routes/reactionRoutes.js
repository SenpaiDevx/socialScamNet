"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/helpers/auth-middleware");
const add_reactions_1 = require("../controllers/add-reactions");
const remove_reaction_1 = require("../controllers/remove-reaction");
const get_reactions_1 = require("../controllers/get-reactions");
class ReactionRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/post/reactions/:postId', auth_middleware_1.authMiddleware.checkAuthentication, get_reactions_1.Get.prototype.reactions);
        this.router.get('/post/single/reaction/username/:username/:postId', auth_middleware_1.authMiddleware.checkAuthentication, get_reactions_1.Get.prototype.singleReactionByUsername);
        this.router.get('/post/reactions/username/:username', auth_middleware_1.authMiddleware.checkAuthentication, get_reactions_1.Get.prototype.reactionsByUsername);
        this.router.post('/post/reaction', auth_middleware_1.authMiddleware.checkAuthentication, add_reactions_1.Add.prototype.reaction);
        this.router.delete('/post/reaction/:postId/:previousReaction/:postReactions', auth_middleware_1.authMiddleware.checkAuthentication, remove_reaction_1.Remove.prototype.reaction);
        return this.router;
    }
}
exports.reactionRoutes = new ReactionRoutes();
//# sourceMappingURL=reactionRoutes.js.map