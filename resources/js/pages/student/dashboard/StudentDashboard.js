import {
    EditOutlined,
    CloudUploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import queryString from "query-string";
import { seurityRoutes } from "~/utils/helper";
import { useHistory } from "react-router-dom";
import {
    Table,
    Tooltip,
    Button,
    message,
    Space,
    Card,
    Col,
    Row,
    Empty,
    Avatar,
    Descriptions,
    Popconfirm,
    Spin,
    Tabs,
    Statistic,
    Popover
} from "antd";
import React from "react";
import shallow from "zustand/shallow";
import {  FormPanel, Layout } from "~/components";
//import { useFacultiesStore } from "~/states/facultiesState";
import { useThesisStore } from "~/states/thesisState";
import { ERROR_MESSAGE, DIR_LOCATION } from "~/utils/constant";
import { useMutation, useQueryClient } from "react-query";
import { useThesisDetails } from "~/hooks";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const { Meta } = Card;

//https://ant-cra.cremawork.com/apps/wall
const StudentDashboard = (props) => {
    const history = useHistory();
    const role = secureLocalStorage.getItem("userRole");
    let params = queryString.parse(props.location.search);
    if (params?.id) {
        seurityRoutes(params);
    }

    const {
        isLoading,
        data: thesis,
        isFetching,
    } = useThesisDetails(params?.id || 0);
console.log('thesis',thesis)
    const queryClient = useQueryClient();

    const [
        setCreateStudent,
        createNewStudent,
        setEdit,
        editStudent,
        setSubmit,
        perPage,
        setClear,
        setTitle,
        createThesisTitle,
        setThesisDetails,
        thesisDetail,
        setUploadDoc,
        uploadFile,
        setIsDetails,
        setThesisID,
        setDocId,
        setFormPanel,
        setScheduleDetails,
        scheduleDetails,
        updatePanel,
        isSchedule,
        setIsSchedule,
        group,
        setGroup,
        updateThesisGroup,
    ] = useThesisStore(
        (state) => [
            state.setCreateStudent,
            state.createNewStudent,
            state.setEdit,
            state.editStudent,
            state.setSubmit,
            state.perPage,
            state.setClear,
            state.setTitle,
            state.createThesisTitle,
            state.setThesisDetails,
            state.thesisDetail,
            state.setUploadDoc,
            state.uploadFile,
            state.setIsDetails,
            state.setThesisID,
            state.setDocId,
            state.setFormPanel,
            state.setScheduleDetails,
            state.scheduleDetails,
            state.updatePanel,
            state.isSchedule,
            state.setIsSchedule,
            state.group,
            state.setGroup,
            state.updateThesisGroup,
        ],
        shallow
    );

    const mutationThesis = useMutation(uploadFile, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("thesisDetailsQuery");
                setClear(true);
                setUploadDoc(false);
                message.success("New studfent successfully created!");
            }
        },
    });

    const mutationPanel = useMutation(updatePanel, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("thesisDetailsQuery");
                queryClient.invalidateQueries("faculties_dashboard_rating");
                setClear(true);
                setFormPanel(false);
                setScheduleDetails(null);
                message.success("Panelist successfully updated!");
            }
        },
    });

    const mutationAddTitle = useMutation(createThesisTitle, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(data?.message ? data?.message : ERROR_MESSAGE);
                return;
            } else {
                queryClient.invalidateQueries("thesisDetailsQuery");
                setClear(true);
                setTitle(false);
                setThesisDetails(null);
                message.success("Thesis title successfully updated!");
                return;
            }
        },
    });

    const mutationThesisGroup = useMutation(updateThesisGroup, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("thesisDetailsQuery");
                setClear(true);
                setGroup(false);
                message.success("Thesis group successfully updated!");
            }
        },
    });

    const viewDetails = (details) => {
        setDocId(details?.id);
        history.push(
            `/admin/thesis-doc-details?id=${details?.id}&key=${btoa(
                details?.id
            )}`
        );
    };

    const deleteDocument = (doc) => {};
    const columnsDocs = [
        {
            title: "Docment ID",
            dataIndex: "doc_id",
            key: "doc_id",
        },
        {
            title: "Date Uploaded",
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            title: "Uploded",
            key: "uploaded",
            dataIndex: "uploaded",
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "Document Name",
            key: "document_name",
            dataIndex: "document_name",
        },
        {
            title: "Date Comment",
            key: "date_comment",
            dataIndex: "date_comment",
        },

        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (
                <Space>
                    <Button
                        onClick={() => {
                            viewDetails(value?.data);
                        }}
                        type="link"
                    >
                        VIEW
                    </Button>
                    {value?.date_comment && (
                        <Popconfirm
                            title="Are you sure to delete this document?"
                            onConfirm={() => {
                                deleteDocument(value?.data);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger>
                                DELETE
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    let list_docs = [];
    let list_thesis_docs = Array.isArray(thesis?.docs) ? thesis?.docs : [];
    if (!isLoading) {
        for (let index = 0; index < list_thesis_docs.length; index++) {
            list_docs.push({
                key: index,
                doc_id: list_thesis_docs[index]?.id,
                created_at: moment(list_thesis_docs[index]?.updated_at).format(
                    "lll"
                ),
                uploaded:
                    list_thesis_docs[index].student?.fname +
                    " " +
                    list_thesis_docs[index].student?.lname,
                notes:
                    list_thesis_docs[index]?.notes !== "undefined"
                        ? list_thesis_docs[index]?.notes
                        : "",
                document: list_thesis_docs[index]?.document,
                document_name: list_thesis_docs[index].document_name,
                date_comment: list_thesis_docs[index]?.date_comment
                    ? moment(list_thesis_docs[index].date_comment).format("lll")
                    : "No comments yet",
                data: list_thesis_docs[index],
            });
        }
    }

    const schedule_columns = [
        {
            title: "Schedule ID",
            width: 150,
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Action",
            key: "action",
            width: "150px",
            render: (value) => (
                <Space>
                    <Button
                        type="link"
                        className="tag-primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCreateStudent(true);
                            setEdit(value?.data);
                        }}
                    >
                        {" "}
                        DETAILS
                    </Button>
                </Space>
            ),
        },
    ];

    // let schedule_list = [];
    let schedule_array = Array.isArray(thesis?.schedules)
        ? thesis?.schedules
        : [];
    // if (!isLoading) {
    //     for (let index = 0; index < schedule_array.length; index++) {
    //         schedule_list.push({
    //             key: index,
    //             id: schedule_array[index].id,
    //             date: `${moment(`${schedule_array[index].start_date}`).format('LL')} - ${moment(`${schedule_array[index].end_date}`).format('LL')}`,
    //             data: schedule_array[index],
    //         });
    //     }
    // }

    const viewDocument = (document) => {
        history.push(
            `/admin/document?details=${btoa(document?.document?.document)}`
        );
    };

    return (
        <Layout>
            <div style={{ marginTop: 60 }}></div>
            {/* <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
            <div style={{ marginTop: 20 }}></div> */}
            <Spin spinning={isFetching}>
                {!thesis?.thesis && !isFetching && (
                    <>
                        <Empty description="No thesis assigned" />
                    </>
                )}
                {thesis?.thesis && !isFetching && (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col lg={6} sm={24}>
                                <Card
                                    cover={
                                        <img
                                            alt="example"
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/University_of_Science_and_Technology_of_Southern_Philippines_Main_Campus_%28Original_Work%29.jpg/1920px-University_of_Science_and_Technology_of_Southern_Philippines_Main_Campus_%28Original_Work%29.jpg"
                                        />
                                    }
                                    className="student-avatar-wrapper"
                                >
                                    <div>
                                        <div className="student-avatar">
                                            {/* <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGQHpgtS41XuGtJXYysNDCWielI5vbs11ajHg4OiE&s" /> */}
                                            
                                            {thesis?.curr_user?.image ? (
                                                <Avatar
                                                    className="avatar-content pointer-cursor"
                                                    size="small"
                                                    src={`${DIR_LOCATION.profile}${thesis?.curr_user?.image}`}
                                                    icon={<UserOutlined />}

                                                />
                                            ) : (
                                                    <Avatar
                                                        className="avatar-content pointer-cursor"
                                                        size={80}
                                                        icon={<UserOutlined />}
                                                        src={`${DIR_LOCATION.profile}${'no-profile.png'}`}
                                                    />
                                            )}
                                                       
                                        </div>
                                    </div>
                                    <Meta
                                        title="Niel Daculan"
                                        description="niel.daculan@gmail.com"
                                    />
                                </Card>
                                <Card
                                    title="Thesis Info"
                                    className="top-spacer"
                                    bordered={false}
                                >
                                    <div className="thesis-info">
                                        <p>Title</p>
                                        <h6>
                                            {thesis?.thesis?.thesis_name ||
                                                "No Title Yet"}
                                        </h6>
                                    </div>
                                    <div className="thesis-info">
                                        <p>Group Name</p>
                                        <h6>
                                            {thesis?.group?.group_name ||
                                                "Not Set"}
                                        </h6>
                                    </div>
                                    <div className="thesis-info">
                                        <p>Proponents</p>
                                        <Avatar.Group>
                                            {Array.isArray(thesis?.students) &&
                                                thesis?.students.map((obj2, i2) => (
                                                    <Tooltip
                                                        // color={`${
                                                        //     parseInt(getCookie("userID")) ===
                                                        //     obj2?.user_id
                                                        //         ? "green"
                                                        //         : "blue"
                                                        // }`}
                                                    >
                                                        <Popover
                                                            title={`${obj2?.fname} ${obj2?.lname}`}
                                                            trigger="hover"
                                                            key={i2}
                                                        >
                                                            {obj2?.image ? (
                                                                <Avatar
                                                                    className="avatar-content pointer-cursor"
                                                                    size="small"
                                                                    src={`${DIR_LOCATION.profile}${obj2?.image}`}
                                                                    icon={<UserOutlined />}
                                                                    
                                                                />
                                                            ) : (
                                                                <Avatar
                                                                    className="avatar-content pointer-cursor"
                                                                    size="small"
                                                                    icon={<UserOutlined />}
                                                                />
                                                            )}
                                                        </Popover>
                                                    </Tooltip>
                                            ))}
                                        </Avatar.Group>
                                    </div>
                                    <div className="thesis-info">
                                        <p>Category</p>
                                        <h6>
                                            {thesis?.thesis?.stage?.name ||
                                                "Not Set"}
                                        </h6>
                                    </div>
                                </Card>
                            </Col>
                            <Col lg={18} sm={24}>
                                <Card
                                    title="Recent Documents"
                                    bordered={false}
                                >
                                    <div className="table-responsive">
                                        <Table
                                            columns={columnsDocs}
                                            dataSource={list_docs}
                                            pagination={false}
                                            className="ant-border-space"
                                            loading={isLoading}
                                            locale={{ emptyText: <Empty /> }}
                                        />
                                    </div>
                                </Card>
                                <Card
                                    bordered={false}
                                    title="Upcomming Schedules"
                                    className="top-spacer"
                                >
                                    {Array.isArray(schedule_array) &&
                                        schedule_array.map((obj, i) => {
                                            return (
                                                <div key={i}>
                                                    <Card className="top-spacer">
                                                        {" "}
                                                        <div className="col-info">
                                                            <Descriptions
                                                                title={`${moment(
                                                                    `${obj.start_date}`
                                                                ).format(
                                                                    "LL"
                                                                )} - ${moment(
                                                                    `${obj.end_date}`
                                                                ).format(
                                                                    "LL"
                                                                )}`}
                                                            >
                                                                <Descriptions.Item
                                                                    label="Schedule ID"
                                                                    span={3}
                                                                >
                                                                    {obj?.id}
                                                                </Descriptions.Item>
                                                                <Descriptions.Item
                                                                    label="Schedule Category"
                                                                    span={3}
                                                                >
                                                                    {
                                                                        obj
                                                                            ?.category
                                                                            ?.name
                                                                    }
                                                                </Descriptions.Item>
                                                                <Descriptions.Item
                                                                    label="Date  & Time"
                                                                    span={3}
                                                                >
                                                                    {
                                                                        obj?.date_sched
                                                                    }
                                                                    ({obj?.time}
                                                                    )
                                                                </Descriptions.Item>

                                                                <Descriptions.Item
                                                                    label="Panelist"
                                                                    span={3}
                                                                >
                                                                    {obj
                                                                        ?.panelist
                                                                        ?.length ===
                                                                        0 &&
                                                                        "No assign yet"}
                                                                    <Avatar.Group>
                                                                        {Array.isArray(
                                                                            obj?.panelist
                                                                        ) &&
                                                                            obj?.panelist.map(
                                                                                (
                                                                                    obj2,
                                                                                    i2
                                                                                ) => (
                                                                                    <Tooltip
                                                                                        title={`${obj2?.fname} ${obj2?.lname}`}
                                                                                        placement="top"
                                                                                        key={
                                                                                            i2
                                                                                        }
                                                                                    >
                                                                                        {obj2?.image ? (
                                                                                            <Avatar
                                                                                                className="avatar-content"
                                                                                                size="small"
                                                                                                src={`${DIR_LOCATION.profile}${obj2?.image}`}
                                                                                                icon={
                                                                                                    <UserOutlined />
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <Avatar
                                                                                                className="avatar-content"
                                                                                                size="small"
                                                                                                icon={
                                                                                                    <UserOutlined />
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                    </Tooltip>
                                                                                )
                                                                            )}
                                                                    </Avatar.Group>
                                                                    {role ===
                                                                        "faculty" && (
                                                                        <Button
                                                                            type="link"
                                                                            className="tag-primary"
                                                                            icon={
                                                                                <EditOutlined />
                                                                            }
                                                                            onClick={() => {
                                                                                setFormPanel(
                                                                                    true
                                                                                );
                                                                                setScheduleDetails(
                                                                                    obj
                                                                                );
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            EDIT
                                                                            PANEL
                                                                        </Button>
                                                                    )}
                                                                </Descriptions.Item>
                                                                <Descriptions.Item
                                                                    label="Document"
                                                                    span={3}
                                                                >
                                                                    {obj?.documents ? (
                                                                        <Tooltip
                                                                            color="blue"
                                                                            title="View Document"
                                                                        >
                                                                            <Button
                                                                                type="link"
                                                                                onClick={() =>
                                                                                    viewDocument(
                                                                                        obj?.documents
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    obj
                                                                                        ?.documents
                                                                                        ?.document
                                                                                        ?.document_name
                                                                                }
                                                                            </Button>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        " No document uploaded"
                                                                    )}
                                                                </Descriptions.Item>
                                                                {obj?.documents && (
                                                                    <Descriptions.Item
                                                                        label="Notes"
                                                                        span={3}
                                                                    >
                                                                        {
                                                                            obj
                                                                                ?.documents
                                                                                ?.document
                                                                                ?.notes
                                                                        }
                                                                    </Descriptions.Item>
                                                                )}
                                                            </Descriptions>
                                                        </div>
                                                    </Card>
                                                </div>
                                            );
                                        })}
                                    {Array.isArray(schedule_array) &&
                                        schedule_array.length === 0 && (
                                            <Empty />
                                        )}
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Spin>
        </Layout>
    );
};

export default React.memo(StudentDashboard);
