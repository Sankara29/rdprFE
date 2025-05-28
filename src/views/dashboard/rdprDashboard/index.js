// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import UpperCard from './dashBoardUpper'
import Maps from './upperMap'
import TotalSupplyConsumption from './totalSupplyCnspCard';
import MonthlyElectricity from './monthlyElectricity'
import WaterConsumed from './monthlyWater'
import HighestWaterSupplied from './highestWaterSupplied'
import TodaysInstalltionHistory from './todaysInstallationHistory'
import Complaints from './complaints'
import NoticeBoard from './noticeBoard'
const Overview = () => {


    return (
        <div>
            <p style={{ color: '#344563', fontWeight: 'bold', fontSize: '26px' }}>Overview</p>
            <p style={{ color: '##5e6c84', fontSize: '16px' }}>See insights of RDPR</p>
            <Row>

                <Col md='6' >
                    {/* <UpperCard/> */}
                    <TotalSupplyConsumption />

                </Col>
                <Col md='6' className='d-flex justify-content-end align-items-center'>
                    <Maps />
                </Col>
                {/* <Col md='3'  >
                    <MonthlyElectricity />
                </Col>
                <Col md='3'  >
                    <WaterConsumed />
                </Col>
                <Col md='6'  >
                    <HighestWaterSupplied />
                </Col>
                <Col md='4'  >
                    <TodaysInstalltionHistory />
                </Col>
                <Col md='4'  >
                    <Complaints />
                </Col>
                <Col md='4'  >
                    <NoticeBoard />
                </Col> */}
            </Row>
        </div>
    );
};

export default Overview;
