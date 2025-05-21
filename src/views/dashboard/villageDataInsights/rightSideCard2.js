
// // ** Reactstrap Imports
// import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'
// import { useState, useEffect, useRef, useMemo } from 'react';
// import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg'
// import PapulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg'
// // ** Data
// import API_URL from '../../../config';

// const UserTimeline = ({ village_id }) => {

//     const [data, setData] = useState([]);

//     useEffect(() => {
//         fetchx(API_URL + "/getVillageInfoOversight?village_id=" + village_id)
//             // fetchx("http://172.104.244.42:14012/v9/getTalukinfo?taluk_id=" + selectedTaluk.value)
//             .then((result) => result.json())
//             .then((rowData) => {
//                 console.log(rowData)
//                 if (rowData.statusCode === 200) {
//                     setData(rowData.data);
//                 }
//             });
//         // }, [selectedTaluk.value]);
//     }, [village_id]);



//     return (
        // <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '300px', height: '400px' }}>
        //     {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
        //     <div style={{ textAlign: 'center' }}>
        //         <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px' }}>
        //             {/* {selectedTaluk.label}  */}
        //             Village Stats
        //         </CardHeader>
        //         <div style={{ textAlign: 'left' }}>
        //             <CardText style={{ marginTop: '-8px', color: '#8392a5', fontSize: '10px', fontWeight: 'bold', textAlign: 'left', marginLeft: '22px' }}>
        //                 {/* Total {data.length > 0 ? data[0]['total_villages'] : "NA"} Villages */}
        //             </CardText>
        //         </div>
        //     </div>


            // <CardBody>

            //     {/* {data.map((item, index) => (
            //     <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
            //         <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
            //             <div style={{ fontWeight: 'bold', fontSize: '14px', alignItems: 'flex-start', color: '#8094ae' }}>
            //                 {item.asset_type ? item.asset_type.replace(/_/g, ' ') : 'Population'}
            //             </div>
            //             <div style={{ fontWeight: 'bold', fontSize: '20px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
            //                 {item.asset_type ? item.asset_count : item.total_population}
            //             </div>
            //         </div>
            //         <img src={item.asset_type ? ConnectionIcon : PapulationIcon} style={{ width: '55px', height: '55px' }} alt="Icon" />
            //     </div>
            // ))} */}

            //     {data.map((item, index) => (
            //         <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
            //             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
            //                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start', color: '#8094ae' }}>
            //                     {item.asset_type ? item.asset_type.replace(/_/g, ' ') : 'Population'}
            //                 </div>
            //                 <div style={{ fontWeight: 'bold', fontSize: '16px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
            //                     {item.asset_type ? (item.asset_count !== undefined ? item.asset_count : "NA") : (item.total_population !== undefined ? item.total_population : "NA")}
            //                 </div>
            //             </div>
            //             <img src={item.asset_type ? ConnectionIcon : PapulationIcon} style={{ width: '46px', height: '46px' }} alt="Icon" />
            //         </div>
            //     ))}
            //     <div>
            //         <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
            //             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
            //                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start', color: '#8094ae' }}>
            //                     Count
            //                 </div>
            //                 <div style={{ fontWeight: 'bold', fontSize: '16px', alignItems: 'flex-end', marginTop: '2px', color: '#001737' }}>
            //                     {data.length > 0 && data[0].asset_count !== undefined ? data[0].asset_count : "NA"}
            //                 </div>
            //             </div>
            //             <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Icon" />
            //         </div>
            //     </div>


        //     </CardBody>
//         </Card>
//     )
// }

// export default UserTimeline









// import React, { useState, useEffect } from 'react';
// // ** Reactstrap Imports
// import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
// import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg';
// import PopulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg';
// // ** Data
// import API_URL from '../../../config';

// const UserTimeline = ({ village_id }) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         fetch(API_URL + "/getVillageInfoOversight?village_id=" + village_id)
//             .then((result) => result.json())
//             .then((rowData) => {
//                 if (rowData.statusCode === 200) {
//                     setData(rowData.data);
//                 }
//             });
//     }, [village_id]);

