export const getLocalStorageUser = () => {
  try {
    const userString = localStorage.getItem("user");
    // Handle null, undefined string, or empty values
    if (!userString || userString === "undefined" || userString === "null") {
      return null;
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("user");
    return null;
  }
};

export const setLocalStorageUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const deleteLocalStorageUser = () => {
  localStorage.removeItem("user");
};

export const getLocalStorageUserToken = () => {
  const user = getLocalStorageUser();
  return user?.token ?? null;
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

export const clearLocalStorage = () => {
  localStorage.removeItem("loggedInStatus");
  localStorage.removeItem("user");
};
