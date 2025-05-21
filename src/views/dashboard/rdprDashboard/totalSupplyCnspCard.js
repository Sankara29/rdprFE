// // Overview.js
// import React from 'react';
// import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
// import { useState, useEffect, useRef, useMemo } from 'react';
// import TotalConspIcon from '@src/views/dashboard/rdprDashboard/mainIcons/icon_bar.svg'
// import TotalConspPinkIcon from '@src/views/dashboard/rdprDashboard/mainIcons/div.sc-liHMlC.svg'
// // Import ag-grid
// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// import API_URL from '../../../config';
// import { format } from "date-fns";

// const TotalSupplyConsumption = () => {
//     let Today = format(new Date(), 'yyyy-MM-dd')
//     console.log(Today)
//     // const [data, setData] = useState(null);
//     const gridRef = useRef();
//     const [rowData, setRowData] = useState();
//     const [rowData2, setRowData2] = useState();

//     useEffect(() => {
//         fetchx(API_URL + "/getTotalComsumption?date=" + Today)
//             // fetchx("http://172.104.244.42:14012/v9/getTotalComsumption?date="+Today)
//             .then((result) => result.json())
//             .then((rowData) => {
//                 // setRowData(rowData["data"]);
//                 setRowData(rowData.data.districtData);
//                 setRowData2(rowData.data.totalConsumption);
//                 console.log(rowData)
//             });


//     }, []);



//     function formatValue(value) {
//         if (value === null || value === undefined || value === '') {
//             return '0.00'; // or any placeholder you prefer
//         }
//         return parseFloat(value).toFixed(2);
//     }



//     const [columnDefs, setColumnDefs] = useState([

//         { headerName: 'DISTRICT', field: 'district_name', maxWidth: 130 },
//         {
//             headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 190,
//             valueGetter: (params) => {
//                 if (params.data && params.data.total_energy_supply_sum === null) {
//                     return `${0}`;
//                 }
//                 console.log("Asterisk not added");
//                 return params.data.total_energy_supply_sum;
//             },

//             valueFormatter: params => formatValue(params.value)
//         },
//         {
//             headerName: 'WATER SUPPLIED(m³)', field: 'total_water_supply_sum', maxWidth: 190,
//             valueGetter: (params) => {
//                 if (params.data && params.data.total_water_supply_sum === null) {
//                     return `${0}`;
//                 }
//                 console.log("Asterisk not added");
//                 return params.data.total_water_supply_sum;
//             }
//             , valueFormatter: params => formatValue(params.value)
//         },
//         { headerName: 'TOTAL VILLAGE', field: 'village_count', maxWidth: 160 },
//         { headerName: 'TOTAL TANK', field: 'node_count', maxWidth: 150 },

//     ]);


//     const defaultColDef = useMemo(() => ({
//         sortable: true,
//         filter: true,
//         filterParams: {
//             buttons: ["apply", "reset"],
//         },
//     }));



//     return (
//         <div className="p-0">


//             <Card style={{ width: '118%', paddingRight: '10px' }}>
//                 <CardBody>
//                     <CardTitle style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px' }}>Today’s Supply and Consumption(All District)
//                         <p style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>Energy and Water Statistics</p>
//                     </CardTitle>
//                     <CardTitle style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
//                         <div style={{ display: 'flex' }}>

//                             <img src={TotalConspIcon} style={{ width: '50px', height: '50px' }} alt="Icon" />
//                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
//                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>ELECTRICITY CONSUMED</div>
//                                 {rowData2 && rowData2[0] !== undefined && console.log(rowData2[0].total_energy_supply_sum)}
//                                 {rowData2 && rowData2[0] !== undefined && <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_energy_supply_sum === null ? '0.00 ' : rowData2[0].total_energy_supply_sum.toFixed(2)}kwh</div>}
//                                 {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_energy_supply_sum.toFixed(2)}kwh</div> */}
//                             </div>

//                             <img src={TotalConspPinkIcon} style={{ width: '50px', height: '50px', fill: '#f87fba' }} color='primary' alt="Icons" />
//                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
//                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>WATER SUPPLIED</div>
//                                 {rowData2 && rowData2[0] !== undefined && <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_water_supply_sum === null ? '0.00' : rowData2[0].total_water_supply_sum.toFixed(2)} Liters</div>}
//                                 {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_water_supply_sum.toFixed(2)}Liters</div> */}
//                             </div>
//                         </div>
//                     </CardTitle>


//                     <div className="ag-theme-alpine" style={{ height: 300, borderRadius: '10px' }}>
//                         <AgGridReact