//     // Calculate total counts and averages
//     const totalCounts = data.reduce((acc, item) => {
//         if (item.asset_type) {
//             acc[item.asset_type] = (acc[item.asset_type] || 0) + item.asset_count;
//         }
//         return acc;
//     }, {});

//     const totalPopulation = data.length > 0 ? data[0].total_population : "NA";
//     const avgTotalWaterSupply = (data.reduce((acc, item) => acc + item.avg_total_water_supply, 0) / data.length).toFixed(2);
//     const avgTotalEnergySupply = (data.reduce((acc, item) => acc + item.avg_total_energy_supply, 0) / data.length).toFixed(2);

//     return (
//         <Card style={{ width: '800px', padding: '20px' }}>
//             <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '20px' }}>
//                 Village Stats
//             </CardHeader>
//             <CardBody>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Population</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalPopulation}</CardText>
//                         <img src={PopulationIcon} style={{ width: '40px', height: '40px' }} alt="Population Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Total Water Meter</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalCounts['Water Meter'] || 0}</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Connection Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Total Pump</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalCounts['Pump'] || 0}</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Pump Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Total Energy Meter</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalCounts['Energy Meter'] || 0}</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Energy Meter Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Total Mini Tank</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalCounts['Mini Tank'] || 0}</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Mini Tank Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Total Valve</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{totalCounts['Valve'] || 0}</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Valve Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Avg Water Supply/Week</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{avgTotalWaterSupply}m³</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Avg Water Supply Icon" />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%', marginBottom: '20px' }}>
//                         <CardText style={{ fontSize: '14px', color: '#8094ae' }}>Avg Electricity Consumption/Week</CardText>
//                         <CardText style={{ fontSize: '20px', fontWeight: 'bold', color: '#001737' }}>{avgTotalEnergySupply}kWh</CardText>
//                         <img src={ConnectionIcon} style={{ width: '40px', height: '40px' }} alt="Avg Electricity Consumption Icon" />
//                     </div>
//                 </div>
//             </CardBody>
//         </Card>
//     );
// };

// export default UserTimeline;



// import React, { useState, useEffect } from 'react';
// // ** Reactstrap Imports
// import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
// import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg';
// import PopulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg';
// // ** Data
// import API_URL from '../../../config';

// const UserTimeline = ({ village_id }) => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         fetch(API_URL + "/getVillageInfoOversight?village_id=" + village_id)
//             .then((result) => result.json())
//             .then((rowData) => {
//                 if (rowData.statusCode === 200) {
//                     setData(rowData.data);
//                 }
//             });
//     }, [village_id]);

//     // Calculate total counts and averages
//     const totalCounts = data.reduce((acc, item) => {
//         if (item.asset_type) {
//             acc[item.asset_type] = (acc[item.asset_type] || 0) + item.asset_count;
//         }
//         return acc;
//     }, {});

//     const totalPopulation = data.length > 0 ? data[0].total_population : "NA";
//     const avgTotalWaterSupply = (data.reduce((acc, item) => acc + item.avg_total_water_supply, 0) / data.length).toFixed(2);
//     const avgTotalEnergySupply = (data.reduce((acc, item) => acc + item.avg_total_energy_supply, 0) / data.length).toFixed(2);

