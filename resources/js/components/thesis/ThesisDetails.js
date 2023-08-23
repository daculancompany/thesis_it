import React, { useEffect } from "react";
import { Button, Drawer, Space, message, Spin, Badge } from "antd";
import queryString from "query-string";
import { seurityRoutes, baseURL } from "~/utils/helper";
import { useThesisStore } from "~/states/thesisState";
import shallow from "zustand/shallow";
import SplitPane from "react-split-pane";
import { FormCrop, PDFAnnotations, Tooltip, FormAnnotate } from "~/components";
import { formats } from "~/components/shared/EditorToolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactPDF from "@intelllex/react-pdf";
import {
    CopyOutlined,
    CommentOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { useMutation,useQueryClient } from "react-query";
import { useDocDetails } from "~/hooks";
import secureLocalStorage from "react-secure-storage";
import { useInlineComments, useScreenRecord } from "~/hooks";

const ThesisDetails = (props) => {
    let params = queryString.parse(props.location.search);
    const queryClient = useQueryClient();
    if (params?.id) {
        seurityRoutes(params);
    }

    const [
        comment,
        setComment,
        loading,
        setLoading,
        saveComment,
        setimageCropped,
        imageEdited,
        addContent,
        setAddContent,
        capturing,
        setCapturing,
        setVisibleThesis,
        isSaveComment,
        setSubmitComment,
        setSubmit,
        isSubmit,
        docID,
        setDocId,
        isComment,
        setIsComment,
        imageCrop,
        isEditedCrop,
        setScreenRecord,
    ] = useThesisStore(
        (state) => [
            state.comment,
            state.setComment,
            state.loading,
            state.setLoading,
            state.saveComment,
            state.setimageCropped,
            state.imageEdited,
            state.addContent,
            state.setAddContent,
            state.capturing,
            state.setCapturing,
            state.setVisibleThesis,
            state.isSaveComment,
            state.setSubmitComment,
            state.setSubmit,
            state.isSubmit,
            state.docID,
            state.setDocId,
            state.isComment,
            state.setIsComment,
            state.imageCrop,
            state.isEditedCrop,
            state.setScreenRecord
        ],
        shallow
    );

    setTimeout(() => {
        window.scrollTo({ top: 0 });
        document.body.classList.add("hide-body-scroll");
    }, 0);

    const { isLoading, data: details, isFetching } = useDocDetails(params?.id);
    const { data: inlineComment } = useInlineComments(params?.id);
    const { data: screenRecord, refetch: refetchRecord } = useScreenRecord(params?.id);
    console.log('details',details)
    useEffect(() => {
        setComment(details?.comments?.comment);
    }, [details?.comments?.comment]);

    useEffect(() => {
        if (addContent) {
            let old_value = comment + `<img  src='${imageEdited}' />`;
            setComment(old_value);
            setAddContent(false);
        }
    }, [addContent]);

    const mutationComment = useMutation(saveComment, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("doc-comments-inline");
                queryClient.invalidateQueries("docDetailsQuery");
                // setClear(true);
                // setGroup(false);
                message.success("Comment successfully saved!");
            }
        },
    });

    const saveOverallComment = () => {
        setSubmit(true);
        mutationComment.mutate({
            comment: comment,
            document_id: details?.docs?.id,
            thesis_id: details?.docs?.thesis_id,
        });
        queryClient.invalidateQueries("docDetailsQuery");
        queryClient.invalidateQueries("doc-comments-inline");
    };
    
    const onStartCapture = () => {
        let image = document.getElementsByClassName("focused");
        setVisibleThesis(true);
        setimageCropped(image[0].src);
    };

    const goBack = () => {
        document.body.classList.remove("hide-body-scroll");
        history.go(-1);
        return false;
    };

    const role = secureLocalStorage.getItem("userRole");

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                </div>
            )}

            {isSubmit && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                </div>
            )}
            <div className="action-top">
                <div>
                    <Button
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => goBack()}
                    />
                    <span style={{ marginLeft: 10 }}>
                        {details?.thesis?.thesis_name}
                    </span>
                </div>
               
                <div className="actions-details">
                    {role === "faculty" ? (
                        <Space>
                            <Tooltip title="Inline Comment" color="pink">
                                <Badge
                                    count={
                                        Array.isArray(inlineComment) &&
                                        inlineComment.length
                                    }
                                >
                                    <Button
                                        shape="circle"
                                        onClick={() => setIsComment(true)}
                                        icon={<CommentOutlined />}
                                    />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Save Comment" color="green">
                                <Button
                                    shape="circle"
                                    onClick={() => saveOverallComment(true)}
                                    icon={<SaveOutlined />}
                                />
                            </Tooltip>
                        </Space>
                    ) : (
                        <Tooltip title="Inline Comment" color="pink">
                            <Badge
                                count={
                                    Array.isArray(inlineComment) &&
                                    inlineComment.length
                                }
                            >
                                <Button
                                    shape="circle"
                                    onClick={() => setIsComment(true)}
                                    icon={<CommentOutlined />}
                                />
                            </Badge>
                        </Tooltip>
                    )}
                </div>
            </div>
            <SplitPane
                split="vertical"
                minSize={350}
                defaultSize={600}
                maxSize={1000}
                style={{ background: "#transparent", marginTop: 50 }}
            >
                <div className="thesis-details">
                    <ReactQuill
                       onBlur={()=> consol.log(' onlurrrr')}
                        readOnly={role === "faculty" ? false : true}
                        modules={{ toolbar: role === "faculty" ? true : false }}
                        theme="snow"
                        value={comment}
                        onChange={setComment}
                        formats={formats}
                        className="editor"
                    />
                </div>
                <div id="pdf-content">
                    {!isLoading && (
                        <ReactPDF
                            url={`${baseURL()}/uploads/documents/${
                                details?.docs?.document
                            }`}
                            showProgressBar={true}
                            showToolbox
                        />
                    )}
                </div>
            </SplitPane>
            <FormCrop />
            <Drawer
                title={details?.thesis?.thesis_name}
                width={"100%"}
                open={isComment}
                bodyStyle={{ paddingBottom: 80 }}
                onClose={() => {
                    setIsComment(false);
                }}
                className="drawer-thesis-details"
            >
                <PDFAnnotations
                    url={`${baseURL()}/uploads/documents/${
                        details?.docs?.document
                    }`}
                    title={details?.thesis?.thesis_name}
                    id={params?.id}
                    role={role}
                    data={inlineComment}
                />
            </Drawer>
        </>
    );
};

export default React.memo(ThesisDetails);
