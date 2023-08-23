import { Button, Form, Row, Col, Tooltip, Drawer, Space, DatePicker, Card, Timeline, Typography, Avatar, Empty} from "antd";
import {  ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useThesisGroup } from "~/hooks";
import { useScheduleStore } from "~/states/scheduleState";
import {DIR_LOCATION} from '~/utils/constant'

const { Title, Text } = Typography;

const FormScheduleDetails = ({submitForm}) => {
    const [
        isFormDetails,
        setIsFormDetails,
        dates,
        dateTimeGroups,
        setDateTimeGroups,
        category,
        sy,
        sem,
        groupList,
        isSubmit,
        setSubmit,
        groupListNew,
    ] = useScheduleStore(
        (state) => [
            state.isFormDetails,
            state.setIsFormDetails,
            state.dates,
            state.dateTimeGroups,
            state.setDateTimeGroups,
            state.category,
            state.sy,
            state.sem,
            state.groupList,
            state.isSubmit,
            state.setSubmit,
            state.groupListNew,
        ],
        shallow
    ); 
    const [form] = Form.useForm();
    let groups = [];
    let time_array = [];


    for (let index = 0; index < 2; index++) {
        groups.push({ id: index, group_name: 'Group Name' + index, thesis_title: 'Title Thesis ewsrewrewr rewrew rewre w' + index })
    }

    for (let i = 0; i < 24; i++) {
        let meridiem = ['AM', 'PM'];
        time_array.push({ value: `${i === 12 ? 12 : (i % 12) === 0 ? 12 : i % 12}:00 ${meridiem[i / 12 | 0]} - ${i % 12 + 1}:00 ${meridiem[i / 12 | 0]}` });
    }


    useEffect(() => {
        if (dates.length > 0) {
            let group_time_list = [];
            let counter_count = 0;
            let form_count = 0;
            let time_list = [];
            for (let index = 0; index < dates.length; index++) {
                let startTime = moment(`${dates[index]?.date} ${dates[index]?.time[0]}`, 'DD-MM-YYYY h A');
                let endTime = moment(`${dates[index]?.date} ${dates[index]?.time[1]}`, 'DD-MM-YYYY h A');
                let per_day = endTime.diff(startTime, 'hours');
                counter_count += per_day
                let from_counter = counter_count - per_day;
                let to_counter = counter_count;
                let timestart = moment(`${dates[index]?.date} ${dates[index]?.time[0]}`, 'DD-MM-YYYY h A').format('H')
                let timeend = moment(`${dates[index]?.date} ${dates[index]?.time[1]}`, 'DD-MM-YYYY h A').format('H');
                let time_datas = [];
                let counter_added = 0;
                for (let index3 = parseInt(timestart); index3 < parseInt(timeend); index3++) {
                    time_datas.push({ date: dates[index]?.date, time: time_array[index3] })
                }
                
                time_list.push(time_datas)
            }

            let array_list = time_list.reduce(function (arr, elem) {
                return arr.concat(elem);
            }, [])
            
            for (let index = 0; index < array_list.length; index++) {
                if (array_list[index]?.time?.value === '12:00 PM - 1:00 PM') {
                    array_list[index].thesis = 'lunch';
                } else {
                    array_list[index].thesis = groupListNew[index];
                }

            }
            setDateTimeGroups(array_list);
        }
    }, [dates])

   
    const formSubmit = () => {
        setSubmit(true);
        submitForm({dates, dateTimeGroups, stage_id: category, sy: sy, sem: sem,});
    }


    return (
        <>
            <Drawer
                title="Schedule Details"
                width={"100%"}
                open={isFormDetails}
                bodyStyle={{ paddingBottom: 80, backgroundColor: '#f2f2f2' }}
                onClose={() => {
                    setIsFormDetails(false);
                }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            setIsFormDetails(false);
                        }}>Cancel</Button>
                        <Button key="submit"
                            type="primary"
                            loading={isSubmit}
                            onClick={()=> {formSubmit()}}>
                            SUBMIT
                        </Button>
                    </Space>
                }
            >
                <div className="flex" >
                    {Array.isArray(dates) && dates.map((obj, i) =>
                        <Col span={6} key={i} className="sched-items">
                            <Card title={obj?.date} extra={<span>{obj?.time[0]} - {obj?.time[1]}</span>} bordered={false} className="mb-4 card-schedule">
                                <Timeline mode="left">
                                    {Array.isArray(dateTimeGroups) && dateTimeGroups.filter(value => value?.date.includes(obj?.date)).map((obj2, i) => ( 
                                        <Timeline.Item key={i} dot={<ClockCircleOutlined className="timeline-clock-icon" />} label={obj2?.time?.value} color={obj2?.thesis === 'lunch' ? 'green' : typeof obj2?.thesis === 'undefined' ? 'red' : 'blue'} >
                                            {obj2?.thesis  === 'lunch' && (
                                                <><b>Lunch Break</b></>
                                            )}
                                            {obj2?.thesis && obj2?.thesis !== 'lunch' && (
                                                <>
                                                    <Title level={5}>{obj2?.thesis?.thesis_name}</Title>
                                                    <Tooltip title="Group Name" placement="top" >
                                                       <Text>{obj2?.thesis?.group?.group_name}</Text>
                                                    </Tooltip>
                                                    <br></br>
                                                    <Avatar.Group>
                                                        {Array.isArray(obj2?.thesis?.students) && obj2?.thesis?.students.map((obj3, i3) =>
                                                            <Tooltip title={`${obj3?.fname} ${obj3?.lname}`} placement="top" key={i3} >
                                                                {obj3?.image ? <Avatar className="avatar-content" size="small" src={`${DIR_LOCATION.profile}${obj3?.image}`} icon={<UserOutlined />} /> : <Avatar className="avatar-content" size="small" icon={<UserOutlined />} />}
                                                            </Tooltip>
                                                        )}
                                                    </Avatar.Group>
                                                </>
                                            )}
                                            {typeof obj2?.thesis === 'undefined' && obj2?.thesis !== 'lunch' && (
                                                <>
                                                    <Empty description="No group assign" />
                                                </>
                                            )}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>
                        </Col>
                    )}
                </div>
            </Drawer>
        </>
    );
};

export default React.memo(FormScheduleDetails);
