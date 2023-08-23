import { Button, Form, Row, Col, Tooltip, Drawer, Space, DatePicker, Card, Timeline, Typography, Avatar, Empty} from "antd";
import {  ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useThesisGroup } from "~/hooks";
import { useScheduleStore } from "~/states/scheduleState";
import {DIR_LOCATION} from '~/utils/constant'

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;

var getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};

const ScheduleDetails = ({submitForm}) => {
    
    return (
        <>
            ScheduleDetails
        </>
    );
};

export default React.memo(ScheduleDetails);
