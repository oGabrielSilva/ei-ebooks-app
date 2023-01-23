import Constants from '../constants/Constants';
import Firebase from '../modules/Firebase';
import PopupModel from '../models/PopupModel';
import UserModel from '../models/UserModel';
import Popup from '../modules/Popup';
import { emailIsValid } from '../utils/emailValidation';
import DisplayStringController from './DisplayStringController';
import { FirebaseError } from 'firebase/app';
import { responseErrorsCode } from '../constants/responseErrorsCode';
import { TypeOfStrings } from '../resources/stringsPT';
import Fetch from '../modules/Fetch';

export default class SignInController {
  protected readonly form: HTMLFormElement;
  protected readonly constants = Constants.DOM_FORM_SIGN_CONSTANTS;
  protected readonly emailInput: HTMLInputElement;
  protected readonly passwordInput: HTMLInputElement;
  protected readonly user = new UserModel();
  protected readonly popup = Popup.getModule();
  protected readonly firebase = Firebase.getModule();
  protected readonly displaySmall = Array.from<HTMLParagraphElement>(
    document.querySelectorAll(`small[${Constants.DOM_DATA_FOR}]`)
  );

  protected constructor(form: HTMLFormElement) {
    this.form = form;
    this.emailInput = this.form.querySelector(this.constants.inputEmailId);
    this.passwordInput = this.form.querySelector(
      this.constants.inputPasswordId
    );
  }

  protected on() {
    this.setEmailInput();
    this.setPasswordInput();
    this.setFormSubmit();
    this.firebase.signOut();
  }

  protected setFormSubmit() {
    this.form.onsubmit = (e) => this.onSubmit(e);
  }

  protected onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const { emailInput } = this;
    const strings = DisplayStringController.getStrings();
    this.popup.show(
      new PopupModel(strings.wait, null, null, false, true, false)
    );
    const success = this.startFormValidationWithEmailAndPassword(
      strings,
      emailInput
    );
    if (!success) return;
    this.firebase
      .signIn(this.user.getEmail(), this.user.getPassword())
      .then(async ({ user }) => {
        if (!!user) {
          const token = await user.getIdToken(true);
          const { uid } = user;
          const { response } = await Fetch.post(
            '/api/sign-in',
            JSON.stringify({ token, uid })
          );
          if (!response.ok) {
            this.popup.update(
              new PopupModel(
                strings.internalError,
                '',
                strings.ok,
                false,
                false,
                true
              )
            );
            return;
          }
          window.location.href = '/';
        }
      })
      .catch((e) => {
        if (
          e instanceof FirebaseError &&
          responseErrorsCode.getArray().includes(e.code)
        ) {
          switch (e.code) {
            case responseErrorsCode.invalidEmail:
              return this.popup.update(
                new PopupModel(
                  strings.emailSmall,
                  '',
                  strings.ok,
                  false,
                  false,
                  true,
                  () => emailInput.focus()
                )
              );
            case responseErrorsCode.invalidPassword:
              return this.popup.update(
                new PopupModel(
                  strings.passwordSmall,
                  '',
                  strings.ok,
                  false,
                  false,
                  true
                )
              );
            case responseErrorsCode.userNotFound:
              return this.popup.update(
                new PopupModel(
                  strings.userNotFound,
                  '',
                  strings.ok,
                  false,
                  false,
                  true,
                  () => (window.location.href = '/sign-up')
                )
              );
          }
        }
        this.popup.update(
          new PopupModel(
            strings.internalError,
            '',
            strings.ok,
            false,
            false,
            true
          )
        );
      });
  }

  protected startFormValidationWithEmailAndPassword(
    strings: TypeOfStrings,
    emailInput: HTMLInputElement
  ) {
    let success = true;
    if (!emailIsValid(this.user.getEmail())) {
      this.popup.update(
        new PopupModel(
          strings.oopss,
          strings.emailSmall,
          strings.ok,
          true,
          false,
          true,
          () => emailInput.focus()
        )
      );
      success = false;
    }
    if (this.user.getPassword().length < 8) {
      const { passwordInput } = this;
      this.popup.update(
        new PopupModel(
          strings.oopss,
          strings.passwordSmall,
          strings.ok,
          true,
          false,
          true,
          () => passwordInput.focus()
        )
      );
      success = false;
    }
    return success;
  }

  protected setEmailInput() {
    if (!this.emailInput) return;
    const emailSmall = this.displaySmall.find(
      (small) =>
        small.getAttribute(Constants.DOM_DATA_FOR) === this.emailInput.id
    );
    this.emailInput.oninput = ({ currentTarget }) => {
      this.setEmail((currentTarget as HTMLInputElement).value, emailSmall);
    };
  }

  protected setPasswordInput() {
    if (!this.passwordInput) return;
    const passwordSmall = this.displaySmall.find(
      (small) =>
        small.getAttribute(Constants.DOM_DATA_FOR) === this.passwordInput.id
    );
    this.passwordInput.oninput = ({ currentTarget }) => {
      this.setPassword(
        (currentTarget as HTMLInputElement).value,
        passwordSmall
      );
    };
  }

  public setEmail(email: string, small: HTMLParagraphElement) {
    this.user.setEmail(email);
    small.style.display = emailIsValid(email) ? 'none' : 'inline-block';
  }

  public setPassword(password: string, small: HTMLParagraphElement) {
    this.user.setPassword(password);
    small.style.display = password.length >= 8 ? 'none' : 'inline-block';
  }

  public static default() {
    const form = document.getElementById(Constants.DOM_ID_FORM_SIGN_IN);
    if (!!form) new SignInController(form as HTMLFormElement).on();
  }
}
