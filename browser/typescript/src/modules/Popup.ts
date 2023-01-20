import Constants from '../constants/Constants';
import PopupModel from '../models/PopupModel';

export default class Popup {
  private readonly constants = Constants.DOM_POPUP_CONSTANTS;
  private readonly popupContainer = document.querySelector(
    this.constants.containerId
  ) as HTMLDivElement;
  private readonly popupTitle = document.querySelector(
    this.constants.titleId
  ) as HTMLHeadingElement;
  private readonly popupBody = document.querySelector(
    this.constants.bodyId
  ) as HTMLParagraphElement;
  private readonly popupIndicator = document.querySelector(
    this.constants.indicatorId
  ) as HTMLDivElement;
  private readonly popupButton = document.querySelector(
    this.constants.buttonId
  ) as HTMLButtonElement;
  private readonly popupRoot = document.querySelector(
    this.constants.root
  ) as HTMLDivElement;
  private popupInfo = new PopupModel();

  private constructor() {
    this.popupContainer.remove();
    this.popupRoot.innerHTML = '';
  }

  private onClick() {
    if (!!this.popupInfo.onClick) this.popupInfo.onClick();
    this.remove();
  }

  public show(data?: PopupModel) {
    if (data) this.popupInfo = data;
    this.update();
    if (!!this.popupRoot.firstChild) return;
    this.popupRoot.appendChild(this.popupContainer);
    this.popupContainer.style.display = 'flex';
  }

  public remove() {
    if (this.popupRoot.firstChild) this.popupRoot.innerHTML = '';
  }

  public update(data?: PopupModel) {
    if (data) this.popupInfo = data;
    //data
    this.popupBody.textContent = this.popupInfo.body;
    this.popupTitle.textContent = this.popupInfo.title;
    this.popupButton.textContent = this.popupInfo.buttonText;
    //visibility
    this.popupBody.style.display = this.popupInfo.bodyVisible
      ? 'block'
      : 'none';
    this.popupIndicator.style.display = this.popupInfo.indicatorVisible
      ? 'block'
      : 'none';
    this.popupButton.style.display = this.popupInfo.buttonVisible
      ? 'inline-block'
      : 'none';
    //click
    this.popupButton.onclick = () => this.onClick();
  }

  public reset() {
    this.popupInfo = new PopupModel();
    this.update();
  }

  public setOnClick(func: () => void) {
    this.popupInfo.onClick = func;
    this.update();
  }

  public setTitle(title: string) {
    this.popupInfo.title = title;
    this.update();
  }

  public setBody(body: string) {
    this.popupInfo.body = body;
    this.update();
  }

  public setBodyVisibility(bodyVisible: boolean) {
    this.popupInfo.bodyVisible = bodyVisible;
    this.update();
  }

  public setIndicatorVisibility(indicatorVisible: boolean) {
    this.popupInfo.indicatorVisible = indicatorVisible;
    this.update();
  }

  public setButtonText(text: string) {
    this.popupInfo.buttonText = text;
    this.update();
  }

  public setButtonVisibility(buttonVisible: boolean) {
    this.popupInfo.buttonVisible = buttonVisible;
    this.update();
  }

  public static getModule() {
    return new Popup();
  }
}
