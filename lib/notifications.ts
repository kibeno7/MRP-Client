import toast from "react-hot-toast";

const errornotify = (msg: string) => toast.error(msg);
const sendingnotify = (msg: string) => toast.loading(msg);
const dismiss = (id?: string) => toast.dismiss(id);
const successnotify = (msg: string) => toast.success(msg);

export { dismiss, errornotify, sendingnotify, successnotify };
