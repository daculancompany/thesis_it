import React, { useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import ReactPDF from "@intelllex/react-pdf";
import SplitPane from "react-split-pane";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
    modules,
    formats,
} from "~/components/shared/EditorToolbar";
import ScreenCapture from "~/components/shared/ScreenCapture";
import html2canvas from "html2canvas";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button, Space, Tooltip } from "antd";

const PDFView = () => {
    const [value, setValue] = React.useState("");

    const handleScreenCapture = (data) => {
        let old_value = value + `<img  src='${data}' />`;
        setValue(old_value);
    };

    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState(null);

    const onStartCapture = () => {
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
            setSrc(img);
        });
    };

    const handleClickTakeScreenShot = () => {
        const { cropPositionTop, cropPositionLeft, cropWidth, cropHeigth } =
            state;
        const body = document.querySelector("body");
        //const body = document.getElementById('viewer-container');

        html2canvas(body).then((canvas) => {
            let croppedCanvas = document.createElement("canvas");
            let croppedCanvasContext = croppedCanvas.getContext("2d");

            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeigth;

            croppedCanvasContext.drawImage(
                canvas,
                cropPositionLeft,
                cropPositionTop,
                cropWidth,
                cropHeigth,
                0,
                0,
                cropWidth,
                cropHeigth
            );

        });
        setState((state) => ({
            ...state,
            crossHairsTop: 0,
            crossHairsLeft: 0,
        }));
    };

    const cropImageNow = async () => {
        // return
        // .then(res => res.blob())
        // .then(blob => {
        //     const file = new File([blob], "File name",{ type: "image/png" })
        //     const croppedImg =  getCroppedImg(file,"edited");
        //     console.log({croppedImg})
        // })
        //  return
        // const croppedImg = await getCroppedImg(src, crop, "edited");
        // console.log(croppedImg)
    };
    const onImageLoad = (e) => {
        //console.log(e);
    };
    return (
        <>
            {src && (
                <>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onImageLoaded={(e) => console.log(e)}
                    >
                        <img src={src} />
                    </ReactCrop>
                    <button onClick={cropImageNow}>Crop</button>
                </>
            )}
            <SplitPane
                split="vertical"
                minSize={200}
                defaultSize={400}
                maxSize={700}
            >
                <div>
                    <div>
                        <Tooltip title="search">
                             <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                        </Tooltip>
                        The thesis
                    </div>
                    <EditorToolbar />
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        formats={formats}
                        style={{ height: "60vh", width: "100%" }}
                    />
                    <div className="site-button-ghost-wrapper">
                        <Space>
                            <Button type="primary">Save Comment</Button>
                            <Button type="dashed" onClick={onStartCapture} >Capture Image</Button>
                        </Space>
                    </div>
                </div>
                <div id="pdf-content">
                    <ReactPDF
                        url="http://127.0.0.1:8000/uploads/documents/doc-1660621224.pdf"
                        showProgressBar
                        showToolbox
                    />
                </div>
            </SplitPane>
        </>
    );
};

export default PDFView;
