import {
    Pagination,
    Table,
    Button,
    message,
    Card,
    Space,
    Tooltip,
    Input,
} from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { FloatingButton, Layout, HeaderTitle, Breadcrumb } from "~/components";
import { useDepartments } from "~/hooks";
import { useDepartmentStore } from "~/states/departmentState";
import { FormDepartment } from "./index";
import { ERROR_MESSAGE } from "~/utils/constant";
import { EditOutlined } from "@ant-design/icons";

const { Search } = Input;

const DepartmentPage = () => {
    const queryClient = useQueryClient();
    const [
        page,
        setPage,
        setCreateDepartment,
        createNewDepartment,
        createDepartment,
        setEdit,
        editDepartment,
        setSubmit,
        perPage,
        setClear,
        isClear,
        search,
        setSearch,
    ] = useDepartmentStore(
        (state) => [
            state.page,
            state.setPage,
            state.setCreateDepartment,
            state.createNewDepartment,
            state.createDepartment,
            state.setEdit,
            state.editDepartment,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.isClear,
            state.search,
            state.setSearch,
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useDepartments(page, perPage, search);

    const mutation = useMutation(createNewDepartment, {
        onSuccess: (data) => {
            console.log(data?.data);
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                setClear(true);
                setCreateDepartment(false);
                setEdit(null);
                queryClient.invalidateQueries("departments");
                if (data?.data === "created") {
                    message.success("New Department successfully created!");
                }
                if (data?.data === "updated") {
                    message.success("Department updated successfully!");
                }
                return;
            }
        },
    });

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    const columns = [
        {
            title: "Department ID",
            dataIndex: "id",
            key: "id",
            width: "150px",
        },
        {
            title: "Department",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "College",
            dataIndex: "college_name",
            key: "college_name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    <Tooltip title="edit">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCreateDepartment(true);
                                setEdit(value?.data);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    let dept_list = [];
    let dept_array = Array.isArray(data?.departments) ? data?.departments : [];
    if (!isLoading) {
        for (let index = 0; index < dept_array.length; index++) {
            dept_list.push({
                key: index,
                id: dept_array[index].id,
                name: `${dept_array[index].dept_name}`,
                college_name: `${dept_array[index].college_name}`,
                data: dept_array[index],
            });
        }
    }

    const onSearch = (value) => {
        setSearch(value);
        queryClient.invalidateQueries("departments");
    };

    return (
        <Layout breadcrumb={Breadcrumb.Department()}>
            <HeaderTitle title="Department Page" />
            <div className="tabled">
                <Card
                    title="Department List"
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
                            dataSource={dept_list}
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
                    label="Create New Department"
                    onClick={() => setCreateDepartment(true)}
                />
                <FormDepartment
                    submitForm={(params) => {
                        mutation.mutate({
                            id: editDepartment?.id || null,
                            dept_name: params?.dept_name,
                            college_id: params?.college_id,
                        });
                        setSubmit(true);
                    }}
                />
            </div>
        </Layout>
    );
};

export default React.memo(DepartmentPage);
