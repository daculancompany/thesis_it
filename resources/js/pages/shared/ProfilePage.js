import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Card,
    Avatar,
    Spin,
    Button,
    Tooltip,
    Space,
    Typography
} from "antd";
import {
    Layout,
    HeaderTitle,
} from "~/components";
import {
    EditOutlined
} from "@ant-design/icons";
import { useProfileStore } from "~/states/ProfileState";
import { useProfile } from "~/hooks";
import shallow from "zustand/shallow";
const { Meta } = Card;
const { Title, Text } = Typography;

const ProfilePage = () => {
    const style = {
        background: '#0092ff',
        padding: '8px 0',
      };
    const [
        setVisibleDepartment,
        createNewDepartment,
        setVisibleThesis,
        setSubmit,
        setClear,
        visibleThesis,
        createNewThesis,
    ] = useProfileStore(
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

    const {
        isLoading,
        data: profile,
        isFetching,
    } = useProfile();
    return (
        // <Layout>
        //     <HeaderTitle title="Profile Page" />
        //     <Row gutter={16}>
        //         <Col span={6}>
        //             profile
        //         </Col>
        //     </Row>
        // </Layout>
        <Layout>
            <div style={{ marginTop: 60 }}></div>
            {/* <Spin spinning={isFetching}> */}
                    <>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} xl={24}>
                                <Card>
                                    <Row >
                                        <Col xs={24} xl={2}>
                                            <div className="student-avatar">
                                                <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGQHpgtS41XuGtJXYysNDCWielI5vbs11ajHg4OiE&s" />
                                            </div>
                                        </Col>
                                        <Col xs={24} xl={21}>
                                            <Meta style={{marginTop:"10px"}}
                                                title={profile?.fname+' '+profile?.mname+'.'+' '+profile?.lname}
                                                description={profile?.email}
                                            />
                                        </Col>
                                        <Col xs={24} xl={1}>
                                            <Button type="primary">Edit</Button>
                                        </Col>
                                    </Row>
                                    <Row  style={{marginTop:'23px'}}>
                                        <Col xs={24} xl={24}>
                                            <Button type="primary" style={{marginRight:'4px'}}>About</Button>
                                            <Button>Password</Button>
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
                                                            // onClick={() => {
                                                            //     viewDetails(value?.data);
                                                            // }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                                </>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                <Col xs={24} xl={22}>
                                                    {/* <p style={{fontWeight:'600',fontSize:'21px'}}>Personal Details</p> */}
                                                    <Row gutter={[16, 16]}>
                                                        <Col xs={24} xl={4}>
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
                                                                    <p style={{textAlign:'left', fontWeight:'650'}}>{profile?.fname+' '+profile?.mname+'.'+' '+profile?.lname}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profile?.dob===null ? ' ':profile?.dob}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profile?.email}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profile?.phone}</p>
                                                                    <p  style={{textAlign:'left', fontWeight:'650'}}>{profile?.address}</p>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {/* <Col xs={24} xl={2}>
                                                    <Space>
                                                        <Tooltip title="Edit">
                                                            <Button
                                                                //shape="circle"
                                                                icon={<EditOutlined />}
                                                                // onClick={() => {
                                                                //     viewDetails(value?.data);
                                                                // }}
                                                            >Edit
                                                            </Button>
                                                        </Tooltip>
                                                    </Space>
                                                </Col> */}
                                             </Row>
                                        </Card>
                                    </Col>
                                    <Col xs={24} xl={5}>
                                        <Card
                                            title="Account Status"
                                            bordered={false}
                                            extra={
                                                <Space>
                                                    <Tooltip title="Edit">
                                                        <Button
                                                            //shape="circle"
                                                            icon={<EditOutlined />}
                                                            // onClick={() => {
                                                            //     viewDetails(value?.data);
                                                            // }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                {/* <Col xs={24} xl={18}>
                                                    <p style={{fontWeight:'600',fontSize:'21px'}}>Account Status</p>
                                                </Col>
                                                <Col xs={10} xl={2}>
                                                    <Space>
                                                        <Tooltip title="Edit">
                                                            <Button
                                                                //shape="circle"
                                                                icon={<EditOutlined />}
                                                                // onClick={() => {
                                                                //     viewDetails(value?.data);
                                                                // }}
                                                            >Edit
                                                            </Button>
                                                        </Tooltip>
                                                    </Space>
                                                </Col> */}
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
                                                            // onClick={() => {
                                                            //     viewDetails(value?.data);
                                                            // }}
                                                        >Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                            }
                                        >
                                            <Row gutter={[16, 16]}>
                                                {/* <Col xs={24} xl={18}>
                                                    <p style={{fontWeight:'600',fontSize:'21px'}}>Skills</p>
                                                </Col>
                                                <Col xs={24} xl={2}>
                                                    <Space>
                                                        <Tooltip title="Edit">
                                                            <Button
                                                                //shape="circle"
                                                                icon={<EditOutlined />}
                                                                // onClick={() => {
                                                                //     viewDetails(value?.data);
                                                                // }}
                                                            >Edit
                                                            </Button>
                                                        </Tooltip>
                                                    </Space>
                                                </Col> */}
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>

                    <FormCollege
                    submitForm={(params) => {
                        mutation.mutate({
                            college_name: params.college_name,
                            id: editData?.id || null,
                        });
                        setSubmit(true);
                    }}
                />                                    
            {/* </Spin> */}
        </Layout>
        
    );
};

export default React.memo(ProfilePage);
