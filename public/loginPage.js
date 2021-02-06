'use strict';

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
  ApiConnector.login(
    { login: data.login, password: data.password },
    (callback) => {
      callback.success
        ? location.reload()
        : userForm.setLoginErrorMessage(callback.error);
    }
  );
};

userForm.registerFormCallback = (data) => {
  ApiConnector.register(
    { login: data.login, password: data.password },
    (callback) => {
      callback.success
        ? location.reload()
        : userForm.setRegisterErrorMessage(callback.error);
    }
  );
};
