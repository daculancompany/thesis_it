

import React from "react";
import { Page, Text, Image, Document, StyleSheet,View } from "@react-pdf/renderer";
import { Descriptions} from "antd";
import { useScheduleStore } from "~/states/scheduleState";
import shallow from "zustand/shallow";
import moment from "moment";

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: "left",
        fontFamily: "Times-Roman",
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 20,
        marginBottom: 12,
        textAlign: "left",
        color: "",
    },
    company: {
        fontSize: 9,
        // marginBottom: 12,
        textAlign: "left",
        color: "",
    },
    table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 0, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableRow2: { 
    margin: "auto", 
    marginTop: "15px", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 0, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCol2: { 
    width: "15%", 
    borderStyle: "solid", 
    borderWidth: 0, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  },
  tableCell2: { 
    textAlign: "left",
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  }
});


const SchedulePdf = () => {
    const [
        isMeasurement,
        setMeasurement,
        materials,
        operations,
        borders,
        thickness,
        itemsMeasurement,
        itemsAdded,
        setItemsAdded,
        loading,
        fileID,
        editMeasurementData,
        isViewQuoteDetails,
        setViewQuoteDetails,
        quoteDetails,
        setQuoteDetails,
        customerDetails,
        setCustomerDetails,
        schedReport,
        setSchedreport,
        schedDetails,
        start_date,
        end_date,
    ] = useScheduleStore(
        (state) => [
            state.isMeasurement,
            state.setMeasurement,
            state.materials,
            state.operations,
            state.borders,
            state.thickness,
            state.itemsMeasurement,
            state.itemsAdded,
            state.setItemsAdded,
            state.loading,
            state.fileID,
            state.editMeasurementData,
            state.isViewQuoteDetails,
            state.setViewQuoteDetails,
            state.quoteDetails,
            state.setQuoteDetails,
            state.customerDetails,
            state.setCustomerDetails,
            state.schedReport,
            state.setSchedreport,
            state.schedDetails,
            state.start_date,
            state.end_date
        ],
        shallow
    );

    return (

            <Document>
                <Page style={styles.body} orientation="landscape">
                    <Text style={styles.header} >University Of Science and Technology </Text>
                    <Text style={styles.company} >Thesis Schedule Report</Text>
                    <Text style={styles.company} >{moment(`${start_date}`).format("LL")} - {moment(`${end_date}`).format("LL")}</Text>
                    {/* <Text style={styles.company} >Ardmore OK,9018</Text>
                    <Text style={styles.company} >580-579-5317</Text> */}

                    <hr style={{border:'2px solid maroon',marginBottom:'10px',marginTop:'10px'}}></hr>
                    {/* <Text style={{fontSize:'10px',fontWeight:'bold',marginLeft:'20px',marginBottom:'10px'}} >To:</Text>
                    <Text style={styles.customer} >{customerDetails?.fname}  {customerDetails?.lname}</Text>
                    <Text style={styles.customer} > {customerDetails?.email}</Text>
                    <Text style={styles.customer} > {customerDetails?.phone}</Text> */}
                    {/* <hr style={{border:'1px solid gray',marginBottom:'10px',marginTop:'10px'}}></hr> */}
                                        
                                    
                    <View style={styles.table}>
                        <View style={styles.tableRow}> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>Date</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>Time</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>Group</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>Rating Average</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>Remarks</Text> 
                            </View> 
                        </View>
                        <hr style={{border:'1px solid gray',marginBottom:'10px',marginTop:'10px'}}></hr>
                            {Array.isArray(schedDetails) && schedDetails.map((obj, i) => ( 
                                Array.isArray(obj?.thesis) && obj?.thesis.map((obj2, i) => ( 
                                    <>
                                        <View style={styles.tableRow}> 
                                            <View style={styles.tableCol}> 
                                                <Text style={styles.tableCell}>{obj2?.date_sched}</Text> 
                                            </View> 
                                            <View style={styles.tableCol}> 
                                                <Text style={styles.tableCell}>{obj2?.time}</Text> 
                                            </View> 
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>{obj2?.group_name}</Text> 
                                            </View>
                                            <View style={styles.tableCol}> 
                                                <Text style={styles.tableCell}>{obj2?.rating_average}</Text> 
                                            </View> 
                                            <View style={styles.tableCol}> 
                                                {obj2?.total_panel==obj2?.total_panel_has_rating &&
                                                    <Text style={styles.tableCell}>{obj2?.remark}</Text> 
                                                }
                                            </View> 
                                        </View> 
                                        {obj2?.rating_perSched.length >0 && 
                                            <>
                                                <View style={styles.tableRow2}> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Panel</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Research Topic</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Relevant Literature</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Issues and Gap</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Possible Solutions</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Overall Concept</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>Total</Text> 
                                                    </View> 
                                                </View>
                                            </>
                                        }
                                       
                                        {Array.isArray(obj2?.rating_perSched) && obj2?.rating_perSched.map((obj3, i) => (
                                            <>
                                               
                                                <View style={styles.tableRow}> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={[styles.tableCell,{ textAlign: 'left' }]}>{obj3?.name}</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>{obj3?.research_topic}</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}>
                                                        <Text style={styles.tableCell}>{obj3?.relevant_literature}</Text> 
                                                    </View>
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>{obj3?.issues_gap}</Text> 
                                                    </View> 
                                                    <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>{obj3?.possibe_solutions}</Text> 
                                                    </View> 
                                                     <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>{obj3?.overall_concept}</Text> 
                                                    </View> 
                                                     <View style={styles.tableCol2}> 
                                                        <Text style={styles.tableCell}>{obj3?.total}</Text> 
                                                    </View> 
                                                </View> 
                                            </>
                                        ))}
                                        <hr style={{border:'1px solid gray',marginBottom:'10px',marginTop:'10px'}}></hr>
                                    </>
                                ))
                            ))},
                    </View>
                  
                    {/* <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                        `${pageNumber} / ${totalPages}`
                    }
                    /> */}
                </Page>
            </Document>
        
    );
};

export default SchedulePdf;