//     return (
//         <Card style={{ width: '800px', padding: '20px' }}>
//             <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '20px' }}>
//                 Village Stats
//             </CardHeader>
//             <CardBody>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '15px' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
//                                 Population
//                             </CardText>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
//                                 {totalPopulation}
//                             </CardText>
//                         </div>
//                         <img src={PopulationIcon} style={{ width: '46px', height: '46px' }} alt="Population Icon" />
//                     </div>
//                     {data.map((item, index) => (
//                         <div key={index} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '15px' }}>
//                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
//                                 <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
//                                     {item.asset_type ? item.asset_type.replace(/_/g, ' ') : 'Population'}
//                                 </CardText>
//                                 <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
//                                     {item.asset_type ? (item.asset_count !== undefined ? item.asset_count : "NA") : (item.total_population !== undefined ? item.total_population : "NA")}
//                                 </CardText>
//                             </div>
//                             <img src={item.asset_type ? ConnectionIcon : PopulationIcon} style={{ width: '46px', height: '46px' }} alt="Icon" />
//                         </div>
//                     ))}
//                     <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '15px' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
//                                 Avg Water Supply/Week
//                             </CardText>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
//                                 {avgTotalWaterSupply}m³
//                             </CardText>
//                         </div>
//                         <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Avg Water Supply Icon" />
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom: '15px' }}>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
//                                 Avg Electricity Consumption/Week
//                             </CardText>
//                             <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
//                                 {avgTotalEnergySupply}kWh
//                             </CardText>
//                         </div>
//                         <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Avg Electricity Consumption Icon" />
//                     </div>
//                 </div>
//             </CardBody>
//         </Card>
//     );
// };

// export default UserTimeline;



import React, { useState, useEffect } from 'react';
// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import ConnectionIcon from '@src/views/dashboard/controlPanel/icons/connection.svg';
import PopulationIcon from '@src/views/dashboard/controlPanel/icons/ppl.svg';
// ** Data
import API_URL from '../../../config';

const UserTimeline = ({ village_id }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(API_URL + "/getVillageInfoOversight?village_id=" + village_id)
            .then((result) => result.json())
            .then((rowData) => {
                if (rowData.statusCode === 200) {
                    setData(rowData.data);
                }
            });
    }, [village_id]);

    // Calculate total counts and averages
    const totalCounts = data.reduce((acc, item) => {
        if (item.asset_type) {
            acc[item.asset_type] = (acc[item.asset_type] || 0) + item.asset_count;
        }
        return acc;
    }, {});

    const totalPopulation = data.length > 0 ? data[0].total_population : "NA";
    const avgTotalWaterSupply = (data.reduce((acc, item) => acc + item.avg_total_water_supply, 0) / data.length).toFixed(2);
    const avgTotalEnergySupply = (data.reduce((acc, item) => acc + item.avg_total_energy_supply, 0) / data.length).toFixed(2);

    return (
        <Card style={{ width: '800px', padding: '10px' }}>
            <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '20px' }}>
                Village Stats
            </CardHeader>
            <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '45%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Population
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalPopulation}
                                </CardText>
                            </div>
                            <img src={PopulationIcon} style={{ width: '46px', height: '46px' }} alt="Population Icon" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Total Pump
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalCounts['Pump'] || 0}
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Pump Icon" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Total Mini Tank
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalCounts['Mini Tank'] || 0}
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Mini Tank Icon" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Total Valve
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalCounts['Valve'] || 0}
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Valve Icon" />
                        </div>
                      
                    </div>
                    <div style={{ width: '45%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Total Water Meter
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalCounts['Pump'] || 0}
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Connection Icon" />
                        </div>
                      
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Total Energy Meter
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {totalCounts['Pump'] || 0}
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Energy Meter Icon" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Avg Water Supply/Week
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {parseFloat(avgTotalWaterSupply).toFixed(2)}ltr
                                    {/* {typeof avgTotalWaterSupply === 'number' ? parseFloat(avgTotalWaterSupply).toFixed(2) + 'ltr' : 'N/A'} */}

                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Avg Water Supply Icon" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <CardText style={{ fontWeight: 'bold', fontSize: '12px', color: '#8094ae' }}>
                                    Avg Electricity Consumption/Week
                                </CardText>
                                <CardText style={{ fontWeight: 'bold', fontSize: '16px', color: '#001737', marginTop: '2px' }}>
                                    {parseFloat(avgTotalEnergySupply).toFixed(2)}kWh
                                </CardText>
                            </div>
                            <img src={ConnectionIcon} style={{ width: '46px', height: '46px' }} alt="Avg Electricity Consumption Icon" />
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default UserTimeline;
