// ** Custom Components
import Timeline from '@components/timeline'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'
import { useState, useEffect, useRef, useMemo } from 'react';
import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg'
import PapulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg'
// ** Data
import API_URL from '../../../config';

const UserTimeline = ({ village_id,line_id,village_name }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchx(API_URL + "/getVillageinfo?village_id=" + village_id + '&line_id=' + line_id)
        // fetchx("http://172.104.244.42:14012/v9/getVillageinfo?village_id=" + village_id + '&line_id=' + line_id)
            .then((result) => result.json())
            .then((rowData) => {
                console.log(rowData)
                if (rowData.statusCode === 200) {
                    setData(rowData.data);
                }
            });
    }, [village_id,line_id]);



    return (
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '360px', marginLeft: '20px',marginTop:'30px', border: '2px solid #dbdbdb', borderRadius: '8px', padding: '10px'  }}>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            <div style={{ textAlign: 'center' }}>
                <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px' }}>
                {village_name} Data
                </CardHeader>
                <div style={{ textAlign: 'left' }}>
                    <CardText style={{ marginTop: '-8px', color: '#8392a5', fontSize: '10px', fontWeight: 'bold', textAlign: 'left', marginLeft: '22px' }}>
                    {/* Total {data.length>0 ? data[2]['total_villages'] : "NA"} Villages */}
                    </CardText>
                </div>
            </div>


            <CardBody>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>

                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae' }}>Population</div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>{data.length>0 ? data[0]['total_population'] : "NA"}</div>

                        {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2&& rowData2[0].total_energy_supply_sum}kwh</div> */}
                    </div>
                    <img src={PapulationIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>

        

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>

                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae', mariginTop: '-100px' }}>Mini Tank</div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>{data.length>0 ? data[0]['asset_count'] : "NA"}</div>

                        {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2&& rowData2[0].total_energy_supply_sum}kwh</div> */}
                    </div>
                    <img src={ConnectionIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>



                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>

                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae', mariginTop: '-100px' }}>Pump</div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>{data.length>1 ? data[1]['asset_count'] : "NA"}</div>

                        {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2&& rowData2[0].total_energy_supply_sum}kwh</div> */}
                    </div>
                    <img src={ConnectionIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div>



                {/* <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>

                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae', mariginTop: '-100px' }}>Total Water Meter</div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>{data.length>0 ? data[2]['asset_count'] : "NA"}</div>

           
                    </div>
                    <img src={ConnectionIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div> */}



                {/* <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>

                    <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae', mariginTop: '-100px' }}>Total Energy Meter</div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>{data.length>0 ? data[2]['asset_count'] : "NA"}</div>


                    </div>
                    <img src={ConnectionIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
                </div> */}

            </CardBody>
        </Card>
    )
}

export default UserTimeline
