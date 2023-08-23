import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { useParams, useHistory } from "react-router-dom";
import { Pagination, Table, Tooltip, Button, message, Space, Card, Col, Row } from "antd";
import React from "react";
import shallow from "zustand/shallow";
import { Layout } from "~/components";
import { useCollegeStore } from "~/states/collegeState";
import { useDepartments, useThesis } from "~/hooks";
import { FormDepartment } from "./index";
import { ERROR_MESSAGE } from '~/utils/constant'
import { useMutation, useQueryClient } from "react-query";


const CollegeDetails = (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search);
    const queryClient = useQueryClient();
    const [
        setVisibleDepartment,
        createNewDepartment,
        setVisibleThesis,
        setSubmit,
        setClear,
        visibleThesis,
        createNewThesis,
    ] = useCollegeStore(
        (state) => [
            state.setVisibleDepartment,
            state.createNewDepartment,
            state.setVisibleThesis,
            state.setSubmit,
            state.setClear,
            state.visibleThesis,
            state.createNewThesis,
        ],
        shallow
    );


    const mutation = useMutation(createNewDepartment, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            }
            else {
                queryClient.invalidateQueries("departments");
                setClear(true);
                setVisibleDepartment(false);
                message.success("New studfent successfully created!");
            }
        },
    });

    const mutationThesis = useMutation(createNewThesis, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            }
            else {
                queryClient.invalidateQueries("thesis");
                setClear(true);
                setVisibleThesis(false);
                message.success("New studdent successfully created!");
            }
        },
    });

   

    const {
        isLoading,
        data: departments,
        isFetching,
    } = useDepartments(1);

    const {
        data: thesis,
    } = useThesis();

    const columns = [
        {
            title: "College Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    <Tooltip title="Edit" color="cyan">
                        <Button
                            type="dashed"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setVisible(true);
                                setEdit(value?.data);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View Details" color="purple">
                        <Button
                            type="dashed"
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

    const viewDetails = (details) => {
        history.push(`/admin/thesis/details?id=${details?.id}&college_id=${params?.id}&key=${btoa(details?.id)}`);
    }

    const columnsThesis = [
        {
            title: "Group",
            dataIndex: "group",
            key: "group",
        },
        {
            title: "Thesis Title",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    <Tooltip title="Edit" color="cyan">
                        <Button
                            type="dashed"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setVisible(true);
                                setEdit(value?.data);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="View Details" color="purple">
                        <Button
                            type="dashed"
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

    let list = [];
    let list_array = Array.isArray(departments) ? departments : [];
    if (!isLoading) {
        for (let index = 0; index < list_array.length; index++) {
            list.push({
                key: index,
                name: list_array[index].dept_name,
                data: list_array[index],
            });
        }
    }

    let list_thesis = [];
    let list_thesis_array = Array.isArray(thesis) ? thesis : [];
    if (!isLoading) {
        for (let index = 0; index < list_thesis_array.length; index++) {
            list_thesis.push({
                key: index,
                name: list_thesis_array[index].thesis_name,
                group: list_thesis_array[index].group_name,
                data: list_thesis_array[index],
            });
        }
    }

    return (
        <Layout>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Card title="Department" bordered={false} extra={<Button type="link" onClick={() => setVisibleDepartment(true)} >Create Department</Button>} className="card-nopadding" >
                        <Table
                            loading={isFetching}
                            pagination={false}
                            columns={columns}
                            dataSource={list}
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                    {/* <PDFView /> */}
                    <Card title="Recent Thesis" bordered={false} extra={<Button type="link" onClick={() => setVisibleThesis(true)} >Create Thesis</Button>} className="card-nopadding" >
                        <Table
                            // loading={isFetching}
                            pagination={false}
                            columns={columnsThesis}
                            dataSource={list_thesis}
                        />
                    </Card>
                </Col>
            </Row>
            <FormDepartment
                submitForm={(params) => {
                    mutation.mutate({
                        dept_name: params.dept_name,
                        college_id: 1,
                        //id: editData?.id || null,
                    });
                    setSubmit(true);
                }}
            />
            {/* <FormThesis
               submitForm={(params) => {
                mutationThesis.mutate(params);
            }}
            /> */}
        </Layout>
    );
};

export default React.memo(CollegeDetails);
