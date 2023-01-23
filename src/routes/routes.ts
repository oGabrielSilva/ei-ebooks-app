import express from 'express';
import Constants from '../constants/Constants';
import AccountController from '../controllers/AccountController';
import IndexController from '../controllers/IndexController';
import AuthMiddleware from '../middleware/AuthMiddleware';
import adapter from './adapter';

export default function routes() {
  const routes = express.Router();

  routes.get('/', AuthMiddleware.middleware, adapter(IndexController.get));
  routes.get(
    '/sign-up',
    AuthMiddleware.middleware,
    adapter(IndexController.signUp)
  );

  //api
  routes.post('/api/sign-in', AccountController.signIn);
  routes.post('/api/create/user', AccountController.createAccount);

  //404
  routes.get('*', (req, res) =>
    res.render('404', {
      lang: req.cookies[Constants.COOKIE_LANG],
      title: 'Ei-Ebook - 404',
    })
  );

  return routes;
}
