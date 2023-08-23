import { Button, Form, Select,  Row, Col, Tooltip, Drawer, Space } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import { useSchoolYear, useSemesters, useFacultyList, useGroupList } from "~/hooks";

const { Option } = Select;

const FormThesis = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        editData,
        setEdit,
        isSubmit,
        setSubmit,
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
            state.setSubmit,
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

    return (
        <Drawer
            title="Create Thesis"
            width={500}
            open={visibleThesis}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setVisibleThesis(false);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setVisibleThesis(false);
                    }}>Cancel</Button>
                    <Button key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}>
                        {`${editData ? "Save Changes" : "Create Thesis"}`}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="form-student"
                onFinish={(params) => {setSubmit(true);submitForm(params)}}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
                layout="vertical"
            >
                <Row>
                    <Col span={22}>
                        <Form.Item
                            name="sy_id"
                            label="School Year"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a school year!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a school year"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {Array.isArray(schoolyear) && schoolyear.map((obj, i) => {
                                    return (<Option key={i} value={obj?.id}>{obj?.year}-{obj?.year2}</Option>)
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Tooltip title='Add School Year' color="cyan">
                            <Button
                                type="link"
                                onClick={() => {
                                    setAddSY(true);
                                }}
                            >ADD</Button>
                        </Tooltip>
                    </Col>
                </Row>
                {/*<Form.Item
                    name="sem_id"
                    rules={[
                        {
                            required: true,
                            message: "Please input your semester!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a semester"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        {Array.isArray(semesters) && semesters.map((obj,i) =>{
                           return ( <Option key={i} value={obj?.id}>{obj?.semester}</Option>)
                        }) }
                    </Select>
                </Form.Item>*/}
                {/* <Form.Item
                    name="adviser"
                    rules={[
                        {
                            required: true,
                            message: "Please select adviser!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a adviser"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        {Array.isArray(faculties) && faculties.map((obj, i) => {
                            return (<Option key={i} value={obj?.id}>{obj?.fname} {obj?.lname}</Option>)
                        })}
                    </Select>
                </Form.Item> */}
                <Col span={22}>
                    <Form.Item
                        name="group"
                        rules={[
                            {
                                required: true,
                                message: "Please select group!",
                            },
                        ]}
                        label="Group"
                    >
                        <Select
                            showSearch
                            placeholder="Select a group"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(groups) && groups.map((obj, i) => {
                                return (<Option key={i} value={obj?.id}>{obj?.group_name}</Option>)
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                {/*<Form.Item
                    name="thesis_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Thesis Title!",
                        },
                    ]}
                >
                    <Input placeholder="Thesis Description" />
                </Form.Item>*/}
                {/* <Form.Item
                    name="thesis_description"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Thesis Description!",
                        },
                    ]}
                >
                    <Input placeholder="Thesis Title" />
                </Form.Item> */}
                {/* <Form.Item
                    name="document"
                    rules={[
                        {
                            required: true,
                            message: "Please upload your document!",
                        },
                    ]}
                >
                    <Upload beforeUpload={() => false} showUploadList={{ showRemoveIcon: false }} >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item> */}
            </Form>
        </Drawer>
    );
});

export default React.memo(FormThesis);
