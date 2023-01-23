import type { Request, Response, NextFunction } from 'express';
import FirebaseService from '../services/FirebaseService';

declare global {
  interface ExpressRequest extends Request {}
  interface ExpressResponse extends Response {
    locals: {
      authenticated?: boolean;
    };
  }
  interface ExpressNext extends NextFunction {}
  interface F extends FirebaseService {}
  interface RequestBodySetCookie {
    uid: string;
    token: string;
    profile: string;
  }
  interface KeyString<T> {
    [key: string]: T;
  }
}
