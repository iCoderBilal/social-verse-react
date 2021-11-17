import toast from "react-hot-toast";
import ToastSound from "../audios/Pop-High-Round-Short-02.wav";

class FlicToaster {
  state = {
    toastSound: new Audio(ToastSound),
  };

  playFlicToastSound = () => {
    this.state.toastSound.play();
  };

  notify = (message) => {
    this.playFlicToastSound();
    toast(message);
  };

  success = (message) => {
    this.playFlicToastSound();
    toast.success(message);
  };

  error = (message) => {
    this.playFlicToastSound();
    toast.error(message);
  };
}

export default new FlicToaster();
