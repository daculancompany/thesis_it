import {
    Button,
    Form,
    Row,
    Col,
    Tooltip,
    Drawer,
    Space,
    DatePicker,
    Card,
    Timeline,
    Typography,
    Avatar,
    Empty,
    Popover,
} from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useThesisGroup } from "~/hooks";
import { useScheduleStore } from "~/states/scheduleState";
import { DIR_LOCATION } from "~/utils/constant";
import { SchedViewDetails } from "~/components";
import axiosConfig from "~/utils/axiosConfig";

const { Title, Text } = Typography;

const SchedDetails = ({ submitForm }) => {
    const [
        isSchedDetails,
        setIsSchedDetails,
        schedDetails,
        setReportDetails,
        setPanelRating,
        setRatingLength,
        setTotalFacultyRating,
        setThesisTitle,
        setProponents,
        setTotalPanel,
        totalPanelHasRating,
        setTotalPanelHasRating,
        setPanel,
    ] = useScheduleStore(
        (state) => [
            state.isSchedDetails,
            state.setIsSchedDetails,
            state.schedDetails,
            state.setReportDetails,
            state.setPanelRating,
            state.setRatingLength,
            state.setTotalFacultyRating,
            state.setThesisTitle,
            state.setProponents,
            state.setTotalPanel,
            state.totalPanelHasRating,
            state.setTotalPanelHasRating,
            state.setPanel
        ],
        shallow
    );
    
    async function fetchSchedDetails(defenseThesisDetailsId, groupID) {
        const response = await axiosConfig.get(
            "/schedule/schedule-view-details?defenseThesisDetailsId=" +
                defenseThesisDetailsId +
                "&groupID=" +
                groupID
        );
        //console.log(response?.data);
        setReportDetails(response?.data?.rating);
        setRatingLength(response?.data?.rating.length);
        setPanelRating(response?.data?.rating);
        setTotalFacultyRating(response?.data?.total_rating);
        setThesisTitle(response?.data?.thesis?.thesis_name);
        setProponents(response?.data?.proponents);
        setTotalPanel(response?.data?.total_panel);
        setTotalPanelHasRating(response?.data?.total_panel_has_rating);
        setPanel(response?.data?.panel);
    }
    console.log('schedDetails',schedDetails)
    return (
        <>
            <Drawer
                title="Schedule Details"
                width={"100%"}
                open={isSchedDetails}
                bodyStyle={{ paddingBottom: 80, backgroundColor: "#f2f2f2" }}
                onClose={() => {
                    setIsSchedDetails(false);
                }}
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
                                                            <Tooltip placement="top" title=''>
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
