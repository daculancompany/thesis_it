import { Button, Form, Select, Drawer, Space, DatePicker, TimePicker, Divider, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useThesisStages } from "~/hooks";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useScheduleStore } from "~/states/scheduleState";
import { useSemesters,useSchoolYear } from "~/hooks";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { RangePicker } = DatePicker;
const { Option } = Select;

var getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};

const FormDate = () => {
    const [form] = Form.useForm();
    const [
        formDate,
        setFormDates,
        dates,
        setDates,
        isFormDate,
        setIsFormDate,
        setIsFormDetails,
        sem,
        sy,
        setCategory,
        setSY,
        setSem,
        groupList,
        setGroupList,
        isSubmit,
        setSubmit,
        groupListNew,
        setGroupListNew
    ] = useScheduleStore(
        (state) => [
            state.formDate,
            state.setFormDates,
            state.dates,
            state.setDates,
            state.isFormDate,
            state.setIsFormDate,
            state.setIsFormDetails,
            state.sem,
            state.sy,
            state?.setCategory,
            state?.setSY,
            state?.setSem,
            state.groupList,
            state.setGroupList,
            state.isSubmit,
            state.setSubmit,
            state.groupListNew,
            state.setGroupListNew
        ],
        shallow
    );

    const onChange = (date) => {
        var daylist = getDaysArray(new Date(date[0]), new Date(date[1]));
        setFormDates(daylist)
    };

    const submitForm = (values) => {   console.log(values)
        let dates_data = [];
        for (let index = 0; index < formDate.length; index++) {  
            dates_data.push({
                date: dayjs(formDate[index]).format('YYYY-MM-DD'),
                time: [dayjs(values?.['time' + index][0]).format('h A'), dayjs(values?.['time' + index][1]).format('h A')]
            })
        }
        setCategory(values?.category);
        setSem(values?.sem);
        setSY(values?.sy);
        setDates(dates_data);
        setIsFormDate(false);
        setIsFormDetails(true);
        setIsFormDetails(true);
    }

    const {
        data: stages,
    } = useThesisStages();

    const {
        data: semesters,
    } = useSemesters();

     const {
        data: schoolYear,
    } = useSchoolYear();

    const removeDate = (index) => {
        const newData = [...formDate]
        newData.splice(index, 1);
        setFormDates(newData);
    }

    const selectCategory = (value) => {
        let new_groups = []
        for (let index = 0; index < groupList.length; index++) {
            if(groupList[index]?.stage_id === parseInt(value)){
                new_groups.push(groupList[index])
            }
            
        }
        setGroupList(new_groups);
    }
    
    return (
        <>
            <Drawer
                title="Schedule Settings"
                width={500}
                open={isFormDate}
                bodyStyle={{ paddingBottom: 80 }}
                onClose={() => {
                    setIsFormDate(false);
                }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            setIsFormDate(false);
                        }}>Cancel</Button>
                        <Button key="submit"
                            type="primary"
                            loading={isSubmit}
                            onClick={form.submit}>
                            SUBMIT
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="form-student"
                    onFinish={(params) => submitForm(params)}
                    labelCol={{
                        span: 8,
                      }}
                      wrapperCol={{
                        span: 16,
                      }}
                >
                    <Form.Item
                        name="date"
                        label="Date"
                    >
                        <RangePicker onChange={onChange} format="YYYY-MM-DD" style={{ width: '100%' }} placement="bottomRight" />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: "Please select category!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a category"
                            optionFilterProp="children"
                            onChange={(value) => {
                                let new_groups = []
                                for (let index = 0; index < groupList.length; index++) {
                                    if(groupList[index]?.stage_id == parseInt(value)){
                                        new_groups.push(groupList[index])
                                    }
                                }
                                setGroupListNew(new_groups);
                            }} 
                            filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(stages) && stages.map((obj, i) => {
                                return (<Option key={i} value={obj?.id}>{obj?.name}</Option>)
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="sem"
                        label="Semester"
                        rules={[
                            {
                                required: true,
                                message: "Please select semester!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a semester"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(semesters) && semesters.map((obj, i) => {
                                return (<Option key={i} value={obj?.id}>{obj?.semester}</Option>)
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="sy"
                        label="School Year"
                        rules={[
                            {
                                required: true,
                                message: "Please select school year!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a School Year"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(schoolYear) && schoolYear.map((obj, i) => {
                                return (<Option key={i} value={obj?.id}>{obj?.year}-{obj?.year2}</Option>)
                            })}
                        </Select>
                    </Form.Item>
                    <Divider dashed>Date & Time</Divider>
                    {Array.isArray(formDate) && formDate.map((obj, i) => {
                        return (
                            <div key={i} >
                                <Form.Item
                                    label={moment(obj).local().format('ddd MMM DD, yyyy')}
                                    name={`time${i}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select schedule time!",
                                        },
                                    ]}

                                >
                                    {/*  defaultValue={[moment('08:00', "h A"), moment('15:00', "h A")]} */}
                                    <TimePicker.RangePicker format="h A" />
                                </Form.Item>
                                <div className="date-remove">
                                    <Button
                                        type="link"
                                        danger
                                        onClick={() => removeDate(i)}

                                    >REMOVE</Button>
                                </div>
                                <Divider dashed />
                            </div>
                        )
                    })}
                    {Array.isArray(formDate) && formDate.length === 0 && (
                        <Empty />
                    )}
                   
                </Form>
            </Drawer>
        </>
    );
};

export default React.memo(FormDate);
