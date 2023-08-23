import queryString from "query-string";
import { useHistory } from "react-router-dom";
import { Table, Button, message, Space, Card, Avatar, Tooltip, Pagination } from "antd";
import React from "react";
import shallow from "zustand/shallow";
import {
    Layout,
    FloatingButton,
    ThesisFilter,
    HeaderTitle,
    Breadcrumb,
    GroupsAvatar,
} from "~/components";
import { useThesisStore } from "~/states/thesisState";
import { useThesisFaculty } from "~/hooks";
import { ERROR_MESSAGE, DIR_LOCATION } from "~/utils/constant";
import { useMutation, useQueryClient } from "react-query";
import { FormThesis, FormAddSY } from "./index";
import secureLocalStorage from "react-secure-storage";
import {
    EyeOutlined,
} from "@ant-design/icons";

const role = secureLocalStorage.getItem("userRole");

const ThesisPageAdmin = (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search);
    const queryClient = useQueryClient();
    const [
        page,
        perPage,
        setSubmit,
        setClear,
        visibleThesis,
        setVisibleThesis,
        createNewThesis,
        createNewSY,
        setAddSY,
        filterBy,
        setFilterBy,
    ] = useThesisStore(
        (state) => [
            state.page,
            state.perPage,
            state.setSubmit,
            state.setClear,
            state.visibleThesis,
            state.setVisibleThesis,
            state.createNewThesis,
            state.createNewSY,
            state.setAddSY,
            state.filterBy,
            state.setFilterBy,
        ],
        shallow
    );

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    const mutationThesis = useMutation(createNewThesis, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("thesisFaculties");
                queryClient.invalidateQueries("group_list");
                setClear(true);
                setVisibleThesis(false);
                message.success("New thesis successfully created!");
            }
        },
    });

    const mutationSY = useMutation(createNewSY, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("schoolyear");
                setClear(true);
                setAddSY(false);
                message.success("New School Year successfully created!");
            }
        },
    });

    const {
        isLoading,
        data: thesis,
        isFetching,
    } = useThesisFaculty(page, perPage, filterBy);

    const viewDetails = (details) => {
        history.push(
            `/admin/thesis-details?id=${details?.id}&key=${btoa(
                details?.id
            )}&back=${btoa("/admin/thesis-details")}`           
        );
    };

    const columnsThesis = [
        {
            title: "Thesis ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Title",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Group Name",
            dataIndex: "group_name",
            key: "group_name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Proponents",
            dataIndex: "proponents",
            key: "proponents",
            render: (data) => (
                <Space>
                    <Avatar.Group>
                        {Array.isArray(data?.students) &&
                            data?.students.map((item, i) => {
                                return (
                                    <GroupsAvatar
                                        key={i}
                                        item={item}
                                        team_lead={data?.team_lead}
                                        DIR_LOCATION={DIR_LOCATION.profile}
                                    />
                                );
                            })}
                    </Avatar.Group>
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            align: 'center',
            render: (value) => (
                <Space>
                    <Tooltip title="view">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                viewDetails(value?.data);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    let list_thesis = [];
    let list_thesis_array = Array.isArray(thesis) ? thesis : [];
    if (!isLoading) {
        for (let index = 0; index < list_thesis_array.length; index++) {
            list_thesis.push({
                key: index,
                id: list_thesis_array[index].id,
                name: list_thesis_array[index].thesis_name,
                group_name: list_thesis_array[index].group_name,
                proponents: list_thesis_array[index],
                status:list_thesis_array[index].status,
                data: list_thesis_array[index],
            });
        }
    }


    return (
        <Layout breadcrumb={Breadcrumb.Department()}>
            <HeaderTitle title="Thesis Page" />
            <div className="tabled">
                <Card
                    title="Thesis List"
                    extra={
                        <ThesisFilter
                            submitForm={(params) => {
                                setFilterBy(params);
                                queryClient.invalidateQueries(
                                    "thesisFaculties"
                                );
                            }}
                        />
                    }
                    bordered={false}
                    className="card-table"
                >   <div className="table-responsive">
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columnsThesis}
                            dataSource={list_thesis}
                            className="ant-border-space"
                        />
                    </div>
                    <div className="pagination-table shadow-none">
                        {!isLoading && (
                            <Pagination
                                defaultCurrent={1}
                                total={thesis?.total || 0}
                                pageSize={perPage}
                                showSizeChanger={false}
                                onShowSizeChange={onShowSizeChange}
                                onChange={onChange}
                                className="mt-5"
                            />
                        )}
                    </div>
                </Card>
            </div>
            <FormThesis
                submitForm={(params) => {
                    mutationThesis.mutate(params);
                }}
            />
            {role === "admin" && (
                <FloatingButton
                    label="Create New Thesis"
                    onClick={() => setVisibleThesis(true)}
                />
            )}
            <FormAddSY
                submitForm={(params) => {
                    //params.thesis_id =  thesisDetail?.id || null,
                    mutationSY.mutate(params);
                    setSubmit(true);
                }}
            />
        </Layout>
    );
};

export default React.memo(ThesisPageAdmin);
