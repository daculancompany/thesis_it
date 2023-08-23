import { Button, Form, Input, Select, Drawer, Space, message, Upload } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import { useSchoolYear, useSemesters } from "~/hooks";
import { UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const { Option } = Select;

const FormDocUpload = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        isSubmit,
        isClear,
        uploadDoc,
        setUploadDoc,
    ] = useThesisStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.uploadDoc,
            state.setUploadDoc,
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear])

    const {
        data: schoolyear,
    } = useSchoolYear();

    const {
        data: semesters,
    } = useSemesters();

    const propsDoc = {
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {  console.log(file.size)
            const isPNG = file.type === 'application/pdf';
            const fsize = Math.round((file.size / 1024 / 1024)); 
            if (!isPNG) {
                message.error(`${file.name} is not a pdf file`);
                return Upload.LIST_IGNORE;
            }
            if (fsize > 10) {
                message.error(`File size exceeds 10 MB`);
                return Upload.LIST_IGNORE;
            }
            
            return false;
        },
        onChange: (info) => {
            console.log(info.fileList);
        },
    };

    return (
        <Drawer
            title="Upload Document"
            width={500}
            open={uploadDoc}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setUploadDoc(false);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setUploadDoc(false);
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
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Form.Item
                    name="document"
                    rules={[
                        {
                            required: true,
                            message: "Please upload your document!",
                        },
                    ]}
                >
                    <Dragger
                        //disabled={fileList.length > 0}
                        {...propsDoc}
                        //beforeUpload={() => false}
                        showUploadList={{ showRemoveIcon: false }}
                        accept="application/pdf"
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Only allow PDF file.
                        </p>
                    </Dragger>
                    {/* <Upload beforeUpload={() => false} showUploadList={{ showRemoveIcon: false }} >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload> */}
                </Form.Item>
                <Form.Item
                    name="notes"
                    label=""
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: "Please enter Thesis Title!",
                    //     },
                    // ]}
                >
                    <Input placeholder="Notes" />
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormDocUpload);
