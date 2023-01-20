import DisplayStringController from '../controllers/DisplayStringController';
import SignInController from '../controllers/SignInController';
import SignUpController from '../controllers/SignUpController';

export default class EiEbookApp {
  public static run() {
    EiEbookApp.dispatchControllers();
  }

  private static dispatchControllers() {
    const { pathname: path } = window.location;
    switch (path) {
      case '/':
        SignInController.default();
        break;
      case '/sign-up':
        SignUpController.default();
        break;
    }
    DisplayStringController.default();
  }
}
