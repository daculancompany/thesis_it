import { Button, Form, Input, Select, Modal, Upload, Spin } from "antd";
import React, { useMemo, useRef, useState, useEffect } from "react";
import shallow from "zustand/shallow";
import { useGroupStore } from "~/states/groupState";
import { useStudentList } from "~/hooks";
import { UploadOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { DebounceSelect } from "~/components";
import { useFacultyList, useEmailsGroup } from "~/hooks";

const { Option } = Select;



const FormAddAccount = React.memo(({ submitForm }) => {
    const [value, setValue] = useState([]);

    const [form] = Form.useForm();
    const [isSubmit, isClear, addAccount, setAddAccount, groupDetails] = useGroupStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.addAccount,
            state.setAddAccount,
            state.groupDetails,
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        form.setFieldsValue({
            group_id: groupDetails?.id,
            group_name: groupDetails?.group_name,
        });
    }, [groupDetails]);

    const { data: students } = useStudentList();
    
    const {
        data: faculties 
    } = useFacultyList();

    const {
        data: emails 
    } = useEmailsGroup(groupDetails?.id);

    const onChange = (value) => {
  
    };
      
    const onSearch = (value) => {
      
    };

    return (
        <Modal
            visible={addAccount}
            onCancel={() => {
                setAddAccount(false);
            }}
            onOk={form.submit}
            title={`Create Group Account`}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`Save`}
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
                <h4>{groupDetails?.group_name}</h4>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: "Please select email!",
                        },
                    ]}
                    >
                    <Select
                        showSearch
                        placeholder="Select a email"
                        optionFilterProp="children"
                        //onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                    >
                        {Array.isArray(emails) && emails.map((obj,i) =>{
                        return ( <Option key={i} value={obj?.email}>{obj?.email} </Option>)
                        }) }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please input Password!",
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
                <Form.Item
                    name="group_id"
                    style={{display:'none'}}
                    rules={[
                        {
                            required: true,
                            message: "Please input your Last Name!",
                        },
                    ]}
                >
                    <Input type="hidden"  />
                </Form.Item>
                <Form.Item
                    name="group_name"
                    style={{display:'none'}}
                    rules={[
                        {
                            required: true,
                            message: "Please input your Last Name!",
                        },
                    ]}
                >
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default React.memo(FormAddAccount);
