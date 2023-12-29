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
                marginTop: "50px",
            }
        });
    };

    success = (message) => {
        this.playFlicToastSound();
        toast.success(message, {
            style: {
                marginLeft: "200px",
                marginTop: "50px",
            }
        });
    };

    error = (message) => {
        this.playFlicToastSound();
        toast.error(message, {
            style: {
                marginLeft: "200px",
                marginTop: "50px",
            }
        });
    };

    customJSX = (jsxContent) => {
        this.playFlicToastSound();
        toast.custom(jsxContent, {
            style: {
                marginLeft: "200px",
                marginTop: "50px",
            }
        });
    };
}

export default new FlicToaster();
