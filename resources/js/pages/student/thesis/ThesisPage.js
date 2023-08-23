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
    Badge,
    FloatButton,
    Timeline,
    Typography
} from "antd";
import React from "react";
import shallow from "zustand/shallow";
import { FormPanel, Layout, HeaderTitle, Breadcrumb, GroupsAvatar } from "~/components";
//import { useFacultiesStore } from "~/states/facultiesState";
import { useThesisStore } from "~/states/thesisState";
//import { useThesisStore } from "~/states/thesisState";
import { useThesisFaculty, useThesisStudent } from "~/hooks";
import { ERROR_MESSAGE, DIR_LOCATION } from "~/utils/constant";
import { useMutation, useQueryClient } from "react-query";
import { FormDocUpload, FormGroups, FormAddTitle } from "./index";
import { useThesisDetails } from "~/hooks";
import moment from "moment";
import { getCookie } from "~/utils/helper";
import secureLocalStorage from "react-secure-storage";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFacultyList } from "~/hooks";

const text = (
    <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal. Known for its loyalty and
        faithfulness, it can be found as a welcome guest in many households
        across the world.
    </p>
);

const { Title, Text } = Typography;

//https://ant-cra.cremawork.com/apps/wall
const ThesisPage = (props) => {
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

    const {
        data: faculty_list 
    } = useFacultyList();

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
        setFaculties,
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
            state.setFaculties
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
                queryClient.invalidateQueries("faculties_dashboard");
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
                queryClient.invalidateQueries("group_list");
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
            title: "Uploaded",
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
                    <Tooltip title="view document">
                        <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                viewDetails(value?.data);
                            }}
                        />
                    </Tooltip>
                    {value?.date_comment && (
                        <Popconfirm
                            title="Are you sure to delete this document?"
                            onConfirm={() => {
                                deleteDocument(value?.data);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="delete document">
                                <Button
                                    shape="circle"
                                    icon={<DeleteOutlined />}
            
                                />
                            </Tooltip>
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

// console.log(list_thesis_docs)
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

    let schedule_array = Array.isArray(thesis?.schedules)
        ? thesis?.schedules
        : [];

    const viewDocument = (document) => {
        history.push(
            `/admin/document?details=${btoa(document?.document?.document)}`
        );
    };
console.log('thesis',thesis)
console.log('schedule_array',schedule_array)
    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="Thesis Page" />
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
                                <Badge.Ribbon
                                    text={
                                        thesis?.thesis?.stage?.name || "Not Set"
                                    }
                                    color="#f50"
                                >
                                    <Card title="Thesis Info" bordered={false}>
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
                                                {Array.isArray(
                                                    thesis?.students
                                                ) &&
                                                    thesis?.students.map(
                                                        (item, i) => {
                                                            return (
                                                                <GroupsAvatar  key={i} item={item} team_lead={thesis?.group?.team_lead} DIR_LOCATION={DIR_LOCATION.profile}  />
                                                            );
                                                        }
                                                    )}
                                            </Avatar.Group>
                                        </div>
                                        <div className="thesis-info last-part">
                                            <p>Category</p>
                                            <h6>
                                                <Badge
                                                    color="#f50"
                                                    text={
                                                        thesis?.thesis?.stage
                                                            ?.name || "Not Set"
                                                    }
                                                />
                                            </h6>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                                <Card
                                    title="Thesis Logs"
                                    bordered={false}
                                    className="top-spacer"
                                >
                                     <Timeline >
                                        {Array.isArray(thesis?.thesis_logs) &&
                                            thesis?.thesis_logs.map((obj, i) => (
                                                <Timeline.Item>
                                                    <Text>{obj.log} {moment(obj.created_at).format('YYYY-MM-DD')}</Text>
                                                </Timeline.Item>
                                         ))}
                                    </Timeline>
                                </Card>
                            </Col>
                            <Col lg={18} sm={24}>
                                <Card
                                    title="Uploaded Documents"
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
                                                                    {/* {role ==="faculty" && thesis?.thesis.faculty_id==thesis?.user?.id && ( */}
                                                                    {role ==="faculty" && (
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
                                                                            {''}
                                                                            EDIT PANEL
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
                                                                            title="view document"
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
                                                    {role === "student" &&
                                                        !obj?.documents && (
                                                            <div className="card-footer mt-4">
                                                                <Button
                                                                    type="dashed"
                                                                    className="ant-full-box"
                                                                    onClick={() => {
                                                                        setUploadDoc(
                                                                            true
                                                                        );
                                                                        setIsSchedule(
                                                                            schedule_array[0]
                                                                                ?.id
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        <CloudUploadOutlined />
                                                                    }{" "}
                                                                    Upload
                                                                    Document
                                                                </Button>
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    {Array.isArray(schedule_array) &&
                                        schedule_array.length === 0 && (
                                            <Empty />
                                        )}
                                </Card>
                                {/* <Card
                                    className="top-spacer"
                                    title="Group Comments"
                                    bordered={false}
                                >
                                    <Empty />
                                </Card> */}
                            </Col>
                        </Row>
                    </>
                )}
            </Spin>
            <FormDocUpload
                submitForm={(params) => {
                    mutationThesis.mutate({
                        id: thesis?.thesis?.id,
                        document: params?.document?.fileList[0]?.originFileObj,
                        notes: params?.notes,
                        isSchedule: isSchedule,
                    });
                    setSubmit(true);
                }}
            />
            <FormGroups
                submitForm={(params) => {
                    (params.thesis_id = thesis?.thesis?.id),
                        mutationThesisGroup.mutate(params);
                    setSubmit(true);
                }}
            />
            <FormAddTitle
                submitForm={(params) => {
                    (params.thesis_id = thesis?.thesis?.id),
                        mutationAddTitle.mutate(params);
                    setSubmit(true);
                }}
            />
            <FormPanel
                submitForm={(params) => {
                    (params.defense_sched_details_id =
                        scheduleDetails?.defense_sched_details_id),
                        mutationPanel.mutate(params);
                    setSubmit(true);
                }}
            />
            <FloatButton.Group shape="square">
                <Tooltip title="edit thesis title" placement="left">
                    <FloatButton
                        icon={<EditOutlined />}
                        onClick={() => {
                            setTitle(true);
                            setThesisDetails(thesis);
                        }}
                    />
                </Tooltip>
                <Tooltip title="edit group name" placement="left">
                    <FloatButton
                        icon={<EditOutlined />}
                        onClick={() => {
                            setGroup(true);
                            setThesisDetails(thesis);
                        }}
                    />
                </Tooltip>
                {role === "student" && (
                    <Tooltip title="upload new document" placement="left">
                        <FloatButton
                            icon={<CloudUploadOutlined />}
                            onClick={() => {
                                setUploadDoc(true);
                            }}
                        />
                    </Tooltip>
                )}
            </FloatButton.Group>
        </Layout>
    );
};

export default React.memo(ThesisPage);
