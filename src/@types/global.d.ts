import type { Request, Response, NextFunction } from 'express';
import FirebaseService from '../services/FirebaseService';

declare global {
  interface ExpressRequest extends Request {}
  interface ExpressResponse extends Response {}
  interface ExpressNext extends NextFunction {}
  interface F extends FirebaseService {}
}
