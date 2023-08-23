
import React from "react";
import { Col, Row, Card, Timeline, Avatar, Tooltip, Button, Typography } from 'antd';
import { AntDesignOutlined, UserOutlined, ClockCircleOutlined, PlusOutlined, GroupOutlined  } from '@ant-design/icons';
import { Layout, FloatingButton } from "~/components";
import shallow from "zustand/shallow";
import { useScheduleStore } from "~/states/scheduleState";

const { Title, Text } = Typography;

// https://codereview.stackexchange.com/questions/121066/creating-an-array-with-quarter-hour-times
// https://codesandbox.io/s/react-drag-drop-files-sghbp?file=/src/App.js:483-492
// https://react-dropzone.js.org/#section-basic-example

const AutoSchedule = () => {

    const [
        schedules,
        dates,
    ] = useScheduleStore(
        (state) => [
            state.schedules,
            state.dates
        ],
        shallow
    );

    let groups = [];
    let time_array = [];
    let date_content = [];

    for (let index = 0; index < 40; index++) {
        groups.push({ id: index, group_name: 'Group Name' + index, thesis_title: 'Title Thesis ewsrewrewr rewrew rewre w' + index })
    }

    for (let i = 8; i < 20; i++) {
        let meridiem = ['AM', 'PM'];
        time_array.push({ value: `${i === 12 ? 12 : i % 12}:00-${i % 12 + 1}:00 ${meridiem[i / 12 | 0]}` });
    }
   
    for (let index = 0; index < dates.length; index++) {
        let per_day = 12;
        let from_counter = per_day * index;
        let to_counter = 12 * (index + 1);
        let group_time_list = [];

        for (let index2 = from_counter; index2 < to_counter; index2++) {
            let day_counter = index2 < per_day ? index2 : index2 - per_day;
            let time =time_array[day_counter];
            let group = groups[index2];
            if (time_array[day_counter]?.value !== '12:00-1:00 PM') {
                group_time_list.push({ group: group, time: time })
            } else {
                group_time_list.push({ group: 'lunch', time: time })
            }
        }
        date_content.push({ date: dates[index], data: group_time_list });
    }

   

    return (
        <Layout>
            <div>
                <Row gutter={24}>
                    {date_content.map((obj, i) =>
                        <Col span={6} key={i}>
                            <Card title={obj?.date} bordered={false}>
                                <Timeline mode="left">
                                    {obj?.data?.map((obj2, i) =>
                                        <Timeline.Item key={i} dot={<ClockCircleOutlined className="timeline-clock-icon" />} label={obj2?.time?.value} color="green">
                                            {obj2?.group === 'lunch' && (
                                                <><b>Lunch</b></>
                                            )}
                                            {obj2?.group !== 'lunch' && (
                                                <>
                                                    <Title level={5}>{obj2?.group?.thesis_title}</Title>
                                                    <Text strong>Group</Text>
                                                    <br></br>
                                                    <Avatar.Group>
                                                        <Tooltip title="Ant User" placement="top">
                                                            <Avatar style={{ backgroundColor: '#f56a00' }}>L</Avatar>
                                                        </Tooltip>
                                                        <Tooltip title="Ant User 222" placement="top">
                                                            <Avatar style={{ backgroundColor: '#f56a00' }}>L</Avatar>
                                                        </Tooltip>
                                                    </Avatar.Group>
                                                    {/* <p>Faculty</p>
                                                    <Avatar.Group>
                                                        <Tooltip title="Ant User" placement="top">
                                                            <Avatar style={{ backgroundColor: '#87d068' }}>L</Avatar>
                                                        </Tooltip>
                                                        <Tooltip title="Ant User 222" placement="top">
                                                            <Avatar style={{ backgroundColor: '#87d068' }}>L</Avatar>
                                                        </Tooltip>
                                                    </Avatar.Group>
                                                    <br></br>
                                                    <Button type="link">Edit Panelist</Button> */}
                                                </>
                                            )}

                                        </Timeline.Item>
                                    )}
                                </Timeline>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
            <FloatingButton
                label="Save Schedule"
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                shape="round"
            // onClick={() => setCreateEmployee(true)}
            />
        </Layout>
    );
};

export default React.memo(AutoSchedule);
