import { TypeKeyString } from '../@types/TypeKeyString';
import Constants from '../constants/Constants';
import { stringsEN } from '../resources/stringsEN';
import { stringsPT } from '../resources/stringsPT';

export default class DisplayStringController {
  public static default() {
    DisplayStringController.updateDOMStrings();
    DisplayStringController.setSelectSetAppLanguage();
  }

  public static updateDOMStrings() {
    const appLanguage = document.documentElement.lang;
    const strings = DisplayStringController.getStringsByLang(appLanguage);
    const DOMElements = document.querySelectorAll(
      '['.concat(Constants.DOM_DATA_STRING, ']')
    );

    DOMElements.forEach((item) =>
      DisplayStringController.setString(item, strings)
    );
  }

  public static getStringsByLang(lang: string) {
    return lang === 'pt-BR' ? stringsPT : lang === 'en' ? stringsEN : stringsPT;
  }

  private static setString(item: Element, strings: TypeKeyString) {
    const attributeName = item.getAttribute(Constants.DOM_DATA_STRING);
    item.textContent = strings[attributeName] || '';
  }

  public static getStrings() {
    const appLanguage = document.documentElement.lang;
    return DisplayStringController.getStringsByLang(appLanguage);
  }

  private static setSelectSetAppLanguage() {
    const select = document.getElementById(
      Constants.DOM_ID_SELECT_DISPLAY_LANG
    ) as HTMLSelectElement;
    if (!!select) {
      const appLanguage = document.documentElement.lang;
      select
        .querySelectorAll('option')
        .forEach((opt) =>
          opt.value === appLanguage
            ? (opt.selected = true)
            : (opt.selected = false)
        );
      select.onchange = (e) => {
        const { value } = e.currentTarget as HTMLSelectElement;
        document.cookie = Constants.COOKIE_LANG.concat('=', value);
        document.documentElement.lang = value;
        DisplayStringController.updateDOMStrings();
      };
    }
  }
}
