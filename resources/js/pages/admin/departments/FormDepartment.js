import { Button, Form, Input, Modal,Select, Drawer, Space} from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useDepartmentStore } from "~/states/departmentState";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useCollegeList, } from "~/hooks";

const FormDepartment = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [
        setCreateDepartment,
        createNewDepartment,
        createDepartment,
        editDepartment,
        setEdit,
        isSubmit,
        isClear,
        loading,
    ] = useDepartmentStore(
        (state) => [
            state.setCreateDepartment,
            state.createNewDepartment,
            state.createDepartment,
            state.editDepartment,
            state.setEdit,
            state.isSubmit,
            state.isClear,
            state.loading,
        ],
        shallow
    );

    useEffect(() => {
        form.setFieldsValue({
            dept_name: editDepartment?.dept_name,
            college_id: editDepartment?.cid,
        });
    }, [editDepartment]);

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);
    
    const {
        data: colleges
    } = useCollegeList();
    
    return (
          <Drawer
          title={`${editDepartment ? "Edit Department" : "Create Department"}`}
          width={500}
          open={createDepartment}
          bodyStyle={{ paddingBottom: 80 }}
          onClose={() => {
            setCreateDepartment(false);
            setEdit(null);
          }}
          extra={
              <Space>
                  <Button onClick={() => {
                       setCreateDepartment(false);
                       setEdit(null);
                  }}>Cancel</Button>
                  <Button
                      key="submit"
                      type="primary"
                      loading={isSubmit}
                      onClick={form.submit}
                  >
                      {`${editDepartment ? "Save Changes" : "Create Department"}`}
                  </Button>
              </Space>
          }
      >
        <Form
            form={form}
            name="form-Department"
            layout="vertical"
            onFinish={(params) => submitForm(params)}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    form.submit();
                }
            }}
        >
            <Form.Item
                name="dept_name"
                label="Department Name"
                rules={[
                    {
                        required: true,
                        message: "Please input Department Name!",
                    },
                ]}
            >
                <Input placeholder="Department Name" />
            </Form.Item>
            <Form.Item
                name="college_id"
                label="College"
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
                    //defaultValue={editDepartment?.college_id}
                    //onChange={onChange}
                    // onSearch={onSearch}
                    // filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                    
                >
                    {Array.isArray(colleges) && colleges.map((obj, i) => {
                        return (
                        <Option  key={i} value={obj?.id}>{obj?.college_name}</Option>)
                    })}
                </Select>
            </Form.Item>
        </Form>
      </Drawer>
    );
});

export default React.memo(FormDepartment);
