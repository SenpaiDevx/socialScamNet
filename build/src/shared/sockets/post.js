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
exports.SocketIOPostHandler = exports.socketIOPostObject = void 0;
class SocketIOPostHandler {
    constructor(io) {
        this.io = io;
        exports.socketIOPostObject = io;
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.io.on('connection', (socket) => {
                socket.on('reaction', (reaction) => {
                    this.io.emit('update like', reaction);
                });
                socket.on('comment', (data) => {
                    this.io.emit('update comment', data);
                });
            });
        });
    }
}
exports.SocketIOPostHandler = SocketIOPostHandler;
//# sourceMappingURL=post.js.map