import express from "express";
import { AuthPayload } from "@auth/interfaces/auth.interface";
import { IAuthDocument } from "@auth/interfaces/auth.interface";


export const authMockRequest = (sessionData : IJWT, body : IAuthMock, currentUser? :AuthPayload | null, params? : any ) => ({
  session : sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): express.Response => {
  const res : express.Response = {} as express.Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res)
  return  res

};
//



export interface IJWT {
  jwt? : string
}

export interface IAuthMock {
  _id? : string;
  username? : string;
  uId? : string;
  email? : string;
  password? : string;
  confirmPassword? : string;
  avatarColor? : string;
  avatarImage? : string;
  // createdAt : Date | string;

}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'sakamoto',
  email: 'vortex@gmail.com',
  avatarColor: '#9c27b0',
  iat: 12345,
};

export const authMock: IAuthDocument = {
  _id: '67dbf1a580ccb1bb66edf6f7',
  uId: '',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  createdAt: '2025-03-20T10:44:53.141+00:00',
  save: () => {}, // Mock save function
} as unknown as IAuthDocument;

const signUpMockData = {
  _id: '605727cd646eb50e668a4e13',
  uId: '92241616324557172',
  username: 'sakamoto',
  email: 'vortex@gmail.com',
  avatarColor: '#ff9800',
  password: '12345', // Placeholder
  birthDay: { month: '', day: '' },
  postCount: 0,
  blocked: [],
  blockedBy:[],
  work: [],
  school: [],
  placesLived: [],
  bgImageId : '',
  bgImageVersion : '',
  createdAt: '2025-03-20T10:44:53.141+00:00',
  followersCount: 0,
  followingCount: 0,
  notifications: {
    messages: true,
    reactions: true,
    comments: true,
    follows: true,
  },
  profilePicture: 'https://res.cloudinary.com/ratingapp/image/upload/67c2d634a0d61a6614cc47c5',
};

