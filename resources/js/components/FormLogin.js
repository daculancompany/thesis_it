import React, { useEffect } from "react";
import { Row, Form, Input, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useLoginStore } from "~/states/loginState";
import shallow from "zustand/shallow";
import { Button } from "./index";
import logo from "~/assets/images/ustp-logo.png";

const Formlogin = () => {
    const [error, isSubmit, submitForm] = useLoginStore(
        (state) => [state.error, state.isSubmit, state.checkLogin],
        shallow
    );
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    return (
        <>
            <div className="login-form">
                <div className="logo-login">
                    <img src={logo} />
                    <h5>Welcome to Thesis IT</h5>
                    <p>
                        <span>Login to continue </span>
                    </p>
                </div>
                {error && (
                    <div style={{ marginBottom: 20 }}>
                        <Alert message={error} type="error" showIcon />
                    </div>
                )}
                {!error && type === "session-expired" && (
                    <div style={{ marginBottom: 20 }}>
                        <Alert message="Your session has expired." type="error" showIcon />
                    </div>
                )}
                <Form name="normal_login" onFinish={submitForm}>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Username!",
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <div style={{ minHeight: 10 }}></div>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Password"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                            label="Sign in"
                        />
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Formlogin;
