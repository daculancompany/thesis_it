import React, { useEffect } from "react";
import { Spin } from "antd";
import { getStorage } from "../../utils/helper";
import logo from "~/assets/images/ustp-logo.png";

const MainPage = () => {
    useEffect(()=> {
        setTimeout(() =>{
            
            if(!getStorage("userRole")){
                window.location = '/login'
            }else{
                //window.location = '/admin/dashboard';
                if(getStorage("userRole") === 'admin'){
                    window.location = '/admin/dashboard'
                    return
                }
                if(getStorage("userRole") === 'student'){
                    window.location = '/student/dashboard'
                    return
                }
                if(getStorage("userRole") === 'faculty'){
                    window.location = '/faculty/dashboard'
                    return
                }
                
            }
        },1500)
    },[])

    return (
        <>
            <div className="main-loading-wrapper">
                <img src={logo} />
                <Spin size="large" className="login-spinner" />
            </div>
        </>
    );
};

export default React.memo(MainPage);
