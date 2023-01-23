import { FirebaseError } from 'firebase/app';
import Constants from '../constants/Constants';
import { responseErrorsCode } from '../constants/responseErrorsCode';
import PopupModel from '../models/PopupModel';
import Fetch from '../modules/Fetch';
import ImageModule from '../modules/ImageModule';
import DisplayStringController from './DisplayStringController';
import SignInController from './SignInController';

export default class SignUpController extends SignInController {
  private readonly nameInput: HTMLInputElement;
  private readonly profileInput: HTMLInputElement;

  protected constructor(form: HTMLFormElement) {
    super(form);
    this.nameInput = this.form.querySelector(
      Constants.DOM_FORM_SIGN_CONSTANTS.inputNameId
    );
    this.profileInput = this.form.querySelector(
      Constants.DOM_FORM_SIGN_CONSTANTS.inputFileId
    );
  }

  protected on() {
    super.on();
    this.setProfileInput();
    this.setNameInput();
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();
    const strings = DisplayStringController.getStrings();
    const { emailInput, nameInput, profileInput } = this;
    this.popup.show(
      new PopupModel(strings.wait, null, null, false, true, false)
    );
    if (this.user.getName().length < 3) {
      this.popup.update(
        new PopupModel(
          strings.oopss,
          strings.nameSmall,
          strings.ok,
          true,
          false,
          true,
          () => nameInput.focus()
        )
      );
      return;
    }
    if (
      this.user.getProfile().length < 1 ||
      !this.user.getProfile().startsWith('data:image/')
    ) {
      this.popup.update(
        new PopupModel(
          strings.oopss,
          strings.profileWarning,
          strings.ok,
          true,
          false,
          true,
          () => profileInput.click()
        )
      );
      return;
    }
    const success = this.startFormValidationWithEmailAndPassword(
      strings,
      emailInput
    );
    if (!success) return;
    this.firebase
      .signUp(this.user.getEmail(), this.user.getPassword())
      .then(async ({ user }) => {
        const token = await user.getIdToken(true);
        const { uid } = user;
        const {
          json: { body },
          response,
        } = await Fetch.post(
          '/api/create/user',
          JSON.stringify({ token, uid, profile: this.user.getProfile() })
        );
        if (!response.ok || !body.profileURL) {
          this.resetUser();
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
        this.firebase
          .updateUser(this.user.getName(), body.profileURL)
          .then(() => (window.location.href = '/'))
          .catch(() => {
            this.resetUser();
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
      })
      .catch((e) => {
        this.resetUser();
        if (
          e instanceof FirebaseError &&
          responseErrorsCode.getArray().includes(e.code)
        ) {
          switch (e.code) {
            case responseErrorsCode.emailAlreadyExists:
              return this.popup.update(
                new PopupModel(
                  strings.emailAlreadyExists,
                  '',
                  strings.ok,
                  false,
                  false,
                  true,
                  () => emailInput.focus()
                )
              );
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

  protected setNameInput() {
    const nameInput = this.form.querySelector(
      this.constants.inputNameId
    ) as HTMLInputElement;
    if (!nameInput) return;
    const nameSmall = this.displaySmall.find(
      (small) => small.getAttribute(Constants.DOM_DATA_FOR) === nameInput.id
    );
    nameInput.oninput = ({ currentTarget }) => {
      this.setName((currentTarget as HTMLInputElement).value, nameSmall);
    };
  }

  protected setProfileInput() {
    const profileInput = this.form.querySelector(
      this.constants.inputFileId
    ) as HTMLInputElement;
    const img = this.form.querySelector(
      '#'.concat(profileInput.getAttribute(Constants.DOM_DATA_FOR))
    );
    if (!profileInput && !img) return;
    (img as HTMLDivElement).onclick = () => profileInput.click();
    profileInput.onchange = async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files[0];
      const fileString =
        (await ImageModule.imgToDataURL(file, 100, 100)) ||
        this.user.getProfile();
      this.user.setProfile(fileString);
      (img as HTMLImageElement).src = this.user.getProfile();
    };
  }

  private resetUser() {
    this.firebase.deleteUser();
  }

  public setName(name: string, small: HTMLParagraphElement) {
    this.user.setName(name);
    small.style.display = name.length >= 3 ? 'none' : 'inline-block';
  }

  public static default() {
    const form = document.getElementById(Constants.DOM_ID_FORM_SIGN_UP);
    if (!!form) new SignUpController(form as HTMLFormElement).on();
  }
}
