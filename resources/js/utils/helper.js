import  secureLocalStorage  from  "react-secure-storage";

const setCookie = (data) => {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var expires = "expires=" + d.toUTCString(); 
    document.cookie = data[0] + "=" + data[1] + ";" + expires + ";path=/";
};

const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

const seurityRoutes = (params) => {
    function isBase64(str) {
        if (str ==='' || str.trim() ===''){ return false; }
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }
    if( !isBase64(params?.key) || params?.id !== atob(params?.key)) window.location.href = '/404';
};

const baseURL = (paams) => {
   return window.location.origin
};

const getStorage = (value) => {
    return  secureLocalStorage.getItem([value]);
}

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export { setCookie, getCookie, delay, seurityRoutes, baseURL, getStorage };
