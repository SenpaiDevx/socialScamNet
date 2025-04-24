"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userJwt = exports.searchedUserMock = exports.mergedAuthAndUserData = exports.existingUserTwo = exports.existingUser = exports.mockExistingUser = void 0;
exports.mockExistingUser = {
    notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
    },
    social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    },
    blocked: [],
    blockedBy: [],
    followersCount: 1,
    followingCount: 2,
    postsCount: 2,
    bgImageVersion: '',
    bgImageId: '',
    profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1742467495/67dbf1a580ccb1bb66edf6f8',
    _id: '67dbf1a580ccb1bb66edf6f7',
    work: 'KickChat Inc.',
    school: 'University of Benin',
    location: 'Dusseldorf, Germany',
    quote: 'Sky is my limit',
    createdAt: '2025-03-20T10:44:53.141+00:00'
};
exports.existingUser = {
    notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
    },
    social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    },
    blocked: [],
    blockedBy: [],
    followersCount: 1,
    followingCount: 2,
    postsCount: 2,
    bgImageVersion: '',
    bgImageId: '',
    profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1742467495/67dbf1a580ccb1bb66edf6f8',
    _id: '67dbf1a580ccb1bb66edf6f7',
    uId: '',
    username: 'Manny',
    email: 'manny@me.com',
    avatarColor: 'red',
    work: 'KickChat Inc.',
    school: 'University of Benin',
    location: 'Dusseldorf, Germany',
    quote: 'Sky is my limit',
    createdAt: '2025-03-20T10:44:53.141+00:00'
};
exports.existingUserTwo = {
    notifications: {
        messages: false,
        reactions: true,
        comments: true,
        follows: false
    },
    social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    },
    blocked: [],
    blockedBy: [],
    followersCount: 1,
    followingCount: 2,
    postsCount: 2,
    bgImageVersion: '',
    bgImageId: '',
    profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1742467495/67dbf1a580ccb1bb66edf6f8',
    _id: '67dbf1a580ccb1bb66edf6f7',
    uId: '1621613119252065',
    username: 'Danny',
    email: 'danny@me.com',
    avatarColor: '#9c27b1',
    work: 'KickChat Inc.',
    school: 'University of Benin',
    location: 'Dusseldorf, Germany',
    quote: 'Sky is my limit',
    createdAt: '2025-03-20T10:44:53.141+00:00'
};
exports.mergedAuthAndUserData = {
    notifications: {
        messages: false,
        reactions: true,
        comments: true,
        follows: false
    },
    social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    },
    blocked: [],
    blockedBy: [],
    followersCount: 1,
    followingCount: 2,
    postsCount: 2,
    bgImageVersion: '',
    bgImageId: '',
    profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1742467495/67dbf1a580ccb1bb66edf6f8',
    _id: '67dbf1a580ccb1bb66edf6f8',
    authId: '67dbf1a580ccb1bb66edf6f7',
    uId: '',
    username: 'Manny',
    email: 'manny@me.com',
    avatarColor: '#9c27b0',
    work: 'KickChat Inc.',
    school: 'University of Benin',
    location: 'Dusseldorf, Germany',
    quote: 'Sky is my limit',
    createdAt: '2025-03-20T10:44:53.141+00:00'
};
exports.searchedUserMock = {
    profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1742467495/67dbf1a580ccb1bb66edf6f8',
    _id: '60263f14648fed5246e322d5',
    uId: '1621613119252062',
    username: 'Kenny',
    email: 'ken@me.com',
    avatarColor: '#9c27b1'
};
exports.userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RiZjFhNTgwY2NiMWJiNjZlZGY2ZjgiLCJ1SWQiOiIiLCJlbWFpbCI6InZvcnRleEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IlNha2Ftb3RvIiwiYXZhdGFyQ29sb3IiOiJibHVlIiwiaWF0IjoxNzQyNDY3NDk0fQ.2GSxnDD-1u3bPTZ1f-S5wjuyLotwS9-GHB9ivZ1vzZM';
//# sourceMappingURL=user.mock.js.map