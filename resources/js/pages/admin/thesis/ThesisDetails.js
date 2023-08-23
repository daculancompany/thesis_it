import React, { useEffect ,useState } from "react";
import queryString from "query-string";
import { useParams, useHistory } from "react-router-dom";
import PDFView from "./PDFView";
import { useMutation, useQueryClient } from "react-query";
import { useThesisDetails } from "~/hooks";
import SplitPane from "react-split-pane";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EditorToolbar, {
    modules,
    formats,
} from "~/components/shared/EditorToolbar";
import ReactQuill from "react-quill";
import { Button, Space, Tooltip, Typography, message, Spin } from "antd";
import html2canvas from "html2canvas";
import ReactPDF from "@intelllex/react-pdf";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
// import { FormCrop } from '~/components'
import { seurityRoutes } from '~/utils/helper'
// import  PDFAnnotations  from "../../../components/thesis/PDFAnnotations";

const URL =
"http://127.0.0.1:8000/uploads/documents/doc-1660883750.pdf";

const { Title } = Typography;

const ThesisDetails = (props) => {
    const history = useHistory();
    let params = queryString.parse(props.location.search); 
    seurityRoutes(params);

    const {
        isLoading,
        data: thesis,
        isFetching,
    } = useThesisDetails(params?.id);
  

    const [thesisId, setThesisId] = React.useState(thesis?.id);
    const [
        setVisibleThesis,
        setimageCrop,
        imageEdited,
        addContent,
        setAddContent,
        capturing,
        setCapturing,
        comment,
        setComment,
        saveComment,
        loading,
        setLoading,
        setIsComment,
        isComment,
        thesisID,
        setThesisID
    ] = useThesisStore(
        (state) => [
            state.setVisibleThesis,
            state.setimageCrop,
            state.imageEdited,
            state.addContent,
            state.setAddContent,
            state.capturing,
            state.setCapturing,
            state.comment,
            state.setComment,
            state.saveComment,
            state.loading,
            state.setLoading,
            state.setIsComment,
            state.isComment,
            state.thesisID,
            state.setThesisID
        ],
        shallow
    );

    useEffect(() => {
        if(addContent) { 
            let old_value = comment + `<img  src='${imageEdited}' />`;
            setComment(old_value);
            setAddContent(false);
            setThesisID(thesis.id);
        }
    },[addContent])
    useEffect(() => {
        setLoading(true); 
    },[])

    const handleScreenCapture = (data) => {
        let old_value = comment + `<img  src='${data}' />`;
        setComment(old_value);
    };

    const onStartCapture = () => {
        setVisibleThesis(true);
        const hide = message.loading('Capturing document in progress..', 0);
        setCapturing(true);
        const toolbox = document.querySelector('.toolbox-wrapper');
        toolbox.classList.add('d-none');
        const thumbnail = document.querySelector('.pdf-thumbnail-bar');
        thumbnail.classList.add('d-none');
        // document.getElementById("overlay").style.display = "inline";
        // const { cropPositionTop, cropPositionLeft, cropWidth, cropHeigth } =
        // state;
        const htmlSource = document.getElementById("viewer-container");
        //const htmlSource = document.querySelector("body");
        const height = window.screen.height;
        const width = window.screen.width;
        html2canvas(htmlSource, { scrollY: -window.scrollY }).then(function (
            canvas
        ) {
            var img = canvas.toDataURL();
            setimageCrop(img);
            setCapturing(false);
            toolbox.classList.remove('d-none');
            thumbnail.classList.remove('d-none');
            setTimeout(hide, 0);
        });
    }; 

    // if(isComment){ 
    //   return<><PDFAnnotations
    //          url={`${thesis?.url}/uploads/documents/${thesis?.document}`} 
    //         title={thesis?.thesis_name}
    //    /></>;
    // }

    setTimeout(
        () => setLoading(false), 
        5000
    );
   

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                   <div className="loading-container"><Spin size="large" /></div>
                 </div>
            )}
            <SplitPane
                split="vertical"
                minSize={350}
                defaultSize={600}
                maxSize={1000}
                style={{ background: '#fff' }}
            >
                <div className="thesis-details">
                    <div className="hearder">
                        <Tooltip title="search">
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<ArrowLeftOutlined />}
                                onClick={()=>  history.push(`/admin/college/details?id=${params?.college_id}`)}
                            />
                        </Tooltip>
                        <Title level={5}>{thesis?.thesis_name}</Title>
                    </div>
                    <div>
                        <EditorToolbar />
                        <ReactQuill
                            theme="snow"
                            value={comment}
                            onChange={setComment}
                            modules={modules}
                            formats={formats}
                            className="editor"
                        />
                    </div>
                </div>
                <div id="pdf-content">
                    {!loading && (
                       <ReactPDF
                       url={`${thesis?.url}/uploads/documents/${thesis?.document}`}
                       showProgressBar={true}
                       showToolbox
                   />
                    )}
                    
                </div>
            </SplitPane>
            {/* <FormCrop /> */}
            <div className="site-button-ghost-wrapper" style={{ height: "90px"}}>
                <Space>
                    <Button type="primary" onClick={()=> setIsComment(true)}>Add Comment</Button>
                    <Button type="primary" onClick={saveComment}>Save Overall Comment</Button>
                    <Button type="dashed" onClick={onStartCapture} disabled={capturing} loading={capturing}  >Capture Image</Button>
                    
                </Space>
            </div>
        </>
    );
};

export default React.memo(ThesisDetails);