//                             ref={gridRef}
//                             rowData={rowData}
//                             columnDefs={columnDefs}
//                             animateRows={true}
//                             //   getRowStyle={getRowStyle}
//                             rowSelection="multiple"
//                             //   onCellClicked={cellClickedListener}
//                             paginationAutoPageSize="true"
//                             paginationPageSize="11"
//                             pagination="true"
//                             defaultColDef={defaultColDef}
//                             headerColor="ddw-primary"
//                         //   onGridReady={onGridReady}
//                         />
//                     </div>
//                 </CardBody>
//             </Card>

//         </div>
//     );
// };

// export default TotalSupplyConsumption;
// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useState, useEffect, useRef, useMemo } from 'react';
import TotalConspIcon from '@src/views/dashboard/rdprDashboard/mainIcons/icon_bar.svg'
import TotalConspPinkIcon from '@src/views/dashboard/rdprDashboard/mainIcons/div.sc-liHMlC.svg'
// Import ag-grid
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config';
import { format } from "date-fns";

const TotalSupplyConsumption = () => {
    let Today = format(new Date(), 'yyyy-MM-dd')
    console.log(Today)
    const [data, setData] = useState(null);
    const gridRef = useRef();
    const [rowData, setRowData] = useState();
    const [rowData2, setRowData2] = useState();

    useEffect(() => {
        fetchx(API_URL + "/getTodayConsumption")
            // fetchx("http://172.104.244.42:14012/v9/getTotalComsumption?date="+Today)
            .then((result) => result.json())
            .then((rowData) => {
                const totalEnergy = rowData?.data?.reduce(
                    (sum, item) => sum + parseFloat(item.energy_consumed || 0),
                    0
                );
                const totalWater = rowData?.data?.reduce(
                    (sum, item) => sum + parseFloat(item.water_consumed || 0),
                    0
                );

                const data = {
                    "total_energy": totalEnergy,
                    "total_water": totalWater,
                }

                setData(data)
                // setRowData(rowData["data"]);
                // setRowData(rowData.data.districtData);
                // setRowData2(rowData.data.totalConsumption);

            });


    }, []);



    function formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return '0.00'; // or any placeholder you prefer
        }
        return parseFloat(value).toFixed(2);
    }



    const [columnDefs, setColumnDefs] = useState([

        { headerName: 'Village', field: 'district_name', maxWidth: 130 },
        {
            headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 190,
            valueGetter: (params) => {
                if (params.data && params.data.total_energy_supply_sum === null) {
                    return `${0}`;
                }
                console.log("Asterisk not added");
                return params.data.total_energy_supply_sum;
            },

            valueFormatter: params => formatValue(params.value)
        },
        {
            headerName: 'WATER SUPPLIED(m³)', field: 'total_water_supply_sum', maxWidth: 190,
            valueGetter: (params) => {
                if (params.data && params.data.total_water_supply_sum === null) {
                    return `${0}`;
                }
                console.log("Asterisk not added");
                return params.data.total_water_supply_sum;
            }
            , valueFormatter: params => formatValue(params.value)
        },
        { headerName: 'TOTAL VILLAGE', field: 'village_count', maxWidth: 160 },
        { headerName: 'TOTAL TANK', field: 'node_count', maxWidth: 150 },

    ]);


    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));



    return (
        <div className="p-0">


            <Card style={{ width: '118%', paddingRight: '10px' }}>
                <CardBody>
                    <CardTitle style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px' }}>Today’s Supply and Consumption(All Village)
                        <p style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>Energy and Water Statistics</p>
                    </CardTitle>
                    <CardTitle style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                        <div style={{ display: 'flex' }}>

                            <img src={TotalConspIcon} style={{ width: '50px', height: '50px' }} alt="Icon" />
                            <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>ELECTRICITY CONSUMED</div>

                                {data && <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{(data.total_energy / 1000).toFixed(2)}kwh</div>}

                            </div>

                            <img src={TotalConspPinkIcon} style={{ width: '50px', height: '50px', fill: '#f87fba' }} color='primary' alt="Icons" />
                            <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>WATER SUPPLIED</div>
                                {data && <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{(data.total_water / 1000).toFixed(2)} m³</div>}
                                {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_water_supply_sum.toFixed(2)}Liters</div> */}
                            </div>
                        </div>
                    </CardTitle>


                    <div className="ag-theme-alpine" style={{ height: 300, borderRadius: '10px' }}>
                        <AgGridReact

                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            //   getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            //   onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="11"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        //   onGridReady={onGridReady}
                        />
                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default TotalSupplyConsumption;
