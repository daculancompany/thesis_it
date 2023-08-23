 import { Button, Form, Row, Col, Tooltip, Drawer, Space, DatePicker, Card, Timeline, Typography, Avatar, Empty, Popover} from "antd";
import {  ClockCircleOutlined, UserOutlined, FilePdfOutlined} from '@ant-design/icons';
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useThesisGroup } from "~/hooks";
import { useScheduleStore } from "~/states/scheduleState";
import {DIR_LOCATION} from '~/utils/constant'
import {  SchedViewDetails } from "~/components";
import axiosConfig from "~/utils/axiosConfig";

const { Title, Text } = Typography;

const SchedDetails = ({submitForm}) => {
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
        setSubmit,
        isSchedDetails,
        setIsSchedDetails,
        schedDetails,
        start_date,
        end_date,
        datesDetails,
        setDatesDetails,
        reportDetails,
        setReportDetails,
        panelRating,
        setPanelRating,
        setRatingLength,
        setTotalFacultyRating,
        thesisTitle,
        setThesisTitle,
        proponents,
        setProponents,
        setTotalPanel,
        reportData,
        setReportData,
        schedReport,
        setSchedreport,
        defenseSchedId,
        isViewPdf,
        setIsViewPdf,
        setSchedDetails,
        setStartDate,
        setSchedId,
        setEndDate 
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
            state.setSubmit,
            state.isSchedDetails,
            state.setIsSchedDetails,
            state.schedDetails,
            state.start_date,
            state.end_date,
            state.datesDetails,
            state.setDatesDetails,
            state.reportDetails,
            state.setReportDetails,
            state.panelRating,
            state.setPanelRating,
            state.setRatingLength,
            state.setTotalFacultyRating,
            state.thesisTitle,
            state.setThesisTitle,
            state.proponents,
            state.setProponents,
            state.setTotalPanel,
            state.reportData,
            state.setReportData,
            state.schedReport,
            state.setSchedreport,
            state.defenseSchedId,
            state.isViewPdf,
            state.setIsViewPdf,
            state.setSchedDetails,
            state.setStartDate,
            state.setSchedId,
            state.setEndDate 
        ],
        shallow
    ); 
   
// console.log('schedDetailsrep', schedDetails)
async function fetchSchedDetails(defenseThesisDetailsId,groupID){
    const response = await axiosConfig.get("/schedule/schedule-view-details?defenseThesisDetailsId=" + defenseThesisDetailsId+'&groupID='+groupID)
    //console.log(response?.data);
    setReportDetails(response?.data?.rating);
    setRatingLength(response?.data?.rating.length);
    setPanelRating(response?.data?.rating);
    setTotalFacultyRating(response?.data?.total_rating);
    setThesisTitle(response?.data?.thesis?.thesis_name);
    setProponents(response?.data?.proponents);
    setTotalPanel(response?.data?.total_panel);
}

async function fetchSchedDetailsPdf(schedID){
    const response = await axiosConfig.post(
        "schedule/sched-details?schedID=" + schedID
    );
   
    setSchedDetails(response?.data?.defense_details);
    setStartDate(response?.data?.start);
    setEndDate(response?.data?.end);
    setReportData(response?.data?.schedules);
    setSchedreport(response?.data?.sched_report);
    setIsSchedDetails(true);
    setSchedId(response?.data?.defense_sched_id);
}
// console.log('schedDetails',schedDetails)

