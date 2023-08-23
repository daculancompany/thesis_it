import { Button, Form, Input, Drawer, Space } from "antd";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useFacultiesStore } from "~/states/facultiesState";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {  DIR_LOCATION } from '~/utils/constant'
import { UploadProfile } from "~/components";

const FormStudent = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [imageOld,setImageOld] = useState(null);
    const [
        createStudent,
        setCreateStudent,
        editFaculty,
        setEdit,
        isSubmit,
        isClear,
        loading,
        setImage,
    ] = useFacultiesStore(
        (state) => [
            state.createStudent,
            state.setCreateStudent,
            state.editFaculty,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.loading,
            state.setImage,
        ],
        shallow
    );

    useEffect(() => {
        var phone='';
        if(editFaculty?.phone!='undefined'){
            phone=editFaculty?.phone;
        }
        form.setFieldsValue({
            email: editFaculty?.email,
            fname: editFaculty?.fname,
            lname: editFaculty?.lname,
            mname: editFaculty?.mname,
            phone: phone,
        });
        if(editFaculty?.image){
            setImageOld(DIR_LOCATION.profile+editFaculty?.image);
        }else{
            setImageOld(null);
        }
    }, [editFaculty]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    return (
    
            <Drawer
            title={`${editFaculty ? "Edit Faculty" : "Create  New Faculty"}`}
            width={500}
            open={createStudent}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setCreateStudent(false);
                setEdit(null);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setCreateStudent(false);
                        setEdit(null);
                    }}>Cancel</Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}
                    >
                        {`${editFaculty ? "Save Changes" : "Create Faculty"}`}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="form-student"
                layout="vertical"
                onFinish={(params) => submitForm(params)}
            >
                <Form.Item
                    name="image"
                >
                   <UploadProfile imageOld={imageOld} updateImage={(image) => setImage(image)}  />
                </Form.Item>
                <Form.Item
                    name="fname"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your First Name!",
                        },
                    ]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    name="lname"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Last Name!",
                        },
                    ]}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item name="mname" label="Middle Initial">
                    <Input placeholder="Middle Initial" maxLength={1}/>
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                    <Input placeholder="Phone" maxLength={11}
                         onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Email!",
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                {/* {!editFaculty && (
                    <>
                        <div style={{ minHeight: 10 }}></div>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Value should be atleast 6 character",
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
                    </>
                )} */}
            </Form>
        </Drawer>
    );
});

export default React.memo(FormStudent);
