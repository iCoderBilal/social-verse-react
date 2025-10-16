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
        toast(message, {
            style: {
                marginLeft: "200px",
                marginTop: "4rem",
            }
        });
    };

    success = (message) => {
        this.playFlicToastSound();
        toast.success(message, {
            style: {
                marginTop: "4rem"
            }
        });
    };

    error = (message) => {
        this.playFlicToastSound();
        toast.error(message, {
            style: {
                marginTop: "4rem"
            }
        });
    };

    customJSX = (jsxContent) => {
        this.playFlicToastSound();
        toast.custom(jsxContent, {
            style: {
                marginTop: "4rem"
            }
        });
    };
}

export default new FlicToaster();
