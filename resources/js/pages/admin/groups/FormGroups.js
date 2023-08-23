import { Button, Form, Input, Select, Modal, Upload, Spin, Drawer, Space } from "antd";
import React, { useMemo, useRef, useState, useEffect } from "react";
import shallow from "zustand/shallow";
import { useGroupStore } from "~/states/groupState";
import { useStudentList } from "~/hooks";
import { InfoCircleOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { DebounceSelect } from "~/components";
import { useFacultyList } from "~/hooks";
import { getStorage } from "~/utils/helper";

const { Option } = Select;

const FormGroups = React.memo(({ submitForm }) => {
    const [value, setValue] = useState([]);

    const [form] = Form.useForm();
    const [
            isSubmit,
            isClear, 
            isGroup, 
            setGroup, 
            searchStudents, 
            editData,
            setClear,
            setEdit,
        ] 
        = useGroupStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.isGroup,
            state.setGroup,
            state.searchStudents,
            state.editData,
            state.setClear,
            state.setEdit,
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    let group_members = [];
    let list_groups_members = Array.isArray(editData?.students) ? editData?.students : [];
        for (let index = 0; index < list_groups_members.length; index++) {
            var full_name='';
            if(list_groups_members[index]?.mname!=''){
                full_name=list_groups_members[index]?.fname +" "+ list_groups_members[index]?.mname+"." +" "+list_groups_members[index]?.lname;
            }
            if(list_groups_members[index]?.mname===''){
                full_name=list_groups_members[index]?.fname +" " +" "+list_groups_members[index]?.lname;
            }
            group_members.push({
                label: full_name,
                value: list_groups_members[index]?.id,
            });
        }
    
    useEffect(() => {
        form.setFieldsValue({
            group_name: editData?.group_name,
            faculty_id: editData?.faculty_id,
            students: group_members,
        });
    }, [editData]);
   
    const { data: students } = useStudentList();

    async function fetchUserList(keywords) {
        const token =   getStorage("access_token");
        let _data = {
            keywords: keywords,
        }
        return await fetch("/api/student-search", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`, // notice the Bearer before your token
            },
            body: JSON.stringify(_data),
        }).then((response) => response.json())
            .then((body) =>
                body.students.map((students) => ({
                    label: `${students?.name}`,
                    value: students?.id,
                }))
            );

    }

    const {
        data: faculties
    } = useFacultyList();


    const onSearch = (value) => {

    };

    //console.log({faculties})

    return (
        <Drawer
            title={`${editData ? "Edit Group" : "Create  New Group"}`}
            width={500}
            open={isGroup}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setGroup(false);
                setClear(true);
                setEdit(null);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setGroup(false);
                        setClear(true);
                        setEdit(null);
                    }}>Cancel</Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}
                    >
                       {`${editData ? "Save Changes" : "Create Group"}`}
                    </Button>
                </Space>
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Form.Item
                    label="Group" 
                    name="group_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Group Name!",
                        },
                    ]}
                >
                    <Input placeholder="Group Name" />
                </Form.Item>
                <Form.Item
                    name="students"
                    label="Proponents" 
                    tooltip={{ title: 'The first student of choice will be the group leader.', icon: <InfoCircleOutlined /> }}
                    rules={[
                        {
                            required: true,
                            message: "Please select students!",
                        },
                    ]}
                >
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="Select students"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="faculty_id"
                    label="Adviser" 
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
                        //onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        value={1}
                        selected={1}
                    >
                        {Array.isArray(faculties) && faculties.map((obj, i) => {
                            return (<Option key={i} value={obj?.user_id}>{obj?.fname} {obj?.lname}</Option>)
                        })}
                    </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormGroups);
