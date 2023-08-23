import React, { useEffect } from "react";
import { Empty, Tag, Button,Layout, message, Avatar, Tooltip, Typography,} from "antd";
import { PlusOutlined} from "@ant-design/icons";
import { useScheduleStore } from "~/states/scheduleState";
import { useRatingThesisSched } from "~/hooks";
import shallow from "zustand/shallow";
import {getCookie } from "~/utils/helper";
import { useMutation, useQueryClient } from "react-query";
import { ERROR_MESSAGE } from '~/utils/constant';
import { UserOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;
const SchedViewDetails = () => {
    const queryClient = useQueryClient();
    const [
        isFormDetails,
        setIsFormDetails,
        dates,
        dateTimeGroups,
        setDateTimeGroups,
        category,
        sy,
        sem,
        groupList,
        setSubmit,
        isSchedDetails,
        setIsSchedDetails,
        schedDetails,
        start_date,
        end_date,
        datesDetails,
        setDatesDetails,
        reportDetails,
        setReportDetails,
        panelRating,
        setPanelRating,
        setRatingLength,
        totalFacultyRating,
        setTotalFacultyRating,
        thesisTitle,
        setThesisTitle,
        proponents,
        setProponents,
        totalPanel,
        setTotalPanel,
        totalPanelHasRating,
        panel
    ] = useScheduleStore(
        (state) => [
            state.isFormDetails,
            state.setIsFormDetails,
            state.dates,
            state.dateTimeGroups,
            state.setDateTimeGroups,
            state.category,
            state.sy,
            state.sem,
            state.groupList,
            state.setSubmit,
            state.isSchedDetails,
            state.setIsSchedDetails,
            state.schedDetails,
            state.start_date,
            state.end_date,
            state.datesDetails,
            state.setDatesDetails,
            state.reportDetails,
            state.setReportDetails,
            state.panelRating,
            state.setPanelRating,
            state.setRatingLength,
            state.totalFacultyRating,
            state.setTotalFacultyRating,
            state.thesisTitle,
            state.setThesisTitle,
            state.proponents,
            state.setProponents,
            state.totalPanel,
            state.setTotalPanel,
            state. totalPanelHasRating,
            state.panel
        ],
        shallow
    ); 
    
    const cur_user = getCookie("userID");
    
   
    return (
        <Layout>
            <div style={{ width: 300 }}>
            
                    <h2></h2>
                    <h5>{thesisTitle}</h5>
                    {/* <Text>Proponents: </Text>
                    <Avatar.Group>
                        {Array.isArray(proponents) && proponents.map((item,i)=>{
                            return(
                                <Tooltip title={`${item.fname} ${item.mname}${item.mname ? '.' : ''} ${item.lname}`} placement="top" key={i}>
                                    {item?.image ? <Avatar className="avatar-content" size="small" src={`${DIR_LOCATION.profile}${item?.image}`} icon={<UserOutlined />} /> : <Avatar className="avatar-content" size="small" icon={<UserOutlined />} />}
                                </Tooltip>
                                )
                        })}  
                    </Avatar.Group>
                    <hr></hr> */}
                    <Text>Panel: </Text>
                    <Avatar.Group>
                        {Array.isArray(panel) && panel.map((item,i)=>{
                            return(
                                <Tooltip title={`${item.fname} ${item.mname}${item.mname ? '.' : ''} ${item.lname}`} placement="top" key={i}>
                                    {item?.image ? <Avatar className="avatar-content" size="small" src={`${DIR_LOCATION.profile}${item?.image}`} icon={<UserOutlined />} /> : <Avatar className="avatar-content" size="small" icon={<UserOutlined />} />}
                                </Tooltip>
                                )
                        })}  
                    </Avatar.Group>
                    <hr></hr>
                    <table className="table-content">
                        <tbody>
                            
                            {Array.isArray(panelRating) && panelRating.map((obj2, i) => ( 
                                <>
                                <p> <b>{obj2?.name}</b></p>
                                <tr>
                                    <td>Research Topic</td>
                                    <td className="score">
                                        <Tag color="green">{obj2?.research_topic}</Tag> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Relevant Literature and Related Existing Application
                                    </td>
                                    <td className="score">
                                         <Tag color="green">{obj2?.relevant_literature}</Tag> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>Issues and Gap</td>
                                    <td className="score">
                                        <Tag color="green">{obj2?.issues_gap}</Tag> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>Possibe Solutions/Enhancement and Impact</td>
                                    <td className="score">
                                        <Tag color="green">{obj2?.possibe_solutions}</Tag> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>Overall Concept Presentation</td>
                                    <td className="score">
                                        <Tag color="green">{obj2?.overall_concept}</Tag> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Total Points</b>
                                    </td>
                                    <td className="score">
                                        <Tag color="green"><b>{obj2?.total}</b></Tag>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Remarks</b>
                                    </td>
                                    <td className="score">
                                        {obj2?.total >= 75 &&(
                                            <Tag color="green">APPROVED</Tag>
                                        )}
                                        {obj2?.total < 75 &&(
                                            <Tag color="red">DENIED</Tag>
                                        )}
                                        
                                    </td>
                                </tr>
                                <p>Recommendations:
                                        <p>{obj2?.recommendation}<br></br></p>
                                </p>
                               
                                </>
                            ))}
                            {totalPanel>0 &&  ( 
                                <>
                                    <tr>
                                        <td ><b>Total Rating Average</b></td>
                                        {totalPanel==totalPanelHasRating &&  ( <td className="score" ><Tag color="green"><b style={{fontSize:'15px'}}>{totalFacultyRating/totalPanel}</b></Tag></td>)}
                                    </tr>
                                    <tr>
                                        <td ><b>Remark</b></td>
                                        {totalPanel==totalPanelHasRating &&  ( <td className="score">{totalFacultyRating/totalPanel >= 75 &&(
                                                <Tag color="green"><b style={{fontSize:'15px'}}>APPROVED</b></Tag>
                                            )}
                                            {totalFacultyRating/totalPanel < 75 &&(
                                                <Tag color="red"><b style={{fontSize:'15px'}}>DENIED</b></Tag>
                                            )}
                                        </td>)}
                                    </tr>
                                </>
                            )} 
                            {totalFacultyRating <=0 &&  ( 
                                <>
                                    <tr>
                                        <td ><b>No ratings yet!</b></td>
                                       
                                    </tr>
                                   
                                </>
                            )}
                        </tbody>
                    </table>
                    <table className="table-content">
                        <tbody>
                            
                        </tbody>
                    </table>
            </div>
           
        </Layout>
        
    );
};

export default React.memo(SchedViewDetails);
