import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {
    Pagination,
    Table,
    Tooltip,
    Button,
    message,
    Space,
    Card,
    Input,
} from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { FloatingButton, Layout, HeaderTitle, Breadcrumb } from "~/components";
import { useCollege } from "~/hooks";
import { useCollegeStore } from "~/states/collegeState";
import { FormCollege } from "./index";
import { ERROR_MESSAGE } from "~/utils/constant";

const { Search } = Input;

const CollegePage = () => {
    const history = useHistory();
    const queryClient = useQueryClient();
    const [
        page,
        setPage,
        setVisible,
        createNewCollege,
        setEdit,
        editData,
        setSubmit,
        perPage,
        setClear,
        search,
        setSearch,
    ] = useCollegeStore(
        (state) => [
            state.page,
            state.setPage,
            state.setVisible,
            state.createNewCollege,
            state.setEdit,
            state.editData,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.search,
            state.setSearch,
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useCollege(page, perPage, search);

    const mutation = useMutation(createNewCollege, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("colleges");
                queryClient.invalidateQueries("use-college-list");
                setClear(true);
                setVisible(false);
                setEdit(null);
                if (data.data === "created") {
                    message.success("New College successfully created!");
                }
                if (data.data === "updated") {
                    message.success("College updated successfully!");
                }
            }
        },
    });

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    const columns = [
        {
            title: "College ID",
            dataIndex: "id",
            key: "id",
            width: "150px",
        },
        {
            title: "College Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            align: "center",
            render: (value) => (
                <Space>
                    <Tooltip title="edit">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setVisible(true);
                                setEdit(value?.data);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    let list = [];
    let list_array = Array.isArray(data?.colleges) ? data?.colleges : [];
    if (!isLoading) {
        for (let index = 0; index < list_array.length; index++) {
            list.push({
                key: index,
                id: list_array[index].id,
                name: list_array[index].college_name,
                data: list_array[index],
            });
        }
    }

    const onSearch = (value) => {
        setSearch(value);
        queryClient.invalidateQueries("colleges");
    };

    return (
        <Layout breadcrumb={Breadcrumb.College()}>
            <HeaderTitle title="College Page" />
            <div className="tabled">
                <Card
                    title="College List"
                    bordered={false}
                    className="card-table"
                    extra={
                        <Search
                            placeholder="Search"
                            allowClear
                            onSearch={onSearch}
                        />
                    }
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
                                defaultCurrent={page + 1}
                                total={data?.total || 0}
                                pageSize={perPage}
                                showSizeChanger={false}
                                onShowSizeChange={onShowSizeChange}
                                onChange={onChange}
                            />
                        )}
                    </div>
                </Card>
                <FloatingButton
                    label="Create New College"
                    icon={<PlusOutlined />}
                    onClick={() => setVisible(true)}
                />
                <FormCollege
                    submitForm={(params) => {
                        mutation.mutate({
                            college_name: params.college_name,
                            id: editData?.id || null,
                        });
                        setSubmit(true);
                    }}
                />
            </div>
        </Layout>
    );
};

export default React.memo(CollegePage);
