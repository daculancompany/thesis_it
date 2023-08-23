import { Button, Form, Input, Select, Drawer, Space } from "antd";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import { useFacultyList } from "~/hooks";

const { Option } = Select;

const FormPanel = React.memo(({ submitForm }) => {
    const [value, setValue] = useState([]);
    const [form] = Form.useForm(); 
    const [isSubmit, isClear, setTitle, title, thesisDetail, setThesisDetails, formPanel, setFormPanel, setScheduleDetails, scheduleDetails] = useThesisStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.setTitle,
            state.title,
            state.thesisDetail,
            state.setThesisDetails,
            state.formPanel,
            state.setFormPanel,
            state.setScheduleDetails,
            state.scheduleDetails,
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        let panel_list = [];
        let panels =  scheduleDetails?.panelist|| [];
        for (let index = 0; index < panels.length; index++) {
           panel_list.push(panels[index]?.fname+' '+panels[index]?.lname);
            
        }
        form.setFieldsValue({
            faculty: panel_list,
        });
    }, [scheduleDetails]);

    const {
        data: faculties 
    } = useFacultyList();

    return (
        <Drawer
            title="Edit Panelist"
            width={500}
            open={formPanel}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setFormPanel(false);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setFormPanel(false);
                        setScheduleDetails(null);
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
            >
                {/* <div style={{display:'none'}}>
                    <Form.Item 
                        name="defense_panel_id" 
                        label=""
                    >
                        <Input type="hidden" value={{ thesisID }} />
                    </Form.Item>
                </div> */}
                <Form.Item
                    name="faculty"
                    rules={[
                        {
                            required: true,
                            message: "Please select panelist!",
                        },
                    ]}
                >
                    {/* <Select
                        value={value}
                        mode="multiple"
                        showSearch
                        placeholder="Select  Faculties"
                        optionFilterProp="children"
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                    >
                         {Array.isArray(faculties) && faculties.map((obj,i) =>{
                            return ( <Option key={i} value={obj?.id}>{obj?.fname} {obj?.lname}</Option>)
                            }) }
                    </Select> */}
                    <Select
                            showSearch
                            mode="multiple"
                            value={value}
                            placeholder="Select a adviser"
                            optionFilterProp="children"
                            //onChange={onChange}
                            onChange={(newValue) => {
                                setValue(newValue);
                                // console.log(value);
                            }}
                            filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(faculties) && faculties.map((obj,i) =>{
                            return ( <Option key={i} value={obj?.id}>{obj?.fname} {obj?.lname}</Option>)
                            }) }
                        </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormPanel);
