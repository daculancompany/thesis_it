import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useCollegeStore } from "~/states/collegeState";

const FormCollege = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        editData,
        setEdit,
        isSubmit,
        isClear,
        visibleDepartment,
        setVisibleDepartment,
    ] = useCollegeStore(
        (state) => [
            state.editData,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.visibleDepartment,
            state.setVisibleDepartment
        ],
        shallow
    );

    useEffect(() => {
        form.setFieldsValue({
            dept_name: editData?.dept_name,
        });
    }, [editData]);

    useEffect(() =>{
        if(isClear) form.resetFields();
    },[isClear])

    return (
        <Modal
            visible={visibleDepartment}
            onCancel={() => {
                setVisibleDepartment(false);
               // setEdit(null);
            }}
            onOk={form.submit}
            title={`${editData ? "Edit Department" : "Create  New Department"}`}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`${editData ? "Save Changes" : "Create Department"}`}
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="form-student"
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Form.Item
                    name="dept_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Department Name!",
                        },
                    ]}
                >
                    <Input placeholder="Department Name" />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default React.memo(FormCollege);
