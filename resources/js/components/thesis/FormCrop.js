import { Button, Form, Drawer, Space } from "antd";
import React, { useState } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const FormCrop = React.memo(({ submitForm }) => {
    const [image, setImage] = useState(null);
    const [
        visibleThesis,
        setVisibleThesis,
        imageCrop,
        crop,
        setCrop,
        setImageEdited,
        setAddContent,
        setIsEditedCrop,
    ] = useThesisStore(
        (state) => [
            state.visibleThesis,
            state.setVisibleThesis,
            state.imageCrop,
            state.crop,
            state.setCrop,
            state.setImageEdited,
            state.setAddContent,
            state.setIsEditedCrop,
        ],
        shallow
    );

    const onCropComplete = (crop) => {
        makeClientCrop(crop);
    };

    const makeClientCrop = async (crop) => {
        if (image && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                image,
                crop,
                "newFile.jpeg"
            );
            setImageEdited(croppedImageUrl);
        }
    };

    const getCroppedImg = (image, crop, fileName) => {
        let fileUrl;
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        return base64Image;
        // return new Promise((resolve, reject) => {
        //     canvas.toBlob(blob => {
        //         if (!blob) {
        //             //reject(new Error('Canvas is empty'));
        //             console.error('Canvas is empty');
        //             return;
        //         }
        //         blob.name = fileName;
        //         window.URL.revokeObjectURL(fileUrl);
        //         fileUrl = window.URL.createObjectURL(blob);
        //         resolve(fileUrl);
        //     }, 'image/jpeg');
        // });
    };

    const submitImage = async () => {
        if (image && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                image,
                crop,
                "newFile.jpeg"
            );
            setImageEdited(croppedImageUrl);
        }
        setAddContent(true);
        setVisibleThesis(false);
    };

    const editImage = async () => {
        if (image && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                image,
                crop,
                "newFile.jpeg"
            );
            setImageEdited(croppedImageUrl);
        }
        //setAddContent(true);
        setVisibleThesis(false);
        setIsEditedCrop(true);
    };

    return (
        <Drawer
            open={visibleThesis}
            width={700}
            onClose={() => {
                setVisibleThesis(false);
            }}
            //onOk={form.submit}
            title={`Captured Image`}
            extra={[
                <Space>
                    <Button
                        key="submit"
                        // loading={isSubmit}
                        onClick={editImage}
                    >
                        Annotate
                    </Button>
                    <Button
                        key="submit"
                        type="primary"
                        // loading={isSubmit}
                        onClick={submitImage}
                    >
                        Save
                    </Button>
                </Space>,
            ]}
            className="center-modal"
        >
            {imageCrop && (
                <>
                    <ReactCrop
                        src={imageCrop}
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onImageLoaded={(e) => setImage(e)}
                        onComplete={onCropComplete}
                    >
                        {/* <img src={imageCrop} /> */}
                    </ReactCrop>
                    {/* <button onClick={cropImageNow}>Crop</button> */}
                </>
            )}
        </Drawer>
    );
});

export default React.memo(FormCrop);
