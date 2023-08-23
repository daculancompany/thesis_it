import React, { useEffect, useState } from "react";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { DIR_LOCATION } from "~/utils/constant";
import {
    Col,
    Row,
    Card,
    Avatar,
    Spin,
    Button,
    Tooltip,
    Space,
    Typography,
    message,
    Tag,
    Form 
} from "antd";
import {
    Layout,
    HeaderTitle,
} from "~/components";
import {
    EditOutlined,
    uploadButton
} from "@ant-design/icons";
import { useProfileStore } from "~/states/profileState";
import { useProfile } from "~/hooks";
import shallow from "zustand/shallow";
import { FormPersonalDetails,FormSkills, FormAbout,FormPrimaryDetails,FormPassword } from "./index";
import { useMutation, useQueryClient } from "react-query";
import { ERROR_MESSAGE } from "~/utils/constant";
import Moment from 'moment';
import Upload from 'rc-upload';
import axiosConfig from "~/utils/axiosConfig";
// import ImgCrop from 'antd-img-crop';
const { Meta } = Card;
const { Title, Text } = Typography;
const { Dragger } = Upload;
const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const style = {
        background: '#0092ff',
        padding: '8px 0',
      };
    const [
        setVisiblePersonalDetails,
        editData,
        setEdit,
        setClear,
        setSubmit,
        editPersonalDetails,
        visibleSkills,
        setVisibleSkills,
        editSkills,
        visibleAbout,
        setVisibleAbout,
        visiblePrimaryDetails,
        setVisiblePrimaryDetails,
        isSubmit,
        editPrimaryDetails,
        image,
        setImage,
        editAbout,
        setVisiblePassword,
        editPassword,
        setSubmit2 ,
        isClear2,
        setClear2,
    ] = useProfileStore(
        (state) => [
            state.setVisiblePersonalDetails,
            state.editData,
            state.setEdit,
            state.setClear,
            state.setSubmit,
            state.editPersonalDetails,
            state.visibleSkills,
            state.setVisibleSkills,
            state.editSkills,
            state.visibleAbout,
            state.setVisibleAbout,
            state.visiblePrimaryDetails,
            state.setVisiblePrimaryDetails,
            state.isSubmit,
            state.editPrimaryDetails,
            state.image,
            state.setImage,
            state.editAbout,
            state.setVisiblePassword,
            state.editPassword,
            state.setSubmit2 ,
            state.isClear2,
            state.setClear2,
        ],
        shallow
    );

