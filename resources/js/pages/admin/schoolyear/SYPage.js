import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Tooltip, Button, Card, message } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import shallow from "zustand/shallow";
import { FloatingButton, Layout, HeaderTitle, Breadcrumb } from "~/components";
import { useSchoolYear } from "~/hooks";
import { useSchoolYearStore } from "~/states/schoolYearState";
import { ERROR_MESSAGE } from "~/utils/constant";
import { FormAddSY } from "./index";

const SYPage = () => {
    const queryClient = useQueryClient();
    const [
        setCreateSY,
        createNewSY,
        editSY,
        setEdit,
        setSubmit,
        perPage,
        setClear,
    ] = useSchoolYearStore(
        (state) => [
            state.setCreateSY,
            state.createNewSY,
            state.editSY,
            state.setEdit,
            state.setSubmit,
            state.perPage,
            state.setClear,
        ],
        shallow
    );

    const { isLoading, data: schoolyear, isFetching } = useSchoolYear();

    const mutation = useMutation(createNewSY, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data.data === "exist") {
                message.error("School Year exists.");
            } else if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                setClear(true);
                setCreateSY(false);
                setEdit(null);
                queryClient.invalidateQueries("schoolyear");
                if (data.data != "updated") {
                    message.success("New School Year successfully created!");
                }
                if (data.data === "updated") {
                    message.success("School Year updated successfully!");
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
            title: "Year",
            dataIndex: "schoolYear",
            key: "year",
            render: (value, index) => <>{value}</>,
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            align: 'center',
            render: (value) => (
                <Tooltip title="edit">
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCreateSY(true);
                            setEdit(value?.data);
                            console.log(editSY);
                        }}
                    />
                </Tooltip>
            ),
        },
    ];

    let year_list = [];
    let year_array = Array.isArray(schoolyear) ? schoolyear : [];
    if (!isLoading) {
        for (let index = 0; index < year_array.length; index++) {
            year_list.push({
                key: index,
                id: year_array[index].id,
                year: `${year_array[index].year}`,
                year2: `${year_array[index].year2}`,
                schoolYear: `${year_array[index].year} - ${year_array[index].year2}`,
                data: year_array[index],
            });
        }
    }
    
    return (
        <Layout breadcrumb={Breadcrumb.SY()}>
            <HeaderTitle title="School Year Page" />
            <div className="tabled">
                <Card
                    title="School Year List"
                    bordered={false}
                    className="card-table"
                >
                    <div className="table-responsive">
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columns}
                            dataSource={year_list}
                            className="ant-border-space"
                        />
                    </div>
                </Card>
                <FloatingButton
                    label="Create New School Year"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateSY(true)}
                />
                <FormAddSY
                    submitForm={(params) => {
                        mutation.mutate({
                            id: editSY?.id || null,
                            year_1: params.year_1,
                            year_2: params.year_2,
                        });
                        setSubmit(true);
                        setClear(true);
                    }}
                />
            </div>
        </Layout>
    );
};

export default React.memo(SYPage);
