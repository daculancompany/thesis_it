import { Button, Form, Input, Select, Drawer, Space } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";


const { Option } = Select;

const FormGroups = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();thesisDetail
    const [isSubmit, isClear,  setTitle, title, thesisDetail, setThesisDetails] = useThesisStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.setTitle,
            state.title,
            state.thesisDetail,
            state.setThesisDetails,
          
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        form.setFieldsValue({
            thesis_id: thesisDetail?.thesis?.id,
            title: thesisDetail?.thesis?.thesis_name,
        });
    },[thesisDetail]);

    return (
        <Drawer
            title="Edit  Title"
            width={500}
            open={title}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setTitle(false);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setTitle(false);
                        setThesisDetails(null);
                    }}>Cancel</Button>
                    <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`Save Changes`}
                </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="form-student"
                onFinish={(params) => submitForm(params)}
                // onKeyPress={(e) => {
                //     if (e.key === "Enter") {
                //         form.submit();
                //     }
                // }}
            >
                <Form.Item
                    name="title"
                    label="Thesis Title"
                    rules={[
                        {
                            required: true,
                            message: "Please enter Thesis Title!",
                        },
                    ]}
                >
                    <Input placeholder="Thesis Title" />
                </Form.Item>
                <Form.Item
                    name="thesis_id"
                    style={{display:'none'}}
                >
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormGroups);
