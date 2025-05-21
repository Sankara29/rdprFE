

// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, CardHeader } from 'reactstrap';
import { useState, useEffect, useRef, useMemo } from 'react';
import SignIcon from '@src/views/dashboard/rdprDashboard/mainIcons/span.sc-ciZhAO.svg'
import Avatar from '@components/avatar'
import profileImg from '@src/assets/images/portrait/small/avatar-s-1.jpg'
import { RotateCw } from 'react-feather';
import API_URL from '../../../config';
const Overview = () => {
    let [rowData, setRowData] = useState();

    useEffect(() => {
        fetchx(API_URL + "/getAllCompliants")
        // fetchx("http://172.104.244.42:14012/v9/getAllCompliants")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
                // setRowData(rowData);
                // console.log(rowData)
            });
    }, []);


    function Refresh() {
        fetchx(API_URL + "/getAllCompliants")

        // fetchx("http://172.104.244.42:14012/v9/getAllCompliants")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
                // setRowData(rowData);
                // console.log(rowData)
            });

    }
    // rowData = [
    //     {
    //       "complaint": "Energy Meter not working",
    //       "installationDate": "Mar 03, 2024, 3:30PM",
    //       "status": "completed",
    //       "EMPID":"#220"
    //     },
    //     {
    //       "complaint": "Energy Meter not working",
    //       "installationDate": "Mar 03, 2024, 3:30PM",
    //       "status": "completed",
    //       "EMPID":"#220"
    //     },
    //     {
    //       "complaint": "Energy Meter not working",
    //       "installationDate": "Mar 03, 2024, 3:30PM",
    //       "status": "completed",
    //       "EMPID":"#220"
    //     },
    //     {
    //       "complaint": "Energy Meter not working",
    //       "installationDate": "Mar 03, 2024, 3:30PM",
    //       "status": "completed",
    //       "EMPID":"#220"
    //     }
    //   ]


    const horizontalLineStyle = {
        borderBottom: '0.1px solid #000',
        // margin: '10px 0',
        width: '100%', borderColor: 'lightgrey', margin: '10px 0', alignSelf: 'center'
    };



    return (
        <div className="p-0">

            <Card style={{ height: '450px' }}>
                <CardHeader style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px' }}>Complaints<RotateCw style={{ marginLeft: '220px', color: '#8392a5', cursor: 'pointer' }} onClick={() => Refresh()} /></CardHeader>
                <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}
                <CardBody style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '5px' }}>


                    {rowData && rowData.map((item, index) => (
                        <div>
                            <div key={index} className="d-flex align-items-start mt-2">
                                {/* Image on the left */}
                                {/* <img src={SignIcon} style={{ width: '50px', height: '40px', marginRight: '10px' }} alt="Icon" /> */}
                                <Avatar className='me-1' img={profileImg} imgHeight='38' imgWidth='38' style={{ filter: 'blur(1px)' }} />

                                {/* Installation name and date */}
                                <div>
                                    <a style={{ fontWeight: 'bold', fontSize: '14px', color: '#001737' }}>{item.reason}</a>
                                    <br />
                                    {/* <small style={{ color: '#8392a5' }}>{item.status}</small> */}
                                    <small style={{ color: item.status === 'pending' ? 'red' : item.status === 'completed' ? 'green' : '#8392a5' }}>
                                        {item.status}
                                    </small>

                                </div>


                                {/* InstalledBy and Status */}
                                {/* <div className="d-flex justify-content-end">
                                <div style={{ textAlign: 'right',marginRight: '10px' }}>
                                    <a style={{ fontWeight: 'bold', fontSize: '10px' }}>{item.installedBy}</a>
                                    <br/>
                                        <small>{item.status}</small>
                                    </div>
                                   
                                </div> */}

                                <div style={{ flex: '1' }}></div>

                                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                    {/* <a style={{ fontWeight: 'bold', fontSize: '14px', color: '#001737' }}>by,{item.installedBy}</a> */}
                                    <br />
                                    {/* <small style={{ color: '#10b759' }}>{item.status}</small> */}
                                    <small style={{ color: '#8392a5' }}>{item.datetime}</small>

                                </div>
                            </div>
                            <div style={horizontalLineStyle}></div> {/* Add the horizontal line */}

                        </div>
                    ))}
                </CardBody>
            </Card>


           


        </div>
    );
};

export default Overview;
