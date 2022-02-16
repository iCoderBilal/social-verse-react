export const getLocalStorageUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setLocalStorageUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const deleteLocalStorageUser = () => {
  localStorage.removeItem("user");
};

export const getLocalStorageUserToken = () => {
  return getLocalStorageUser().token ?? null;
};

export const isLocalStorageUserLoggedIn = () => {
  const user = getLocalStorageUser();
  return !!(user && user.token);
};

export const getLocalStorageAuthHeader = () => {
  const user = getLocalStorageUser();
  if (user && user.token) {
    return {
      "Flic-Token": user.token,
    };
  }
  return {};
};
