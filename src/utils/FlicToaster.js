import toast from "react-hot-toast";
import ToastSound from "../audios/pop-sound.wav";

class FlicToaster {
    state = {
        toastSound: new Audio(ToastSound),
    };

    playFlicToastSound = () => {
        try {
            this.state.toastSound.play();
        } catch (e) {
            console.log(e.message)
        }
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

    customJSX = (jsxContent) => {
        this.playFlicToastSound();
        toast.custom(jsxContent);
    };
}

export default new FlicToaster();
