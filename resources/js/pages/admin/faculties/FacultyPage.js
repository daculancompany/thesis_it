import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
    Pagination,
    Table,
    Space,
    Button,
    message,
    Card,
    Avatar,
    Tooltip,
    Input,
} from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import {shallow} from "zustand/shallow";
import { FloatingButton, Layout, HeaderTitle, Breadcrumb } from "~/components";
import { useFaculties } from "~/hooks";
import { useFacultiesStore } from "~/states/facultiesState";
import { FormFaculty } from "./index";
import { ERROR_MESSAGE, DIR_LOCATION } from "~/utils/constant";

const { Search } = Input;

const FacultyPage = () => {
    const queryClient = useQueryClient();
    const [
        setCreateStudent,
        createNewFaculty,
        setEdit,
        editFaculty,
        setSubmit,
        perPage,
        setClear,
        image,
        search,
        setSearch,
        page,
        setPage,
    ] = useFacultiesStore(
        (state) => [
            state.setCreateStudent,
            state.createNewFaculty,
            state.setEdit,
            state.editFaculty,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.image,
            state.search,
            state.setSearch,
            state.page,
            state.setPage,
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useFaculties(page, perPage, search);

    const mutation = useMutation(createNewFaculty, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                queryClient.invalidateQueries("faculties");
                setClear(true);
                setCreateStudent(false);
                if (data?.data === "created") {
                    message.success("New faculty successfully created!");
                }
                if (data?.data === "updated") {
                    message.success("Faculty updated successfully!");
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
            title: "Faculty ID",
            width: 150,
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value) => (
                <Space>
                    {value?.image ? (
                        <Avatar
                            className="avatar-content"
                            size="small"
                            src={`${DIR_LOCATION.profile}${value?.image}`}
                            icon={<UserOutlined />}
                        />
                    ) : (
                        <Avatar
                            className="avatar-content"
                            size="small"
                            icon={<UserOutlined />}
                        />
                    )}
                    {`${value.fname} ${value.mname}${value.mname ? "." : ""} ${
                        value.lname
                    }`}
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },

        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
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
                                setCreateStudent(true);
                                setEdit(value?.data);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    let student_list = [];
    let student_array = Array.isArray(data?.faculties) ? data?.faculties : [];
    if (!isLoading) {
        for (let index = 0; index < student_array.length; index++) {
            student_list.push({
                key: index,
                id: student_array[index].id,
                name: student_array[index],
                email: student_array[index].email,
                phone: student_array[index].phone,
                data: student_array[index],
            });
        }
    }

    const onSearch = (value) => {
        setSearch(value);
        queryClient.invalidateQueries("departments");
    };

    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Faculty Page" />
            <div className="tabled">
                <Card
                    title="Faculty list"
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
                            dataSource={student_list}
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
                                className="mt-5"
                            />
                        )}
                    </div>
                </Card>
            </div>
            <FloatingButton
                label="Create New Faculty"
                onClick={() => setCreateStudent(true)}
            />
            <FormFaculty
                submitForm={(params) => {
                    params.id = editFaculty?.id || null;
                    params.user_id = editFaculty?.user_id;
                    params.image = image;
                    mutation.mutate(params);
                    setSubmit(true);
                }}
            />
        </Layout>
    );
};

export default React.memo(FacultyPage);
