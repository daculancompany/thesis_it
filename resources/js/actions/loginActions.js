import Api from "../utils/api";
import { delay, setCookie } from "../utils/helper";
import  secureLocalStorage  from  "react-secure-storage";

const checkLogin = async ({ params, set, get }) => {
    const setSubmit = get().setSubmit;
    const setError = get().setError;
    setSubmit(true);
    setError(null);
    await delay(1000);
    Api.login(params)
        .then((result) => {
            // localStorage.setItem("access_token", result.data.access_token);
            // setCookie(["userID", result?.data?.user?.id]);
            // setCookie(["userRole", result?.data?.user?.role]);
            secureLocalStorage.setItem("access_token", result.data.access_token);
            secureLocalStorage.setItem("userID", result?.data?.user?.id);
            secureLocalStorage.setItem("userRole", result?.data?.user?.role);
            if(result.data.user.role === 'admin'){
                window.location = '/admin/dashboard'
            }
            if(result.data.user.role === 'faculty'){
                window.location = '/faculty/dashboard'
            }
            if(result.data.user.role === 'student'){
                window.location = '/student/dashboard'
            }
            
            //window.location.href = "/admin/dashboard";
            return false;
        })
        .catch((error) => {
            setSubmit(false);
            if (error.response) {
                setError(error.response.data.message);
                return;
            }
            setError(true);
        });
};

export { checkLogin };
