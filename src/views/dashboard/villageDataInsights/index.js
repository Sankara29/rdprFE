// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Button } from 'reactstrap';
import UpperChart from './upperChart'
import DistrictWiseSupplyAndConsumption from './districtWiseSupplyAndConsumption'
import RightSideCard1 from './rightSideCard1'
import RightSideCard2 from './rightSideCard2'
import TopCard2 from './topCard2'
import LineData from './lineData'
import { useNavigate } from 'react-router-dom';

const Overview = ({village_id,village_name,line_id}) => {

    let navigate = useNavigate();
console.log(village_id,village_name,line_id)
    return (
        <div>
            {/* <p style={{ color: '##5e6c84', fontSize: '14px', marginBottom: '5px' }}>State</p> */}
            {/* <p style={{ color: '#000000', fontWeight: 'bold', fontSize: '22px' }}>Village - Byasandra<Button color={''} style={{background:'#6d00fe',color:'#ffffff'}}>Control Panel</Button></p> */}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000000', fontWeight: 'bold', fontSize: '22px' }}>
                <span>Village - {village_name}</span>
                <Button color={''} style={{ background: '#6d00fe', color: '#ffffff', marginBottom: '10px' }} onClick={() => navigate('../../dashboard/controlPanel')}>
                    Control Panel
                </Button>
            </div>
            <Row>
                <Col md="5">
                <UpperChart village_id={village_id} line_id={line_id}/>
                </Col>

                <Col md="3">
                    <RightSideCard2 village_id={village_id} line_id={line_id}/>

                </Col>

                <Col md="3">
                    {/* <TopCard2 village_id={village_id} line_id={line_id}/> */}

                </Col>


                {/* <Col md="7">
                    <DistrictWiseSupplyAndConsumption />
                </Col>



                <Col md="4" style={{ paddingRight: '20px' }}>
                    <RightSideCard1 />

                </Col> */}


                <Col md="12" >
                    <LineData village_id={village_id} line_id={line_id}/>
                </Col>


            </Row>
        </div>
    );
};

export default Overview;
