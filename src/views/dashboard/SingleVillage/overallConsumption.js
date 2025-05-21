import React from 'react';
import { Card, CardBody, CardText } from 'reactstrap';
import { useEffect, useState } from 'react';
import { format, addMinutes } from 'date-fns';
import API_URL from '../../../config';

const getCurrentTimestampIST = () => {
    const now = new Date();
    const istOffset = 330; // IST is UTC +5:30
    const istTime = addMinutes(now, istOffset - now.getTimezoneOffset());
    return format(istTime, 'MMM dd, yyyy hh:mm:ss a');
};


const DashboardCards = ({ village_id, line_id }) => {
    const currentTimestampIST = getCurrentTimestampIST();

    const [rowData, setRowData] = useState();



    useEffect(() => {
        fetchx(API_URL + "/getVillageConsumption?village_id=" + village_id + '&line_id=' + line_id)
        // fetchx("http://172.104.244.42:14012/v9/getVillageConsumption?village_id=" + village_id + '&line_id=' + line_id)
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);

            });
    }, []);





    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: '20px', width: '360px' }}>
            <Card style={{ backgroundColor: '#4c9ff0', color: '#fff', width: '250px', height: '150px', borderRadius: '10px', marginRight: '10px' }}>
                <CardBody style={{ marginTop: '2px' }}>
                    <CardText style={{ fontSize: '1.1em', fontWeight: 'bold', marginTop: '-10px' }}>Overall Electricity Consumption</CardText>
                    <CardText style={{ fontSize: '1.8em', fontWeight: 'bold', marginTop: '-10px' }}>{rowData && (rowData.total_water_supplied  || "NA")} KWh</CardText>
                    <CardText style={{marginTop:'-10px',fontSize:'12px'}}>Last Updated</CardText>   
          <CardText style={{marginTop:'-20px',fontSize:'10px'}}>{currentTimestampIST}</CardText>
                </CardBody>
            </Card>
            <Card style={{ backgroundColor: '#7f48dd', color: '#fff', width: '250px', height: '150px', borderRadius: '10px' }}>
                <CardBody>
                    <CardText style={{ fontSize: '1.1em', fontWeight: 'bold', marginTop: '-10px' }}>Overall Water Supplied</CardText>
                    <CardText style={{ fontSize: '1.8em', fontWeight: 'bold', marginTop: '2px' }}>{rowData && (rowData.total_energy_supplied  || "NA")} Ltr</CardText>
                    <CardText style={{marginTop:'-10px',fontSize:'12px'}}>Last Updated</CardText>
          <CardText style={{marginTop:'-20px',fontSize:'10px'}}>{currentTimestampIST}</CardText>
                </CardBody>
            </Card>
        </div>
    );
};
export default DashboardCards;