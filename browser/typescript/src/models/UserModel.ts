export default class UserModel {
  private profile = '';
  private name = '';
  private email = '';
  private password = '';

  public constructor() {}

  public setProfile(profile: string) {
    this.profile = profile;
  }

  public getProfile() {
    return this.profile;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public getEmail() {
    return this.email;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public getPassword() {
    return this.password;
  }
}
