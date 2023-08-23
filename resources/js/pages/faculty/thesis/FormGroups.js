import { Button, Form, Input, Select, Modal, Upload } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useFacultiesStore } from "~/states/facultiesState";
import { useGroupList } from "~/hooks";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const FormGroups = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [isSubmit, isClear, isGroup, setGroup, details] = useFacultiesStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.isGroup,
            state.setGroup,
            state.details,
        ],
        shallow
    );
  
    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        form.setFieldsValue({
            group_id: details?.group_id,
        });
    }, [details]);

    const { data: groups } = useGroupList();

    return (
        <Modal
            visible={isGroup}
            onCancel={() => {
                setGroup(false);
            }}
            onOk={form.submit}
            title={`Update Groups`}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`Save Changes`}
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
                    name="group_id"
                    rules={[
                        {
                            required: true,
                            message: "Please select a group!",
                        },
                    ]}
                >
                    <Select
                        allowClear
                        showSearch
                        placeholder="Select groups "
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {Array.isArray(groups) &&
                            groups.map((obj, i) => {
                                return (
                                    <Option key={i} value={obj?.id}>
                                        {obj?.group_name} 
                                    </Option>
                                );
                            })}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default React.memo(FormGroups);
