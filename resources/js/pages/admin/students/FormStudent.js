import { Button, Form, Input, Select, Drawer, Space } from "antd";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useStudentStore } from "~/states/studentState"
import { UploadProfile } from "~/components";
import { useDepartmentList, useCollegeList } from "~/hooks";
import {  DIR_LOCATION } from '~/utils/constant';
import { isArray } from "lodash";

const { Option } = Select;

const FormStudent = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [imageOld,setImageOld] = useState(null);
    const [department_list, setDeparment] = useState([]);
    const [
        createStudent,
        setCreateStudent,
        editStudent,
        setEdit,
        isSubmit,
        isClear,
        setImage,
        setSubmit,
    ] = useStudentStore(
        (state) => [
            state.createStudent,
            state.setCreateStudent,
            state.editStudent,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.setImage,
            state.setSubmit,
        ],
        shallow
    );
    const {
        data : colleges,
    } = useCollegeList();

    const {
        data : departments,
    } = useDepartmentList();

    useEffect(() => {
        var phone='';
        if(editStudent?.phone!='undefined'){
            phone=editStudent?.phone;
        }
        var mname='';
        if(editStudent?.mname!='undefined'){
            mname=editStudent?.mname;
        }
        form.setFieldsValue({
            email: editStudent?.email,
            fname: editStudent?.fname,
            lname: editStudent?.lname,
            mname: mname,
            phone: phone,
            department_id: editStudent?.department_id,
        });
        if(editStudent?.image){
            setImageOld(DIR_LOCATION.profile+editStudent?.image);
        }else{
            setImageOld(null);
        }
    }, [editStudent]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        setDeparment(departments);
    }, [departments]);

    const onChangeCollege = (college) => {
        const department = departments.filter(
            (item) => parseInt(item.college_id) === parseInt(college)
        );
        setDeparment(isArray(department) ? department : []);
        form.setFieldsValue({
            department_id: null,
        });
    };

    return (
        <Drawer
            title={`${editStudent ? "Edit Student" : "Create  New Student"}`}
            width={500}
            open={createStudent}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setCreateStudent(false);
                setEdit(null);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setCreateStudent(false);
                        setEdit(null);
                    }}>Cancel</Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}
                    >
                        {`${editStudent ? "Save Changes" : "Create Student"}`}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="form-student"
                layout="vertical"
                onFinish={(params) => {setSubmit(true);submitForm(params)}}
            >
                <Form.Item
                    name="image"
                >
                   <UploadProfile imageOld={imageOld} updateImage={(image) => setImage(image)}  />
                </Form.Item>
                <Form.Item
                    label="College"
                    name="college_id"
                    rules={[
                        {
                            required: true,
                            message: "Please select college!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a college"
                        optionFilterProp="children"
                        onChange={onChangeCollege}
                        //onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }    
                    >
                        {Array.isArray(colleges) && colleges.map((obj, i) => {
                            return (
                                <Option key={i} value={obj?.id}>{obj?.college_name}</Option>
                            );
                        })}
                    </Select>
                </Form.Item> 
                <Form.Item
                    label="Department"
                    name="department_id"
                    rules={[
                        {
                            required: true,
                            message: "Please select department!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a department"
                        optionFilterProp="children"
                        //onChange={onChange}
                        //onSearch={onSearch}
                        filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                    >
                        {Array.isArray(department_list) && department_list.map((obj, i) => {
                            return (<Option key={i} value={obj?.id}>{obj?.dept_name}</Option>)
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="fname"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your First Name!",
                        },
                    ]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    name="lname"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Last Name!",
                        },
                    ]}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item name="mname" label="Middle Initial">
                    <Input placeholder="Middle Initial" maxLength={1} />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                    <Input placeholder="Phone"  maxLength={11}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                        }}
                    />
                </Form.Item>
                <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Email!",
                                },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                {!editStudent && (
                    <>
                        <div style={{ minHeight: 10 }}></div>
                        {/*<Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
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
                        </Form.Item>*/}
                    </>
                )}
            </Form>
        </Drawer>
    );
});

export default React.memo(FormStudent);
