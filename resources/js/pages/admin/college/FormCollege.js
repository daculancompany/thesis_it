import { Button, Form, Input, Drawer, Space } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useCollegeStore } from "~/states/collegeState";

const FormCollege = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        visible,
        setVisible,
        editData,
        setEdit,
        isSubmit,
        isClear,
        loading
    ] = useCollegeStore(
        (state) => [
            state.visible,
            state.setVisible,
            state.editData,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.loading
        ],
        shallow
    );

    useEffect(() => {
        form.setFieldsValue({
            college_name: editData?.college_name,
        });
    }, [editData]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear])

    return (
        <Drawer
            title={`${editData ? "Edit College" : "Create   College"}`}
            width={500}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setVisible(false);
                setEdit(null);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setVisible(false);
                        setEdit(null);
                    }}>Cancel</Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}
                    >
                        {`${editData ? "Save Changes" : "Create College"}`}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="form-student"
                onFinish={(params) => submitForm(params)}
                layout="vertical"
            >
                <Form.Item
                    label="College Name"
                    name="college_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your College Name!",
                        },
                    ]}
                >
                    <Input placeholder="College Name" />
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormCollege);
