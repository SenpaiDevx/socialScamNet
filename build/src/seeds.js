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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const faker_1 = require("@faker-js/faker");
const lodash_1 = require("lodash");
const axios_1 = __importDefault(require("axios"));
const canvas_1 = require("canvas");
dotenv_1.default.config({});
function avatarColor() {
    const colors = [
        '#f44336',
        '#e91e63',
        '#2196f3',
        '#9c27b0',
        '#3f51b5',
        '#00bcd4',
        '#4caf50',
        '#ff9800',
        '#8bc34a',
        '#009688',
        '#03a9f4',
        '#cddc39',
        '#2962ff',
        '#448aff',
        '#84ffff',
        '#00e676',
        '#43a047',
        '#d32f2f',
        '#ff1744',
        '#ad1457',
        '#6a1b9a',
        '#1a237e',
        '#1de9b6',
        '#d84315'
    ];
    return colors[(0, lodash_1.floor)((0, lodash_1.random)(0.9) * colors.length)];
}
function generateAvatar(text, backgroundColor, foregroundColor = 'white') {
    const canvas = (0, canvas_1.createCanvas)(200, 200);
    const context = canvas.getContext('2d');
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png');
}
function seedUserData(count) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let i = 0;
        try {
            for (i = 0; i < count; i++) {
                const username = faker_1.faker.helpers.unique(faker_1.faker.word.adjective, [8]);
                const color = avatarColor();
                const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);
                const body = {
                    username,
                    email: faker_1.faker.internet.email(),
                    password: '54321',
                    avatarColor: color,
                    avatarImage: avatar
                };
                console.log(`***ADDING USER TO DATABASE*** - ${i + 1} of ${count} - ${username}`);
                yield axios_1.default.post(`${process.env.API_URL}/signup`, body);
            }
        }
        catch (error) {
            console.log((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
        }
    });
}
seedUserData(10);
//# sourceMappingURL=seeds.js.map