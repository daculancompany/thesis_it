import { Button, Form, Input, Modal, Row, Col, Drawer } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useSchoolYearStore } from "~/states/schoolYearState";
import { useState } from "react";

const FormAddSY = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [secondVal, setSecondVal] = useState(1);
    const [
            setCreateSY,
            createNewSY,
            createSY,
            editSY,
            setEdit,
            setSubmit,
            perPage,
            setClear,
            isClear,
            loading,
            isSubmit,
    ] = useSchoolYearStore(
        (state) => [
            state.setCreateSY,
            state.createNewSY,
            state.createSY,
            state.editSY,
            state.setEdit,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.isClear,
            state.loading,
            state.isSubmit,
        ],
        shallow
    );

    useEffect(() => {
        form.setFieldsValue({
           year_1: editSY?.year,
           year_2: editSY?.year2,
        });
    }, [editSY]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear])
 
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
        <Drawer
            width={500}
            open={createSY}
            onClose={() => {
                setCreateSY(false);
                setClear(true);
                setEdit(null);
            }}
            onOk={form.submit}
            title={`${editSY ? "Edit School Year" : "Create New School Year"}`}
            extra={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`${editSY ? "Save Changes" : "Create SY"}`}
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
        </Drawer>
    );
});

export default React.memo(FormAddSY);
