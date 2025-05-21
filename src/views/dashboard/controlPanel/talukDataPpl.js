// ** Custom Components
import Timeline from '@components/timeline'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'
import { useState, useEffect, useRef, useMemo } from 'react';
import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg'
import PapulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg'
// ** Data
import API_URL from '../../../config';

const UserTimeline = ({ selectedTaluk }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchx(API_URL + "/getTalukinfo?taluk_id=" + selectedTaluk.value)
        // fetchx("http://172.104.244.42:14012/v9/getTalukinfo?taluk_id=" + selectedTaluk.value)
            .then((result) => result.json())
            .then((rowData) => {
                console.log(rowData)
                if (rowData.statusCode === 200) {
                    setData(rowData.data);
                }
            });
    }, [selectedTaluk.value]);



    return (
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '360px', marginLeft: '-70px' }}>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            <div style={{ textAlign: 'center' }}>
                <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px' }}>
                    {selectedTaluk.label} Taluk Data
                </CardHeader>
                <div style={{ textAlign: 'left' }}>
                    <CardText style={{ marginTop: '-8px', color: '#8392a5', fontSize: '10px', fontWeight: 'bold', textAlign: 'left', marginLeft: '22px' }}>
                    Total {data.length>0 ? data[0]['total_villages'] : "NA"} Villages
                    </CardText>
                </div>
            </div>


            <CardBody>

            {/* {data.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae' }}>
                            {item.asset_type ? item.asset_type.replace(/_/g, ' ') : 'Population'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
                            {item.asset_type ? item.asset_count : item.total_population}
                        </div>
                    </div>
                    <img src={item.asset_type ? ConnectionIcon : PapulationIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>
            ))} */}

{data.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae' }}>
                            {item.asset_type ? item.asset_type.replace(/_/g, ' ') : 'Population'}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
                            {item.asset_type ? (item.asset_count !== undefined ? item.asset_count : "NA") : (item.total_population !== undefined ? item.total_population : "NA")}
                        </div>
                    </div>
                    <img src={item.asset_type ? ConnectionIcon : PapulationIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>
            ))}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae' }}>
                            Count
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
                            {data.length > 0 && data[0].asset_count !== undefined ? data[0].asset_count : "NA"}
                        </div>
                    </div>
                    <img src={ConnectionIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>
            </div>
            

            </CardBody>
        </Card>
    )
}

export default UserTimeline
