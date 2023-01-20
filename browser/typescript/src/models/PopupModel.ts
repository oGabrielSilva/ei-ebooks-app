export default class PopupModel {
  public constructor(
    public title: string = '',
    public body: string = '',
    public buttonText: string = '',
    public bodyVisible: boolean = true,
    public indicatorVisible: boolean = false,
    public buttonVisible: boolean = true,
    public onClick: () => void = () => {}
  ) {}
}
