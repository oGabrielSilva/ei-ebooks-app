export const responseErrorsCode = {
  emailAlreadyExists: 'auth/email-already-exists',
  invalidEmail: 'auth/invalid-email',
  invalidPassword: 'auth/invalid-password',
  userNotFound: 'auth/user-not-found',
  getArray: () => [
    'auth/email-already-exists',
    'auth/invalid-email',
    'auth/invalid-password',
    'auth/user-not-found',
  ],
};
