// First we need to import axios.js
import { message, Modal } from "antd";
import axios from "axios";
import  secureLocalStorage  from  "react-secure-storage";
// Next we make an 'instance' of it
const instance = axios.create({
    // .. where we make our configurations
    baseURL: "http://127.0.0.1:8000/api/",
});

// Where you would set stuff like your 'Authorization' header, etc ...
let access_token =  secureLocalStorage.getItem("access_token");

instance.defaults.headers.common["Authorization"] = `Bearer  ${access_token}`;

// Also add/ configure interceptors && all the other cool stuff

//instance.interceptors.request...

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const statusCode = error.response ? error.response.status : null;
        if(statusCode === 401){
             window.location.href = `/login?type=session-expired&link=${window.location.href}`
             return
        }
        const messageErorr = error.response ? error.response.message : null;
        // console.log(error?.response?.data?.message);
        // message.error(error?.response?.data?.message);
        Modal.error({
            title: `Error: ${statusCode}`,
            content:
                error?.response?.data?.message || "No error message to show.",
        });
    }
);

export default instance;

// /https://stackoverflow.com/questions/51794553/how-do-i-create-configuration-for-axios-for-default-request-headers-in-every-htt
