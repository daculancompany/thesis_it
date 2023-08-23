import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { Pagination, Table, Tooltip, Button, message, Space, Card } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { Layout, HeaderTitle, Breadcrumb } from "~/components";
import { useScheduleReport } from "~/hooks";
import { useScheduleReportStore } from "~/states/scheduleStateReport";
// import { FormCollege } from "./index";
import { ERROR_MESSAGE } from "~/utils/constant";
import { SchedDetails } from "./index";

const SchedReportPage = () => {
    const history = useHistory();
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(0);

    const [
        isSubmit,
        isClear,
        visibleDetails,
        details,
        setClear,
        setSubmit,
        setVisibleDetails,
        setDetails,
        perPage,
        schedID,
        setSchedID,
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
    ] = useScheduleReportStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.visibleDetails,
            state.details,
            state.setClear,
            state.setSubmit,
            state.setVisibleDetails,
            state.setDetails,
            state.perPage,
            state.schedID,
            state.setSchedID,
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
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useScheduleReport(page, perPage);

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };
    async function getReportDetails(schedID) {
        const response = await axios.post(
            "/api/schedule/report-details?schedID=" + schedID
        );
        setReportDetails(response?.data?.rating);
        setRatingLength(response?.data?.rating.length);
        setPanelRating(response?.data?.rating);
        setTotalFacultyRating(response?.data?.total_rating);
        setThesisTitle(response?.data?.thesis?.thesis_name);
        setProponents(response?.data?.proponents);
        setTotalPanel(response?.data?.total_panel);
        //console.log('re',response?.data?.total_panel);
    }

    const columns = [
        {
            title: "Defense Date",
            dataIndex: "date_sched",
            key: "date_sched",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Thesis Title",
            dataIndex: "thesis_name",
            key: "thesis_name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => {
                            setReportDetails(null);
                            getReportDetails(value?.data?.id);
                            setVisibleDetails(true);
                            setDetails(value?.data);
                        }}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    let list = [];
    let list_array = Array.isArray(data?.report) ? data?.report : [];
    if (!isLoading) {
        for (let index = 0; index < list_array.length; index++) {
            list.push({
                key: index,
                id: list_array[index].id,
                date_sched: list_array[index].date_sched,
                time: list_array[index].time,
                thesis_name: list_array[index].thesis_name,
                data: list_array[index],
            });
        }
    }

    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Schedule Report Page" />
            <div className="tabled">
                <Card
                    title="Schedule Report"
                    bordered={false}
                    className="criclebox tablespace mb-24"
                >
                    <div className="table-responsive">
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columns}
                            dataSource={list}
                            className="ant-border-space"
                        />
                    </div>
                    <div className="pagination-table shadow-none">
                        {!isLoading && (
                            <Pagination
                                defaultCurrent={1}
                                total={data?.total || 0}
                                pageSize={perPage}
                                showSizeChanger={false}
                                onShowSizeChange={onShowSizeChange}
                                onChange={onChange}
                                className="mt-5"
                            />
                        )}
                    </div>
                </Card>
                {/* <FloatingButton
                    label="Add College"
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    shape="round"
                    onClick={() => setVisible(true)}
                /> */}
                {/* <FormCollege
                    submitForm={(params) => {
                        mutation.mutate({
                            college_name: params.college_name,
                            id: editData?.id || null,
                        });
                        setSubmit(true);
                    }}
                /> */}

                <SchedDetails
                    submitForm={(params) => {
                        // mutation.mutate({
                        //     college_name: params.college_name,
                        //     id: editData?.id || null,
                        // });
                        // setSubmit(true);
                    }}
                />
            </div>
        </Layout>
    );
};

export default React.memo(SchedReportPage);
