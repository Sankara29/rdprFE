// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, CardHeader } from 'reactstrap';
import API_URL from '../../../config';
import { useState, useEffect } from 'react';

import { format } from 'date-fns';

const Overview = ({ village_id, line_id }) => {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    const [todaysData, setTodaysData] = useState(false);
    const [monthlyData, setMonthlyData] = useState(false);


    useEffect(() => {
        fetchx(API_URL + `/getVillageConsumptionToday?village_id=${village_id}&date=` + formattedDate)
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    setTodaysData(resp.data)
                }
            })


            fetchx(API_URL + `/getVillageConsumptionthisMonth?village_id=${village_id}&date=` + formattedDate)
            .then(result => result.json())
            .then(resp => {
                if (resp.statusCode === 200) {
                    console.log(resp)
                    setMonthlyData(resp.data)
                }
            })
    }, [village_id]);


    return (
        <div>

            <Row>
                <Col md="6">
                    <Card style={{ border: '1px solid #e3e6ee', height: '186px' }}>
                        <CardHeader style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>
                                    ELECTRICITY CONSUMPTION </span>
                                <span style={{ color: '#fe0000' }}>TODAY</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>{todaysData.length>0 ? todaysData[0].total_energy_supplied.toFixed(2) : '0'}<small>kwh</small></span>
                                {/* <span style={{ fontWeight: 'bold', fontSize: '10px', color: '#8392a5', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#10b759', marginRight: '4px' }}>1.2% ⬆</span>
                                    <span>than yesterday</span>
                                </span> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col md="6">
                    <Card style={{ border: '1px solid #e3e6ee', height: '186px' }}>
                        <CardHeader style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>
                                    WATER SUPPLIED IN </span>
                                <span style={{ color: '#fe0000' }}>APRIL</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>{monthlyData.length>0 ? monthlyData[0].total_water_supplied.toFixed(2) : '0'}<small>ltr</small></span>
                                {/* <span style={{ fontWeight: 'bold', fontSize: '10px', color: '#8392a5', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#10b759', marginRight: '4px' }}>1.2% ⬆</span>
                                    <span>than last month</span>
                                </span> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>



            </Row>

            <Row>

                <Col md="6">
                    <Card style={{ border: '1px solid #e3e6ee', height: '186px' }}>
                        <CardHeader style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>
                                    WATER SUPPLIED IN </span>
                                <span style={{ color: '#fe0000' }}>TODAY</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>{todaysData.length>0 ? todaysData[0].total_water_supplied.toFixed(2) : '0'}<small>ltr</small></span>
                                {/* <span style={{ fontWeight: 'bold', fontSize: '10px', color: '#8392a5', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#cf3241', marginRight: '4px' }}>0.2% ⬇</span>
                                    <span>than yesterday</span>
                                </span> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>



                <Col md="6">
                    <Card style={{ border: '1px solid #e3e6ee', height: '186px' }}>

                        <CardHeader style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '4px' }}>ELECTRICITY CONSUMPTION IN </span>
                                <span style={{ color: '#fe0000' }}>APRIL</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>{monthlyData.length>0 ? monthlyData[0].total_energy_supplied.toFixed(2) : '0'}<small>kwh</small></span>
                                {/* <span style={{ fontWeight: 'bold', fontSize: '10px', color: '#8392a5', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#10b759', marginRight: '4px' }}>1.2% ⬆</span>
                                    <span>than last month</span>
                                </span> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>






            </Row>
        </div>
    );
};

export default Overview;
