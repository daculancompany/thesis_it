import React, { useEffect } from "react";
import { useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { Layout, HeaderTitle, Breadcrumb } from "../../../components";
import { useDashboard } from "~/hooks";
import {
    FileTextOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const icon_size = 40;

export function MaterialSymbolsSchoolOutlineRounded(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon_size}
            height={icon_size}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                d="M12 20.725q-.25 0-.488-.063t-.462-.187l-5-2.7q-.5-.275-.775-.737T5 16v-4.8L2.6 9.875q-.275-.15-.4-.375T2.075 9q0-.275.125-.5t.4-.375l8.45-4.6q.225-.125.463-.188T12 3.275q.25 0 .488.063t.462.187l9.525 5.2q.25.125.388.363T23 9.6V16q0 .425-.288.713T22 17q-.425 0-.713-.288T21 16v-5.9l-2 1.1V16q0 .575-.275 1.038t-.775.737l-5 2.7q-.225.125-.462.188t-.488.062Zm0-8.025L18.85 9L12 5.3L5.15 9L12 12.7Zm0 6.025l5-2.7V12.25l-4.025 2.225q-.225.125-.475.188t-.5.062q-.25 0-.5-.063t-.475-.187L7 12.25v3.775l5 2.7Zm0-6.025Zm0 3.025Zm0 0Z"
            ></path>
        </svg>
    );
}

export function IcBaselinePeopleOutline(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon_size}
            height={icon_size}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                d="M16.5 13c-1.2 0-3.07.34-4.5 1c-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22c.88-.3 1.96-.53 3.02-.53c2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5S4 6.57 4 8.5S5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5S13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2z"
            ></path>
        </svg>
    );
}

export function IonPeopleCircleOutline(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon_size}
            height={icon_size}
            viewBox="0 0 512 512"
            {...props}
        >
            <path
                fill="currentColor"
                d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208s-93.31 208-208 208Zm0-384c-97 0-176 79-176 176s79 176 176 176s176-78.95 176-176S353.05 80 256 80Z"
            ></path>
            <path
                fill="currentColor"
                d="M323.67 292c-17.4 0-34.21-7.72-47.34-21.73a83.76 83.76 0 0 1-22-51.32c-1.47-20.7 4.88-39.75 17.88-53.62S303.38 144 323.67 144c20.14 0 38.37 7.62 51.33 21.46s19.47 33 18 53.51a84 84 0 0 1-22 51.3C357.86 284.28 341.06 292 323.67 292Zm55.81-74Zm-215.66 77.36c-29.76 0-55.93-27.51-58.33-61.33c-1.23-17.32 4.15-33.33 15.17-45.08s26.22-18 43.15-18s32.12 6.44 43.07 18.14s16.5 27.82 15.25 45c-2.44 33.77-28.6 61.27-58.31 61.27Zm256.55 59.92c-1.59-4.7-5.46-9.71-13.22-14.46c-23.46-14.33-52.32-21.91-83.48-21.91c-30.57 0-60.23 7.9-83.53 22.25c-26.25 16.17-43.89 39.75-51 68.18c-1.68 6.69-4.13 19.14-1.51 26.11a192.18 192.18 0 0 0 232.75-80.17Zm-256.74 46.09c7.07-28.21 22.12-51.73 45.47-70.75a8 8 0 0 0-2.59-13.77c-12-3.83-25.7-5.88-42.69-5.88c-23.82 0-49.11 6.45-68.14 18.17c-5.4 3.33-10.7 4.61-14.78 5.75a192.84 192.84 0 0 0 77.78 86.64l1.79-.14a102.82 102.82 0 0 1 3.16-20.02Z"
            ></path>
        </svg>
    );
}

export function IonPeopleOutline(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon_size}
            height={icon_size}
            viewBox="0 0 512 512"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72Z"
            ></path>
            <path
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M336 304c-65.17 0-127.84 32.37-143.54 95.41c-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304Z"
            ></path>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94Z"
            ></path>
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M206 306c-18.05-8.27-37.93-11.45-59-11.45c-52 0-102.1 25.85-114.65 76.2c-1.65 6.66 2.53 13.25 9.37 13.25H154"
            ></path>
        </svg>
    );
}

export function CiUsersGroup(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon_size}
            height={icon_size}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3m14-3c0-1.23-1.234-2.287-3-2.75M3 17c0-1.23 1.234-2.287 3-2.75m12-4.014a3 3 0 1 0-4-4.472m-8 4.472a3 3 0 0 1 4-4.472M12 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6Z"
            ></path>
        </svg>
    );
}

const RowDashboard = ({ title, value, icon }) => {
    return (
        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
                <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                        <Col xs={18}>
                            <span>{title}</span>
                            <Title level={3}>{value}</Title>
                        </Col>
                        <Col xs={6}>
                            <div className="icon-box">
                              {icon}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Col>
    );
};

const DashboardPage = () => {

    const { isLoading, data: dashboard, isFetching } = useDashboard();


    return (
        <Layout breadcrumb={Breadcrumb.Faculty()}>
            <HeaderTitle title="" />
            <Row className="rowgap-vbox" gutter={[24, 24]}>
                {/* {count.map((c, index) => (
                    <Col
                        key={index}
                        xs={24}
                        sm={24}
                        md={12}
                        lg={6}
                        xl={6}
                        className="mb-24"
                    >
                        <Card bordered={false} className="criclebox ">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={18}>
                                        <span>{c.today}</span>
                                        <Title level={3}>{c.title}</Title>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="icon-box">{c.icon}</div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                ))} */}
                <RowDashboard
                    title="Total Students"
                    value={dashboard?.students || 0}
                    icon={<IonPeopleOutline className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Total Faculties"
                    value={dashboard?.faculties || 0}
                    icon={<IcBaselinePeopleOutline className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Total Groups"
                    value={dashboard?.groups || 0}
                    icon={<CiUsersGroup className="dashboard-icon" />}
                />
                 <RowDashboard
                    title="New Groups"
                    value={dashboard?.new_groups || 0}
                    icon={<CiUsersGroup className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Upcomming Schedules"
                    value={dashboard?.schedules || 0}
                    icon={<ScheduleOutlined className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Active Thesis"
                    value={dashboard?.activeThesis || 0}
                    icon={<FileTextOutlined className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Completed Thesis"
                    value={dashboard?.completedThesis || 0}
                    icon={<FileTextOutlined className="dashboard-icon" />}
                />
                <RowDashboard
                    title="Inactive  Thesis"
                    value={dashboard?.inactiveThesis || 0}
                    icon={<FileTextOutlined className="dashboard-icon" />}
                />
                
            </Row>
        </Layout>
    );
};

export default React.memo(DashboardPage);