//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewImage, setPreviewImage] = useState('');
//     const [previewTitle, setPreviewTitle] = useState('');
//     const [fileList, setFileList] = useState([]);
//     const handleCancel = () => setPreviewOpen(false);
//     const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//   };

    // const onFinish = (params ) => {
    //     setSubmit(true);
    
    //     axiosConfig
    //     .post(`/edit-skills`, params)
    //     .then((result) => {
    //         return result;
    //     })
    //     .catch((error) => {
    //         return {'error' : true, 'message' : error};
    //     });
    //             // .then((result) => {
    //             //     if(result.data==='exist'){
    //             //         setErrorMessage('Email is already in use!');
    //             //         setLoading(false);
    //             //         form.setFieldsValue({
    //             //             name: edit_data?.driver_name,
    //             //             email: edit_data?.email,
    //             //             password: edit_data.user_info?.password,
    //             //             address: edit_data?.address,
    //             //             contact_number: edit_data?.contact_number,
    //             //             driver_id: edit_data?.id,
    //             //             user_id: edit_data?.user_id,
    //             //         });
    //             //     }else{
    //             //         setTimeout(() => {
    //             //             successMessage("Changes succesfully saved!");
    //             //             setLoading(false);
    //             //             afterSaved();
    //             //             form.resetFields();
    //             //         }, 1000);
    //             //     }
    //             // })
    //             // .catch((error) => {
    //             //     globalError();
    //             // });
        
    // };

    const {
        isLoading,
        data: profileData,
        isFetching,
    } = useProfile();

    const mutationEditPerDetails = useMutation(editPersonalDetails, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("profile");
                setClear(true);
                setVisiblePersonalDetails(false);
                setEdit(null);
                message.success("Personal details updated sucessfully!");
            }
        },
    });

    const mutationEditSkills = useMutation(editSkills, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("profile");
                setClear(true);
                setVisibleSkills(false);
                setEdit(null);
                message.success("Skills updated sucessfully!");
            }
        },
    });
    const mutationEditAbout = useMutation(editAbout, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("profile");
                setClear(true);
                setVisibleAbout(false);
                setEdit(null);
                message.success("About updated sucessfully!");
            }
        },
    });
    
    const mutationEditPrimaryDetails = useMutation(editPrimaryDetails, {
        onSuccess: (data) => {
            setSubmit(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("profile");
                setClear(true);
                setVisiblePrimaryDetails(false);
                setEdit(null);
                message.success("Personal details updated sucessfully!");
            }
        },
    });
    const mutationEditPassword = useMutation(editPassword, {
        onSuccess: (data) => {
            setSubmit2(false);
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                if(data?.data==="wrongPass"){
                    message.error("The current password did not match!");
                }else{
                    queryClient.invalidateQueries("profile");
                    setClear2(true);
                    setVisiblePassword(false);
                    setEdit(null);
                    message.success("Password updated sucessfully!");
                }
                
            }
        },
    });
    const props = {
            // action: axiosConfig.post(`/update-profile`),
            multiple: false,
            maxCount: 1,
            accept:"image/*" ,
            beforeUpload: (file) => {  //console.log(file.size)
                const isPNG = file.type === 'image/*';
                const fsize = Math.round((file.size / 1024 / 1024)); 
                // if (!isPNG) {
                //     message.error(`${file.name} is not an image file`);
                //     return Upload.LIST_IGNORE;
                // }
                if (fsize > 10) {
                    message.error(`File size exceeds 10 MB`);
                    return Upload.LIST_IGNORE;
                }
                console.log('info',file);
                return false;
            },
            onChange: (info) => {
                alert();
                let formData = new FormData();
                formData.append("profile", info.fileList[0]?.originFileObj);
                // formData.append("id", params?.id);
                // formData.append("notes", params?.notes);
                // formData.append("isSchedule", params?.isSchedule);
                axiosConfig.post(`/update-profile`, formData)
                .then((result) => {
                    return result;
                })
                .catch((error) => {
                    return {'error' : true, 'message' : error};
                });
            },
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onChange = () => {
        alert()
    };
    // console.log('profileData', profileData)
    return (
        <Layout>
            <div style={{ marginTop: 60 }}></div>
            {/* <Spin spinning={isFetching}> */}
                    <>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} xl={24}>
                                <Card>
                                    <Row >
                                        <Col xs={24} xl={2}>
                                        {/* <Button
                                        id="submit_image"
                                                key="submit"
                                                type="primary"
                                                loading={isSubmit}
                                                onClick={form.submit}
                                            >
                                                Save
                                        </Button> */}
                                            <Form
                                                form={form}
                                                name="form-profile"
                                                // onFinish={onFinish}
                                            
                                            >
                                                <Form.Item
                                                    name="document"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please upload Profile Pic!",
                                                        },
                                                    ]}
                                                >
                                                    <div className="student-avatar">
                                                        {/* <ImgCrop rotationSlider>
                                                            <Upload 
                                                                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                                // listType="picture-card"
                                                                // showUploadList={{ showRemoveIcon: false }}
                                                                // fileList={fileList}
                                                                onChange={onChange}
                                                                // onPreview={onPreview}
                                                                // onChange={(info) => {
                                                                   
                                                                //     onUploadChangeHandler(info);
                                                                //   }}
                                                                                                
                                                            > */}
                                                         
                                                            <Tooltip placement="top" title="Update Profile Pic" >
                                                            {profileData?.user?.image ? (
                                                                <Avatar
                                                                    className="avatar-content pointer-cursor"
                                                                    size="small"
                                                                    src={`${DIR_LOCATION.profile}${profileData?.user?.image}`}
                                                                    icon={<UserOutlined />}
                                                                    onClick={() => {
                                                                        setEdit(profileData);
                                                                        setVisiblePrimaryDetails(true);
                                                                    }}

                                                                />
                                                            ) : (
                                                                    <Avatar
                                                                        className="avatar-content pointer-cursor"
                                                                        size={80}
                                                                        icon={<UserOutlined />}
                                                                        src={`${DIR_LOCATION.profile}${'no-profile.png'}`}
                                                                        onClick={() => {
                                                                            setEdit(profileData);
                                                                            setVisiblePrimaryDetails(true);
                                                                        }}
                                                                    />
                                                            )}
                                                                {/* <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGQHpgtS41XuGtJXYysNDCWielI5vbs11ajHg4OiE&s" onClick={() => {
                                                                    setEdit(profileData);
                                                                    setVisiblePrimaryDetails(true);
                                                                }}
                                                                 /> */}
                                                            </Tooltip>  
                                                                {/* {fileList.length < 5 && '+ Upload'} */}
                                                            {/* </Upload>
                                                        </ImgCrop> */}
                                                        {/* <Upload  {...props}
                                                            
                                              >
                                                            <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGQHpgtS41XuGtJXYysNDCWielI5vbs11ajHg4OiE&s" />
                                                        </Upload> */}
                                                    </div>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col xs={24} xl={21}>
                                            <Meta style={{marginTop:"10px"}}
                                                title={profileData?.profile?.fname+' '+profileData?.profile?.mname+'.'+' '+profileData?.profile?.lname}
                                                description={profileData?.profile?.email}
                                            />
                                        </Col>
                                        {/* <Col xs={24} xl={1}>
                                            <Button type="primary"
                                                 onClick={() => {
                                                    setEdit(profileData);
                                                    setVisiblePrimaryDetails(true);
                                                }}
                                            >Edit</Button>
                                        </Col> */}
                                    </Row>
                                    <Row  style={{marginTop:'23px'}}>
                                        <Col xs={24} xl={24}>
                                            <Button type="primary" style={{marginRight:'4px'}}
                                            onClick={() => {
                                                setEdit(profileData?.profile);
                                                setVisibleAbout(true);
                                            }}>About</Button>
                                            <Button onClick={() => {
                                                setEdit(profileData);
                                                setVisiblePassword(true);
                                            }}>Password</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} xl={24}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} xl={19}>
                                        <Card
                                            title="Personal Details"
                                            bordered={false}
                                            extra={
                                                <>
                                               
                                                <Space>
                                                    <Tooltip title="Edit">
                                                        <Button
                                                            //shape="circle"
                                                            icon={<EditOutlined />}
                                                            onClick={() => {
                                                                setEdit(profileData?.profile);
                                                                setVisiblePersonalDetails(true);
                                                            }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                                </>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                {/* <Col xs={24} xl={22}> */}
                                                    {/* <p style={{fontWeight:'600',fontSize:'21px'}}>Personal Details</p> */}
                                                    <Row gutter={[16, 16]}>
                                                        {/* <Col xs={24} xl={4}>
                                                        </Col>
                                                        <Col xs={24} xl={24}>
                                                            <Row gutter={[16, 16]}>
                                                                <Col xs={24} xl={6}>
                                                                    <p style={{textAlign:'right'}}>Name</p>
                                                                    <p style={{textAlign:'right'}}>Date Of Birth</p>
                                                                    <p style={{textAlign:'right'}}>Email</p>
                                                                    <p style={{textAlign:'right'}}>Mobile</p>
                                                                    <p style={{textAlign:'right'}}>Address</p>
                                                                </Col>
                                                                <Col xs={24} xl={10}>
                                                                    <p style={{textAlign:'left', fontWeight:'650'}}>{profileData?.profile?.fname+' '+profileData?.profile?.mname+'.'+' '+profileData?.profile?.lname}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profileData?.profile?.dob===null ? ' ':profileData?.profile?.dob}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profileData?.profile?.email}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profileData?.profile?.phone}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profileData?.profile?.address}</p>
                                                                </Col>
                                                            </Row>
                                                        </Col> */}
                                                        <table>
                                                            <tr>
                                                                <td width={'300px'} style={{textAlign:'right', fontWeight:'0',marginRight:'22px'}}><p style={{marginRight:'22px'}}>Name</p></td>
                                                                <td ><p style={{textAlign:'left', fontWeight:'650',}}>{profileData?.profile?.fname+' '+profileData?.profile?.mname+'.'+' '+profileData?.profile?.lname}</p></td>
                                                            </tr>
                                                            <tr>
                                                                <td width={'230px'} style={{textAlign:'right', fontWeight:'0',marginRight:'22px'}}><p style={{marginRight:'22px'}}>Date Of Birth</p></td>
                                                                <td ><p style={{textAlign:'left', fontWeight:'650',}}>{profileData?.profile?.dob!=null ? Moment(profileData?.profile?.dob).format('ll') :''}</p></td>
                                                            </tr>
                                                            <tr>
                                                                <td width={'230px'} style={{textAlign:'right', fontWeight:'0',marginRight:'22px'}}><p style={{marginRight:'22px'}}>Email</p></td>
                                                                <td ><p style={{textAlign:'left', fontWeight:'650',}}>{profileData?.profile?.email}</p></td>
                                                            </tr>
                                                            <tr>
                                                                <td width={'230px'} style={{textAlign:'right', fontWeight:'0',marginRight:'22px'}}><p style={{marginRight:'22px'}}>phone</p></td>
                                                                <td ><p style={{textAlign:'left', fontWeight:'650',}}>{profileData?.profile?.phone}</p></td>
                                                            </tr>
                                                            <tr>
                                                                <td width={'230px'} style={{textAlign:'right', fontWeight:'0',marginRight:'22px'}}><p style={{marginRight:'22px'}}>Address</p></td>
                                                                <td ><p style={{textAlign:'left', fontWeight:'650',}}>{profileData?.profile?.address}</p></td>
                                                            </tr>
                                                        </table>
                                                    </Row>
                                             </Row>
                                        </Card>
                                    </Col>
                                    <Col xs={24} xl={5}>
                                        <Card
                                            title="Account Status"
                                            bordered={false}
                                            extra={
                                                <Space>
                                                    {/* <Tooltip title="Edit">
                                                        <Button
                                                            //shape="circle"
                                                            icon={<EditOutlined />}
                                                            // onClick={() => {
                                                            //     viewDetails(value?.data);
                                                            // }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip> */}
                                                </Space>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                {profileData?.user?.status==="active" &&(
                                                    <Tag color="#87d068">Active</Tag>
                                                )}
                                                {profileData?.user?.status==="inactive" &&(
                                                    <Tag color="#87d068">Inactive</Tag>
                                                )}
                                            </Row>
                                        </Card>
                                        <Card
                                            style={{marginTop:'15px'}}
                                            title="Skills"
                                            bordered={false}
                                            extra={
                                                <Space>
                                                    <Tooltip title="Edit">
                                                        <Button
                                                            //shape="circle"
                                                            icon={<EditOutlined />}
                                                            onClick={() => {
                                                                setEdit(profileData);
                                                                setVisibleSkills(true);
                                                            }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                {Array.isArray(profileData?.skills_array) &&  profileData?.skills_array.map(skill => (  
                                                       <Tag>{skill}</Tag>
                                                ) )}
                                                
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                    <FormPassword
                        submitForm={(params) => {
                            mutationEditPassword.mutate({
                                user_curr_pass:params.user_curr_pass,
                                curr_pass:   editData?.user?.password,
                                new_pass: params.new_pass,
                                id: editData?.id || null,
                                user_id: editData?.profile?.user_id || null,
                            });
                            setSubmit2(true);
                        }}
                    />  
                    <FormPersonalDetails
                        submitForm={(params) => {
                            mutationEditPerDetails.mutate({
                                fname: params.fname,
                                lname: params.lname,
                                mname: params.mname,
                                dob: params.dob,
                                email: params.email,
                                phone: params.phone,
                                address: params.address,
                                id: editData?.id || null,
                            });
                            setSubmit(true);
                        }}
                    />   
                    <FormAbout
                        submitForm={(params) => {
                            mutationEditAbout.mutate({
                                about:  params.about,
                                id: editData?.id || null,
                                user_id: editData?.profile?.user_id || null,
                            });
                            setSubmit(true);
                        }}
                    />  
                    
                    <FormSkills
                        submitForm={(params) => {
                            mutationEditSkills.mutate({
                                skills: params.skills,
                                id: editData?.skills?.id || null,
                                user_id: editData?.profile?.user_id || null,
                            });
                            setSubmit(true);
                        }}
                    />  
                    {/* <FormPrimaryDetails
                        submitForm={(params) => {
                            mutationEditPrimaryDetails.mutate({
                                params.id = editStudent?.id || null;
                                curr_password: params.curr_password,
                                new_password: params.new_password,
                                pro_pic:  params?.profile?.fileList[0]?.originFileObj,
                                id: editData?.skills?.id || null,
                                user_id: editData?.profile?.user_id || null,
                                params.image = image;
                            });
                            setSubmit(true);
                        }}
                    />      */}
                    
                    <FormPrimaryDetails
                        // submitForm={(params) => {
                        // params.id = editData?.id || null;
                        // params.user_id = editData?.profile?.user_id || null,
                        // params.image = image;
                        // mutationEditPrimaryDetails.mutate(params);
                        submitForm={(params) => {
                            mutationEditPrimaryDetails.mutate({
                                id: editData?.skills?.id || null,
                                user_id: editData?.profile?.user_id || null,
                                image: image,
                            });
                            setSubmit(true);
                        }}
                        // }}
                    />
                                                      
            {/* </Spin> */}
        </Layout>
        
    );
};

export default React.memo(ProfilePage);
