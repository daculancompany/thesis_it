import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { Card, Tooltip, Button, Typography, Table, Space, message ,Pagination } from "antd";
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
import moment from "moment";
import { Layout, HeaderTitle, Breadcrumb, ScheduleFilter } from "~/components";
import { SchedDetails } from "./index";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { useScheduleStore } from "~/states/scheduleState";
import {  useThesisGroup, useThesisStages,useScheduleReports } from "~/hooks";
import axiosConfig from "~/utils/axiosConfig";
import { PER_PAGE } from '~/utils/constant';

const { Title, Text } = Typography;

const { Meta } = Card;
// https://codereview.stackexchange.com/questions/121066/creating-an-array-with-quarter-hour-times
// https://codesandbox.io/s/react-drag-drop-files-sghbp?file=/src/App.js:483-492
// https://react-dropzone.js.org/#section-basic-example

const SchedReportPage = () => {
    const queryClient = useQueryClient();
    const [page2, setPage2] = React.useState(0);
    const [
        page,
        setPage,
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
        reportData,
        setReportData,
        schedReport,
        setSchedreport,
        setSchedreportPdf,
        perPage,
        setSchedId,
        filterBy,
        setFilterBy,
        sy,
        setSy,
        sem,
        setSem,
        category,
        setCategory,
        college,
        setCollege,
        dept,
        setDept
    ] = useScheduleStore(
        (state) => [
            state.page,
            state.setPage,
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
            state.reportData,
            state.setReportData,
            state.schedReport,
            state.setSchedreport,
            state.setSchedreportPdf,
            state.perPage,
            state.setSchedId,
            state.filterBy,
            state.setFilterBy,
            state.sy,
            state.setSy,
            state.sem,
            state.setSem,
            state.category,
            state.setCategory,
            state.college,
            state.setCollege,
            state.dept,
            state.setDept
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useScheduleReports(page, PER_PAGE, filterBy);

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
        setReportData(response?.data?.schedules);
        setSchedreport(response?.data?.sched_report);
        setIsSchedDetails(true);
        setSchedId(response?.data?.defense_sched_id);
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
    let schedule_array = Array.isArray(data?.schedules) ? data?.schedules : [];
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

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize,page2) => {
        setPage(page - 1);
        // setPage2(page2 - 1);
    };

    const clearFilter = () => {
        setSubmit(false);
        setFilterBy(null)
    }
    
    let hrefLink = '/schedule-pdf/'+ sy+'/' + sem +'/'+ category+'/' + college+'/' + dept+'/';
    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Schedule Report Page" />
            <div className="tabled">
                <Card
                    title="Schedule List"
                    bordered={false}
                    className="criclebox tablespace mb-24"
                    extra={
                        <Space>
                            <ScheduleFilter
                                submitForm={(params) => {
                                    setSy(null);
                                    setSem(null);
                                    setCategory(null);
                                    setCollege(null);
                                    setDept(null);
                                    setFilterBy(params);
                                    queryClient.invalidateQueries("scheduleReports");
                                }}
                                clearFilter={() => clearFilter()}
                            />
                            <Tooltip color={"#ff4d4f"} title="Download pdf">
                            <Button
                                danger
                                href={hrefLink}
                                target="blank"
                                shape="circle"
                                icon={<FilePdfOutlined />}
                            />
                            </Tooltip>
                        </Space>
                    }
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
                    <div className="pagination-table shadow-none">
                        {!isLoading && (
                            <Pagination
                                defaultCurrent={page + 1}
                                total={data?.total || 0}
                                pageSize={2}
                                showSizeChanger={false}
                                onShowSizeChange={onShowSizeChange}
                                onChange={onChange}
                            />
                        )}
                    </div>
                </Card>
            </div>
            {/* <FormScheduleDetails
                submitForm={(params) => {
                   mutation.mutate(params);
                }}
            /> */}
            <SchedDetails />
        </Layout>
    );
};

export default React.memo(SchedReportPage);
