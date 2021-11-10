import AuthHelper from "./AuthHelper";

class UserHelper {
  getProfilePicture() {
    return AuthHelper.getUser().profile_picture_url;
  }
  getUsername() {
    return (AuthHelper.getUser() && AuthHelper.getUser().username) || "";
  }
  getBalance() {
    return (AuthHelper.getUser() && AuthHelper.getUser().balance) || 0;
  }
  setBalance(balance) {
    if (AuthHelper.getUser()) {
      let user = AuthHelper.getUser();
      user.balance = balance;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }
  getEthAddress() {
    return (AuthHelper.getUser() && AuthHelper.getUser().eth_address) || "Invalid ETH Address";
  }
}

export default new UserHelper();
