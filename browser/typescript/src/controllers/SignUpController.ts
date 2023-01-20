import Constants from '../constants/Constants';
import ImageModule from '../modules/ImageModule';
import SignInController from './SignInController';

export default class SignUpController extends SignInController {
  protected constructor(form: HTMLFormElement) {
    super(form);
  }

  protected on() {
    super.on();
    this.setProfileInput();
    this.setNameInput();
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();
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

  public setName(name: string, small: HTMLParagraphElement) {
    this.user.setName(name);
    small.style.display = name.length >= 3 ? 'none' : 'inline-block';
  }

  public static default() {
    const form = document.getElementById(Constants.DOM_ID_FORM_SIGN_UP);
    if (!!form) new SignUpController(form as HTMLFormElement).on();
  }
}
