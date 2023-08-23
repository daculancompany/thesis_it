import { PlusOutlined, EditOutlined, EyeOutlined, CloudUploadOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { useParams, useHistory } from "react-router-dom";
import { Pagination, Table, Tooltip, Button, message, Space, Card, Col, Row } from "antd";
import React from "react";
import shallow from "zustand/shallow";
import {  Layout } from "~/components";
import { useFacultiesStore } from "~/states/facultiesState";
import { useThesisFaculty } from "~/hooks";
import { ERROR_MESSAGE } from '~/utils/constant'
import { useMutation, useQueryClient } from "react-query";
import {  FormGroups } from './index';
 
const ThesisDetails = (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search); 
    const queryClient = useQueryClient();
    const [
        page,
        setPage,
        perPage,
        uploadDoc,
        setSubmit,
        setClear,
        setUploadDoc,
        uploadFile,
        details,
        setDetails,
        setGroup,
        updateGroup,
    ] = useFacultiesStore(
        (state) => [
            state.page,
            state.setPage,
            state.perPage,
            state.uploadDoc,
            state.setSubmit,
            state.setClear,
            state.setUploadDoc,
            state.uploadFile,
            state.details,
            state.setDetails,
            state.setGroup,
            state.updateGroup
        ],
        shallow
    );

    const mutationThesis = useMutation(uploadFile, {
        onSuccess: (data) => {
            setSubmit(false); 
            if(data?.error) { 
                message.error(ERROR_MESSAGE); 
            }
            else{
                queryClient.invalidateQueries("thesisFaculties");
                setClear(true);
                setVisibleDepartment(false);
                message.success("New studfent successfully created!"); 
            }
        },
    });

    const mutationThesisGroup = useMutation(updateGroup, {
        onSuccess: (data) => { 
            setSubmit(false); 
            if(data?.error) { 
                message.error(ERROR_MESSAGE); 
            }
            else{
                queryClient.invalidateQueries("thesisFaculties");
                setClear(true);
                setGroup(false);
                setDetails(null);
                message.success("Thesis group successfully updated!"); 
            }
        },
    });

    const {
        isLoading,
        data: thesis ,
        isFetching,
    } = useThesisFaculty(page,perPage);

    const viewDetails = (details) =>{
        history.push(`/faculty/thesis-details?id=${details?.id}&key=${btoa(details?.id)}&back=${btoa('/faculty/thesis-details')}`);
    }

    const columnsThesis = [
        {
            title: "Title",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Group Name",
            dataIndex: "group_name",
            key: "group_name",
        },
        {
            title: "Action",
            key: "action",
            width: "100px",
            render: (value) => (  
                <Space>
                    <Tooltip title="Update Group" color="orange">
                        <Button
                            type="dashed"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setGroup(true);
                                setDetails(value?.data);
                            }}
                        />
                    </Tooltip>
                    {/*<Tooltip title="Update Document" color="cyan">
                        <Button
                            type="dashed"
                            icon={<CloudUploadOutlined />}
                            onClick={() => {
                                setUploadDoc(true);
                                setDetails(value?.data);
                            }}
                        />
                    </Tooltip>*/}
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
    
    let list_thesis = [];  
    let list_thesis_array =  Array.isArray(thesis) ? thesis : [];  
    if (!isLoading) {
        for (let index = 0; index < list_thesis_array.length; index++) {
            list_thesis.push({
                key: index,
                name:  list_thesis_array[index].thesis_name,
                group_name:  list_thesis_array[index].group_name,
                data: list_thesis_array[index],
            });
        }
    }
   
    return (  
        <Layout>
            <Card title="List of Thesis" bordered={false}     className="card-nopadding" >
                <Table
                    loading={isFetching}
                    pagination={false}
                    columns={columnsThesis}
                    dataSource={list_thesis}
                />
            </Card>
            {/* <FormDocUpload
               submitForm={(params) => {
                mutationThesis.mutate({
                    id: details?.id,
                    document: params?.document?.fileList[0]?.originFileObj,
                });
            }}
            /> */}
            <FormGroups
               submitForm={(params) => {
                params.thesis_id = details?.id
                mutationThesisGroup.mutate(params);
                setSubmit(true); 
            }}
            />
        </Layout>
    );
};

export default React.memo(ThesisDetails);
