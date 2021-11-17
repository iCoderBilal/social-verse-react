class AuthHelper {

  getAuthHeader() {
    const user = this.getUser();
    if (user && user.token) {
      return {
        'Flic-Token': user.token
      };
    } else {
      return {};
    }
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(responseData){
    localStorage.setItem("user", JSON.stringify(responseData));
  }

  deleteUser() {
    localStorage.removeItem("user");
  }

  getUserToken() {
    if(this.getUser())
    return this.getUser().token;
    return null;
  }

  isUserLoggedIn() {
    const user = this.getUser();
    return user && user.token;
  }
}



export default new AuthHelper();