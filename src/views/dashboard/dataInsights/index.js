// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import UpperChart from './upperChart'
import DistrictWiseSupplyAndConsumption from './districtWiseSupplyAndConsumption'
import RightSideCard1 from './rightSideCard1'
import RightSideCard2 from './rightSideCard2'

const Overview = ({village_id}) => {

console.log(village_id)
    return (
        <div>
            <p style={{ color: '##5e6c84', fontSize: '14px', marginBottom: '5px' }}>State</p>
            <p style={{ color: '#000000', fontWeight: 'bold', fontSize: '22px' }}>Karnataka</p>
            <Row>
            <Col md="12">
            <UpperChart village_id={village_id}/>
                </Col>



                <Col md="7">
            <DistrictWiseSupplyAndConsumption />
                </Col>



                <Col md="4" style={{paddingRight:'20px'}}>
                <RightSideCard1/>
                <RightSideCard2/>

                </Col>


                <Col md="4" style={{paddingRight:'20px'}}>
                </Col>


            </Row>
        </div>
    );
};

export default Overview;
