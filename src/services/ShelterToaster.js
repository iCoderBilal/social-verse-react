import toast from "react-hot-toast";
import ToastSound from "../audios/Pop-High-Round-Short-02.wav";

class ShelterToaster {
  state = {
    toastSound: new Audio(ToastSound),
  };

  playShelterToastSound = () => {
    this.state.toastSound.play();
  };

  notify = (message) => {
    this.playShelterToastSound();
    toast(message);
  };

  success = (message) => {
    this.playShelterToastSound();
    toast.success(message);
  };

  error = (message) => {
    this.playShelterToastSound();
    toast.error(message);
  };
}

export default new ShelterToaster();
