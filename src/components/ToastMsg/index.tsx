import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ToastMsg: (text: string) => void = (text: string,): void => {
  toast.info(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export { ToastMsg };
