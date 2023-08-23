import { EditOutlined, UserOutlined } from "@ant-design/icons";
import {
    Pagination,
    Table,
    Button,
    message,
    Card,
    Space,
    Avatar,
    Tooltip,
} from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import {
    FloatingButton,
    Layout,
    StudentFilter,
    HeaderTitle,
    Breadcrumb,
} from "~/components";
import { useStudents } from "~/hooks";
import { useStudentStore } from "~/states/studentState";
import { FormStudent } from "./index";
import { ERROR_MESSAGE, DIR_LOCATION } from "~/utils/constant";

const StudentPage = () => {
    const queryClient = useQueryClient();
    const [
        setCreateStudent,
        createNewStudent,
        setEdit,
        editStudent,
        setSubmit,
        perPage,
        setClear,
        image,
        setImage,
        filterBy,
        setFilterBy,
        page,
        setPage,
    ] = useStudentStore(
        (state) => [
            state.setCreateStudent,
            state.createNewStudent,
            state.setEdit,
            state.editStudent,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.image,
            state.setImage,
            state.filterBy,
            state.setFilterBy,
            state.page,
            state.setPage,
        ],
        shallow
    );

    const { isLoading, data, isFetching } = useStudents(
        page,
        perPage,
        filterBy
    );


    const mutation = useMutation(createNewStudent, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                queryClient.invalidateQueries("students");
                setClear(true);
                setCreateStudent(false);
                if (data?.data === "created") {
                    message.success("New student successfully created!");
                }
                if (data?.data === "updated") {
                    message.success("Student updated successfully!");
                }
                return;
            }
        },
    });

    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    const clearFilter = () => {
        setFilterBy(null)
    }

    const columns = [
        {
            title: "Student ID",
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
            title: "Depetment",
            dataIndex: "department",
            key: "department",
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
    let student_array = Array.isArray(data?.students) ? data?.students : [];
    if (!isLoading) {
        for (let index = 0; index < student_array.length; index++) {
            student_list.push({
                key: index,
                id: `${student_array[index].id}`,
                name: student_array[index],
                email: student_array[index]?.email,
                phone: student_array[index]?.phone,
                department: student_array[index]?.dept_name,
                data: student_array[index],
            });
        }
    }

    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Student Page" />
            <div className="tabled">
                <Card
                    title="Student List"
                    extra={
                        <StudentFilter
                            submitForm={(params) => {
                                setFilterBy(params);
                                queryClient.invalidateQueries("students");
                            }}
                            clearFilter={() => clearFilter()}
                            loading={isFetching}
                        />
                    }
                    bordered={false}
                    className="card-table"
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
                label="Create New Student"
                onClick={() => {
                    setCreateStudent(true);
                    setImage(null);
                }}
            />
            <FormStudent
                submitForm={(params) => {
                    params.id = editStudent?.id || null;
                    params.user_id = editStudent?.user_id;
                    params.image = image;
                    mutation.mutate(params);
                }}
            />
        </Layout>
    );
};

export default React.memo(StudentPage);
