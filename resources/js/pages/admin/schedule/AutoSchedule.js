import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import {
    Col,
    Row,
    Card,
    Timeline,
    Avatar,
    Tooltip,
    Button,
    Typography,
    Divider,
    Empty,
    Spin,
    Table,
    Space,
    message,
} from "antd";
import {
    EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Layout, FloatingButton, HeaderTitle, Breadcrumb } from "~/components";
import { FormDate, FormScheduleDetails, SchedDetails } from "./index";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { useScheduleStore } from "~/states/scheduleState";
import { useSchedule, useThesisGroup, useThesisStages } from "~/hooks";
import axiosConfig from "~/utils/axiosConfig";


const { Title, Text } = Typography;
const { Meta } = Card;
// https://codereview.stackexchange.com/questions/121066/creating-an-array-with-quarter-hour-times
// https://codesandbox.io/s/react-drag-drop-files-sghbp?file=/src/App.js:483-492
// https://react-dropzone.js.org/#section-basic-example

const AutoSchedule = () => {
    const queryClient = useQueryClient();
    const [
        schedules,
        dates,
        setIsFormDate,
        createSchedule,
        setSubmit,
        setIsFormDetails,
        setGroupList,
        setEdit,
        setSchedDetails,
        isSchedDetails,
        setIsSchedDetails,
        setStartDate,
        setEndDate,
        datesDetails,
        setDatesDetails,
    ] = useScheduleStore(
        (state) => [
            state.schedules,
            state.dates,
            state.setIsFormDate,
            state.createSchedule,
            state.setSubmit,
            state.setIsFormDetails,
            state.setGroupList,
            state.setEdit,
            state.setSchedDetails,
            state.isSchedDetails,
            state.setIsSchedDetails,
            state.setStartDate,
            state.setEndDate,
            state.datesDetails,
            state.setDatesDetails,
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useSchedule();

    const { data: stages } = useThesisStages();

    const { data: groupsListData } = useThesisGroup();
    useEffect(() => {
        setGroupList(groupsListData);
    }, [groupsListData]);

    const mutation = useMutation(createSchedule, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                queryClient.invalidateQueries("scheduleQuery");
                queryClient.invalidateQueries("notifications");
                setIsFormDetails(false);
                message.success("New schedule successfully created!");
                return;
            }
        },
        onSettled: () => {
            setSubmit(false);
        },
    });

    async function fetchSchedDetails(schedID) {
        const response = await axiosConfig.post(
            "schedule/sched-details?schedID=" + schedID
        );
        setSchedDetails(response?.data?.defense_details);
        setStartDate(response?.data?.start);
        setEndDate(response?.data?.end);
        setIsSchedDetails(true);
    }

    const columns = [
        // {
        //     title: "Schedule ID",
        //     width: 150,
        //     dataIndex: "id",
        //     key: "id",
        // },
        {
            title: "Schedule",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Action",
            key: "action",
            width: "15px",
            align: 'center',
            render: (value) => (
                <>
                    <Space>
                        <Tooltip color={"#1577ff"} title="View">
                            <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                fetchSchedDetails(value?.id);
                            }}
                        />
                        </Tooltip>
                    </Space>
                </>
            ),
        },
    ];

    let schedule_list = [];
    let schedule_array = Array.isArray(data) ? data : [];
    if (!isLoading) {
        for (let index = 0; index < schedule_array.length; index++) {
            schedule_list.push({
                key: index,
                id: schedule_array[index].id,
                date: `${moment(`${schedule_array[index].start_date}`).format(
                    "LL"
                )} - ${moment(`${schedule_array[index].end_date}`).format(
                    "LL"
                )}`,
                data: schedule_array[index],
            });
        }
    }

 
    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Schedule  Page" />
            <FloatingButton
                label="Create New Schedule"
                onClick={() => setIsFormDate(true)}
            />
            {/* <Row gutter={[24, 0]}>
                    {Array.isArray(data) && data.map((obj, i) =>
                        <Col
                            key={i}
                            xs={24}
                            sm={24}
                            md={12}
                            lg={6}
                            xl={6}
                            className="mb-24"
                        >
                            <Card
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                    title="Card title"
                                    description={obj?.start_date}
                                />
                            </Card>
                        </Col>
                    )}
                </Row> */}
            <div className="tabled">
                <Card
                    title="Schedule List"
                    bordered={false}
                    className="criclebox tablespace mb-24"
                >
                    <div className="table-responsive">
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columns}
                            dataSource={schedule_list}
                            className="ant-border-space"
                        />
                    </div>
                </Card>
            </div>
            <FormDate
                submitForm={(params) => {
                    setSubmit(true);
                }}
            />
            <FormScheduleDetails
                submitForm={(params) => {
                   mutation.mutate(params);
                }}
            />
            <SchedDetails />
        </Layout>
    );
};

export default React.memo(AutoSchedule);
