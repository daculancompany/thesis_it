import { Button, Form, Input, Modal, Empty ,Tag, Avatar, Tooltip} from "antd";
import React, { useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import shallow from "zustand/shallow";
import { useScheduleReportStore } from "~/states/scheduleStateReport";

const SchedDetails = React.memo(({ submitForm }) => {
    const [form] = Form.useForm();
    const [totalPerFaculty, setTotalPerFaculty] = React.useState(0);
    const [
        isSubmit,
        isClear,
        visibleDetails,
        details,
        setClear,
        setSubmit,
        setVisibleDetails,
        setDetails,
        perPage,
        schedID,
        setSchedID,
        reportDetails,
        setReportDetails,
        panelRating,
        setPanelRating,
        ratingLength,
        totalFacultyRating,
        proponents,
        setProponents,
        thesisTitle,
        setThesisTitle,
        totalPanel,
        setTotalPanel,
        
    ] = useScheduleReportStore(
        (state) => [
            state.isSubmit,
            state.isClear,
            state.visibleDetails,
            state.details,
            state.setClear,
            state.setSubmit,
            state.setVisibleDetails,
            state.setDetails,
            state.perPage,
            state.schedID,
            state.setSchedID,
            state.reportDetails,
            state.setReportDetails,
            state.panelRating,
            state.setPanelRating,
            state.ratingLength,
            state.totalFacultyRating,
            state.proponents,
            state.setProponents,
            state.thesisTitle,
            state.setThesisTitle,
            state.totalPanel,
            state.setTotalPanel,
           
        ],
        shallow
    );
   
   
    useEffect(() =>{
        if(isClear) form.resetFields();
    },[isClear])

    return (
        <Modal
            visible={visibleDetails}
            onCancel={() => {
                setVisibleDetails(false);
               // setEdit(null);
            }}
            onOk={form.submit}
            title='Schedule Report Details'
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {``}
                </Button>,
            ]}
        >
             <div style={{  }}>
                    <h2></h2>
                    <h5>{thesisTitle}</h5>
                    <Avatar.Group>
                        {Array.isArray(proponents) && proponents.map((item,i)=>{
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
                                <p>PANEL: <b>{obj2?.name}</b></p>
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
                            <tr>
                                <td ><b>Total Rating Average</b></td>
                                <td className="score" ><Tag color="green"><b style={{fontSize:'15px'}}>{totalFacultyRating/totalPanel}</b></Tag></td>
                            </tr>
                            <tr>
                                <td ><b>Remark</b></td>
                                <td className="score">{totalFacultyRating/totalPanel >= 75 &&(
                                        <Tag color="green"><b style={{fontSize:'15px'}}>APPROVED</b></Tag>
                                    )}
                                    {totalFacultyRating/totalPanel < 75 &&(
                                        <Tag color="red"><b style={{fontSize:'15px'}}>DENIED</b></Tag>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table-content">
                        <tbody>
                            
                        </tbody>
                    </table>
            </div>
           
        </Modal>
    );
});

export default React.memo(SchedDetails);
