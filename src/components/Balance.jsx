import React, { Component } from "react";
import axios from "axios";

export class Balance extends Component {
  state = {
    balance: 0,
  };

  // fetchBalance = () => {
  //   axios
  //     .get("/user/balance")
  //     .then((response) => {
  //       if (response.data.status == "success") {
  //         UserHelper.setBalance(response.data.balance);
  //         this.setState({ balance: response.data.balance });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Something went wrong while fetching the balance", error);
  //     });
  // };

  // componentDidMount() {
  //   this.interval = setInterval(() => {
  //     this.fetchBalance();
  //   }, 60000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  render() {
    return <span>{this.state.balance}</span>;
  }
}

export default Balance;
