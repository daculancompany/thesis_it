import { PlusOutlined, EditOutlined, EyeOutlined, CloudUploadOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { useParams, useHistory } from "react-router-dom";
import { Pagination, Table, Tooltip, Button, message, Space, Card, Avatar } from "antd";
import React from "react";
import shallow from "zustand/shallow";
import { Layout, FloatingButton } from "~/components";
import { useGroupStore } from "~/states/groupState";
import { useGroup } from "~/hooks";
import { ERROR_MESSAGE, PER_PAGE, DIR_LOCATION } from '~/utils/constant'
import { useMutation, useQueryClient } from "react-query";
import { FormGroups } from './index';
import {  UserOutlined   } from "@ant-design/icons";
import { setCookie, getCookie } from "~/utils/helper";

const GroupsPage= (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search);
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(0);
    const [perPage, setPerPage] = React.useState(PER_PAGE);

    const [
        setSubmit,
        setClear,
        setGroup,
        createNewGroup,
        editData,
        setEdit,
    ] = useGroupStore(
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
                message.error(ERROR_MESSAGE);
            }
            else {
                queryClient.invalidateQueries("groups");
                setClear(true);
                setGroup(false);
                message.success("New group successfully created!");
            }
        },
    });

    const onShowSizeChange = (current, pageSize) => {
        setPerPage(pageSize);
    };

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };


    const {
        isLoading,
        data: groups,
        isFetching,
    } = useGroup(page, perPage);


    const viewDetails = (details) => {
        history.push(`/admin/thesis/details?id=${details?.id}&college_id=${params?.id}&key=${btoa(details?.id)}`);
    }

    const role = getCookie("userRole");
    const columnsGroups = [
        {
            title: "Group Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Proponents",
            dataIndex: "proponents",
            key: "proponents",
            render: (students) => ( 
                <Space>
                    <Avatar.Group>
                        {Array.isArray(students) && students.map((item,i)=>{
                            return(
                                <Tooltip title={`${item.fname} ${item.mname}${item.mname ? '.' : ''} ${item.lname}`} placement="top" key={i}>
                                    {item?.image ? <Avatar className="avatar-content" size="small" src={`${DIR_LOCATION.profile}${item?.image}`} icon={<UserOutlined />} /> : <Avatar className="avatar-content" size="small" icon={<UserOutlined />} />}
                                </Tooltip>
                                )
                        })}  
                    </Avatar.Group>
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    {role === "admin" && (
                            <Button type="link" className="tag-primary" icon={<EditOutlined />}   onClick={() => {setGroup(true);setEdit(value?.data);}}> UPDATE</Button>
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
                name: list_groups_array[index].group_name,
                proponents: list_groups_array[index]?.students,
                data: list_groups_array[index],
            });
        }
    }

    return (
        <Layout>
            <div className="tabled">
                <Card title="Group List"
                    bordered={false}
                    className="criclebox tablespace mb-24"
                >
                    <Table
                        loading={isFetching}
                        pagination={false}
                        columns={columnsGroups}
                        dataSource={list_groups}
                        className="ant-border-space"
                    />
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
            {/* <FormGroups
                submitForm={(params) => {
                   
                  
                    mutationGroup.mutate(params);
                    setSubmit(true);
                }}
                 
            /> */}
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
                    label="Add Group"
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    shape="round"
                    onClick={() => setGroup(true)}
                />
            )}
        </Layout>
    );
};

export default React.memo(GroupsPage);
