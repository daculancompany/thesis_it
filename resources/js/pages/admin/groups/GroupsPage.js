import {
    EditOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { useHistory } from "react-router-dom";
import {
    Pagination,
    Table,
    Tooltip,
    Button,
    message,
    Space,
    Card,
    Avatar,
} from "antd";
import React from "react";
import shallow from "zustand/shallow";
import { Layout, FloatingButton, HeaderTitle, Breadcrumb, GroupsAvatar } from "~/components";
import { useGroupStore } from "~/states/groupState";
import { useGroup } from "~/hooks";
import { ERROR_MESSAGE, PER_PAGE, DIR_LOCATION } from "~/utils/constant";
import { useMutation, useQueryClient } from "react-query";
import { FormGroups } from "./index";
import { UserOutlined } from "@ant-design/icons";
import { getStorage } from "~/utils/helper";

const GroupsPageAdmin = (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search);
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(0);
    const [perPage, setPerPage] = React.useState(PER_PAGE);

    const [setSubmit, setClear, setGroup, createNewGroup, editData, setEdit] =
        useGroupStore(
            (state) => [
                state.setSubmit,
                state.setClear,
                state.setGroup,
                state.createNewGroup,
                state.editData,
                state.setEdit,
            ],
            shallow
        );

    const mutationGroup = useMutation(createNewGroup, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                queryClient.invalidateQueries("groups");
                setClear(true);
                setGroup(false);
                setEdit(null);
                if (data?.data === "created") {
                    message.success("New group successfully created!");
                }
                if (data?.data === "updated") {
                    message.success("Group updated successfully!");
                }
            }
        },
    });

    const onShowSizeChange = (current, pageSize) => {
        setPerPage(pageSize);
    };

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    const { isLoading, data: groups, isFetching } = useGroup(page, perPage);

    const viewDetails = (details) => {
        history.push(
            `/admin/thesis/details?id=${details?.id}&college_id=${
                params?.id
            }&key=${btoa(details?.id)}`
        );
    };

    const role = getStorage("userRole");
    const columnsGroups = [
        {
            title: "Group ID",
            width: 150,
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Group Name",
            dataIndex: "name",
            key: "name",
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
                                    <GroupsAvatar  key={i} item={item} team_lead={data?.team_lead} DIR_LOCATION={DIR_LOCATION.profile}  />
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
                    {role === "admin" && (
                        <Space>
                        <Tooltip title="edit">
                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setGroup(true);
                                    setEdit(value?.data);
                                }}
                            />
                        </Tooltip>
                    </Space>
                    )}
                </Space>
            ),
        },
    ];

    let list_groups = [];
    let list_groups_array = Array.isArray(groups?.groups) ? groups?.groups : [];
    if (!isLoading) {
        for (let index = 0; index < list_groups_array.length; index++) {
            list_groups.push({
                key: index,
                id: list_groups_array[index].id,
                name: list_groups_array[index].group_name,
                proponents: list_groups_array[index],
                data: list_groups_array[index],
            });
        }
    }

    return (
        <Layout breadcrumb={Breadcrumb.Group()}>
            <HeaderTitle title="Group Page" />
            <div className="tabled">
                <Card
                    title="Group List"
                    bordered={false}
                    className="card-table"
                >
                    <div className="table-responsive">
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columnsGroups}
                            dataSource={list_groups}
                            className="ant-border-space"
                        />
                    </div>
                    <div className="pagination-table shadow-none">
                        {!isLoading && (
                            <Pagination
                                defaultCurrent={1}
                                total={groups?.total || 0}
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
            <FormGroups
                submitForm={(params) => {
                    mutationGroup.mutate({
                        id: editData?.id || null,
                        group_name: params.group_name,
                        students: params.students,
                        faculty_id: params.faculty_id,
                    });
                    setSubmit(true);
                }}
            />
            {role === "admin" && (
                <FloatingButton
                    label="Create New Group"
                    onClick={() => setGroup(true)}
                />
            )}
        </Layout>
    );
};

export default React.memo(GroupsPageAdmin);
