import { Button, Form, Input, Select, Modal, Upload, Row, Col, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import { useSchoolYear, useSemesters, useFacultyList, useGroupList } from "~/hooks";
import { UploadOutlined } from '@ant-design/icons';
import { useState } from "react";

const { Option } = Select;

const FormAddSY = React.memo(({ submitForm }) => {
    const [secondVal, setSecondVal] = useState(1);
    const [form] = Form.useForm();
    const [
        editData,
        setEdit,
        isSubmit,
        isClear,
        visibleThesis,
        setVisibleThesis,
        addSY,
        setAddSY,
    ] = useThesisStore(
        (state) => [
            state.editData,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.visibleThesis,
            state.setVisibleThesis,
            state.addSY,
            state.setAddSY,
        ],
        shallow
    );

    useEffect(() => {
        form.setFieldsValue({
            dept_name: editData?.dept_name,
        });
    }, [editData]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear])

    const {
        data: schoolyear,
    } = useSchoolYear();

    const {
        data: semesters,
    } = useSemesters();

    const {
        data: faculties,
    } = useFacultyList();

    const {
        isLoading,
        data: groups,
        isFetching,
    } = useGroupList();

    const onChange = (value) => {
       
    };

    const onSearch = (value) => {
        
    };

    const changeFirstValue = (e) => {
        form.setFieldsValue({
            year_2:Number(e.target.value) + Number(1),
        });
        if(e.target.value===''){
            form.setFieldsValue({
                year_2:0,
            });
        }
    }


    return (
        <Modal
            visible={addSY}
            onCancel={() => {
                setAddSY(false);
            }}
            onOk={form.submit}
            title="Create  New School Year"
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`${editData ? "Save Changes" : "Create SY"}`}
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="form-SY"
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="year_1"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input year!",
                                },
                            ]}
                        >
                            <Input placeholder="Year"  maxLength={4}  onChange={changeFirstValue}  onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}/>
                        </Form.Item>
                    </Col>
                    <Col span={2}> <h3 style={{marginLeft:'13px'}}>-</h3> </Col>
                    <Col span={11}>
                        <Form.Item
                            name="year_2"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input year!",
                                },
                            ]}
                            defaultValue={secondVal}
                        >
                            <Input placeholder="Year"  value={secondVal} maxLength={4}  editable={false}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                        }
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
});

export default React.memo(FormAddSY);
