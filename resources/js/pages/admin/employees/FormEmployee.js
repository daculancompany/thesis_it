import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useEmployeeStore } from "~/states/employeeState";

const { TextArea } = Input;

const FormEmployee = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        createEmployee,
        setCreateEmployee,
        editEmployee,
        setEdit,
        isSubmit,
        isClear,
        loading
    ] = useEmployeeStore(
        (state) => [
            state.createEmployee,
            state.setCreateEmployee,
            state.editEmployee,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.loading
        ],
        shallow
    );
   
    useEffect(() => {
        form.setFieldsValue({
            fname: editEmployee?.fname,
            lname: editEmployee?.lname,
            email: editEmployee?.email,
            address: editEmployee?.address,
            contact_number: editEmployee?.contact_number,
        });
    }, [editEmployee]);

    useEffect(() =>{
        if(isClear) form.resetFields();
    },[isClear])

    return (
        <Modal
            visible={createEmployee}
            onCancel={() => {
                setCreateEmployee(false);
                setEdit(null);
            }}
            onOk={form.submit}
            title={`${editEmployee ? "Edit Employee" : "Create  New Employee"}`}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`${editEmployee ? "Save Changes" : "Create Employee"}`}
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="form-employee"
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Form.Item
                    name="fname"
                    rules={[
                        {
                            required: true,
                            message: "Please input your First Name!",
                        },
                    ]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>
                <div style={{ minHeight: 10 }}></div>
                <Form.Item
                    name="lname"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Last Name!",
                        },
                    ]}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Enter a valid email address!",
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="contact_number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Contact Number!",
                        },
                    ]}
                >
                    <Input placeholder="Contact Number" onChange={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }}/>
                </Form.Item>
                <Form.Item
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Address!",
                        },
                    ]}
                >
                    <TextArea rows={4} placeholder="Address"/>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default React.memo(FormEmployee);
