'use strict';

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((callback) => {
    if (callback.success) {
      location.reload();
    }
  });
};

ApiConnector.current((callback) => {
  if (callback.success) {
    ProfileWidget.showProfile(callback.data);
  }
});

const ratesBoard = new RatesBoard();

const getCurrencyRates = () => {
  ApiConnector.getStocks((callback) => {
    if (callback.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(callback.data);
    }
  });
};

getCurrencyRates();

setInterval(getCurrencyRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = () => {
  ApiConnector.addMoney(({ currency, amount }, callback) => {
    if (callback.success) {
      ProfileWidget.showProfile(callback.data);
      moneyManager.setMessage(
        callback.success,
        `Счет успешно пополнен на сумму ${amount} ${currency}`
      );
    } else {
      moneyManager.setMessage(!callback.success, callback.error);
    }
  });
};

moneyManager.conversionMoneyCallback = () => {
  ApiConnector.convertMoney(
    ({ fromCurrency, targetCurrency, fromAmount }, callback) => {
      if (callback.success) {
        ProfileWidget.showProfile(callback.data);
        moneyManager.setMessage(
          callback.success,
          `${fromAmount} ${fromCurrency} конвертированы в ${targetCurrency}`
        );
      } else {
        moneyManager.setMessage(!callback.success, callback.error);
      }
    }
  );
};

moneyManager.sendMoneyCallback = () => {
  ApiConnector.transferMoney(({ to, currency, amount }, callback) => {
    if (callback.success) {
      ProfileWidget.showProfile(callback.data);
      moneyManager.setMessage(
        callback.success,
        `${amount} ${currency} переведен(ы) пользователю ${to}`
      );
    } else {
      moneyManager.setMessage(!callback.success, callback.error);
    }
  });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((callback) => {
  if (callback.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(callback.data);
    favoritesWidget.updateUsersList(callback.data);
  }
});

favoritesWidget.addUserCallback = () => {
  ApiConnector.addUserToFavorites(({ id, name }, callback) => {
    if (callback.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(callback.data);
      favoritesWidget.updateUsersList(callback.data);
      favoritesWidget.setMessage(
        callback.success,
        ` Пользователь ${name} с ${id} добавлен в список избранных`
      );
    } else {
      favoritesWidget.setMessage(!callback.success, callback.error);
    }
  });
};

favoritesWidget.removeUserCallback = () => {
  ApiConnector.removeUserFromFavorites((id, callback) => {
    if (callback.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(callback.data);
      favoritesWidget.updateUsersList(callback.data);
      favoritesWidget.setMessage(
        callback.success,
        ` Пользователь ${id} удален из списка избранных`
      );
    } else {
      favoritesWidget.setMessage(!callback.success, callback.error);
    }
  });
};