let hrefLink = '/schedule-details-pdf/' + defenseSchedId ;
    return (
        <>
            <Drawer
                title="Schedule Details"
                width={"100%"}
                open={isSchedDetails}
                bodyStyle={{ paddingBottom: 80, backgroundColor: '#f2f2f2' }}
                onClose={() => {
                    setIsSchedDetails(false);
                    setReportData(null);
                    // setSchedDetails(null);
                }}
                extra={
                    <Space>
                            <Tooltip color={"#f44336"} title="Download PDF" >
                                <Button
                                    danger
                                    shape="circle"
                                    icon={<FilePdfOutlined />}
                                    href={hrefLink}
                                    target="blank"
                                    method="get"
                                >
                                </Button>
                            </Tooltip>
                    </Space>
                }
            >
                <Row gutter={24} type="flex">
                    {Array.isArray(schedDetails) &&
                        schedDetails.map((obj, i) => (
                            <Col span={6} key={i}>
                                <Card
                                    title={obj?.sched_date}
                                    bordered={false}
                                    className="mb-4 card-schedule"
                                >
                                    <Timeline mode="left">
                                        {Array.isArray(obj?.thesis) &&
                                            obj?.thesis.map((obj2, i) => (
                                                <Timeline.Item
                                                    key={i}
                                                    dot={
                                                        <ClockCircleOutlined className="timeline-clock-icon" />
                                                    }
                                                    label={obj2?.time}
                                                    color={
                                                        obj2?.time ===
                                                        "12:00 PM - 1:00 PM"
                                                            ? "green"
                                                            : obj2?.thesis_id ===
                                                              null
                                                            ? "red"
                                                            : "blue"
                                                    }
                                                >
                                                    {obj2?.time ===
                                                        "12:00 PM - 1:00 PM" && (
                                                        <>
                                                            <b>Lunch Break</b>
                                                        </>
                                                    )}
                                                    {obj2?.time !=
                                                        "12:00 PM - 1:00 PM" && (
                                                        <>
                                                            <Title level={5}>
                                                                {
                                                                    obj2?.thesis_name
                                                                }
                                                            </Title>
                                                            <Tooltip placement="top">
                                                                <Popover
                                                                    title="Rating"
                                                                    trigger="hover"
                                                                    content={
                                                                        <SchedViewDetails />
                                                                    }
                                                                    //key={i2}
                                                                >
                                                                    <Text
                                                                        onMouseOver={() => {
                                                                            fetchSchedDetails(
                                                                                obj2?.defense_thesis_details_id,
                                                                                obj2?.group?.group_id
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            obj2?.group?.group_name
                                                                        }
                                                                    </Text>
                                                                </Popover>
                                                            </Tooltip>

                                                            <br></br>
                                                            {/* <br></br> */}
                                                            {obj2?.thesis_id != 0 && (
                                                                <>
                                                                    <Text>Proponents: </Text><br></br>
                                                                </>
                                                            )}
                                                            <Avatar.Group>
                                                                {Array.isArray(
                                                                    obj2?.students
                                                                ) &&
                                                                    obj2?.students.map(
                                                                        (
                                                                            obj3,
                                                                            i3
                                                                        ) => (
                                                                            <Tooltip
                                                                                title={`${obj3?.fname} ${obj3?.lname}`}
                                                                                placement="top"
                                                                                key={
                                                                                    i3
                                                                                }
                                                                            >
                                                                                {obj3?.image ? (
                                                                                    <Avatar
                                                                                        className="avatar-content"
                                                                                        size="small"
                                                                                        src={`${DIR_LOCATION.profile}${obj3?.image}`}
                                                                                        icon={
                                                                                            <UserOutlined />
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <Avatar
                                                                                        className="avatar-content"
                                                                                        size="small"
                                                                                        icon={
                                                                                            <UserOutlined />
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Tooltip>
                                                                        )
                                                                    )}
                                                            </Avatar.Group><br></br>
                                                            {obj2?.thesis_id != 0 && (
                                                                <>
                                                                    <Text>Panels: </Text><br></br>
                                                                </>
                                                            )}                  
                                                            <Avatar.Group>
                                                                {Array.isArray(
                                                                    obj2?.panels
                                                                ) &&
                                                                    obj2?.panels.map(
                                                                        (
                                                                            obj3,
                                                                            i3
                                                                        ) => (
                                                                            <Tooltip
                                                                                title={`${obj3?.fname} ${obj3?.lname}`}
                                                                                placement="top"
                                                                                key={
                                                                                    i3
                                                                                }
                                                                            >
                                                                                {obj3?.image ? (
                                                                                    <Avatar
                                                                                        className="avatar-content"
                                                                                        size="small"
                                                                                        src={`${DIR_LOCATION.profile}${obj3?.image}`}
                                                                                        icon={
                                                                                            <UserOutlined />
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <Avatar
                                                                                        className="avatar-content"
                                                                                        size="small"
                                                                                        icon={
                                                                                            <UserOutlined />
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Tooltip>
                                                                        )
                                                                    )}
                                                            </Avatar.Group>
                                                        </>
                                                    )}
                                                    {obj2?.thesis_id === 0 &&
                                                        obj2?.time !=
                                                            "12:00 PM - 1:00 PM" && (
                                                            <>
                                                                <Empty description="No group assign" />
                                                            </>
                                                    )}
                                                </Timeline.Item>
                                         ))}
                                    </Timeline>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </Drawer>
        </>
    );
};

export default React.memo(SchedDetails);
