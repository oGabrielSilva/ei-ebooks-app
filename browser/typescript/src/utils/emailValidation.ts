export function emailIsValid(email: string) {
  const rg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return rg.test(email);
}
