"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUpload = exports.uploads = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
function uploads(file, public_id, overwrite, invalidate) {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.upload(file, { public_id, overwrite, invalidate }, (error, result) => {
            if (error)
                resolve(error);
            resolve(result);
        });
    });
}
exports.uploads = uploads;
function videoUpload(file, public_id, overwrite, invalidate) {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.upload(file, {
            resource_type: 'video',
            chunk_size: 50000,
            public_id,
            overwrite,
            invalidate
        }, (error, result) => {
            if (error)
                resolve(error);
            resolve(result);
        });
    });
}
exports.videoUpload = videoUpload;
//# sourceMappingURL=cloudinary-upload.js.map