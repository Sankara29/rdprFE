// // // Overview.js
// // import React from 'react';
// // import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
// // import { useState, useEffect, useRef, useMemo } from 'react';
// // import TotalConspIcon from '@src/views/dashboard/rdprDashboard/mainIcons/icon_bar.svg'
// // import TotalConspPinkIcon from '@src/views/dashboard/rdprDashboard/mainIcons/div.sc-liHMlC.svg'
// // // Import ag-grid
// // import 'ag-grid-enterprise'
// // import { AgGridReact } from 'ag-grid-react'
// // import '/node_modules/ag-grid-community/styles/ag-grid.css'
// // import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
// // import API_URL from '../../../config';
// // import { format } from "date-fns";

// // const TotalSupplyConsumption = () => {
// //     let Today = format(new Date(), 'yyyy-MM-dd')
// //     console.log(Today)
// //     // const [data, setData] = useState(null);
// //     const gridRef = useRef();
// //     const [rowData, setRowData] = useState();
// //     const [rowData2, setRowData2] = useState();

// //     useEffect(() => {
// //         fetchx(API_URL + "/getTotalComsumption?date=" + Today)
// //             // fetchx("http://172.104.244.42:14012/v9/getTotalComsumption?date="+Today)
// //             .then((result) => result.json())
// //             .then((rowData) => {
// //                 // setRowData(rowData["data"]);
// //                 setRowData(rowData.data.districtData);
// //                 setRowData2(rowData.data.totalConsumption);
// //                 console.log(rowData)
// //             });


// //     }, []);



// //     function formatValue(value) {
// //         if (value === null || value === undefined || value === '') {
// //             return '0.00'; // or any placeholder you prefer
// //         }
// //         return parseFloat(value).toFixed(2);
// //     }



// //     const [columnDefs, setColumnDefs] = useState([

// //         { headerName: 'DISTRICT', field: 'district_name', maxWidth: 130 },
// //         {
// //             headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 190,
// //             valueGetter: (params) => {
// //                 if (params.data && params.data.total_energy_supply_sum === null) {
// //                     return `${0}`;
// //                 }
// //                 console.log("Asterisk not added");
// //                 return params.data.total_energy_supply_sum;
// //             },

// //             valueFormatter: params => formatValue(params.value)
// //         },
// //         {
// //             headerName: 'WATER SUPPLIED(m³)', field: 'total_water_supply_sum', maxWidth: 190,
// //             valueGetter: (params) => {
// //                 if (params.data && params.data.total_water_supply_sum === null) {
// //                     return `${0}`;
// //                 }
// //                 console.log("Asterisk not added");
// //                 return params.data.total_water_supply_sum;
// //             }
// //             , valueFormatter: params => formatValue(params.value)
// //         },
// //         { headerName: 'TOTAL VILLAGE', field: 'village_count', maxWidth: 160 },
// //         { headerName: 'TOTAL TANK', field: 'node_count', maxWidth: 150 },

// //     ]);


// //     const defaultColDef = useMemo(() => ({
// //         sortable: true,
// //         filter: true,
// //         filterParams: {
// //             buttons: ["apply", "reset"],
// //         },
// //     }));



// //     return (
// //         <div className="p-0">


// //             <Card style={{ width: '118%', paddingRight: '10px' }}>
// //                 <CardBody>
// //                     <CardTitle style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px' }}>Today’s Supply and Consumption(All District)
// //                         <p style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>Energy and Water Statistics</p>
// //                     </CardTitle>
// //                     <CardTitle style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
// //                         <div style={{ display: 'flex' }}>

// //                             <img src={TotalConspIcon} style={{ width: '50px', height: '50px' }} alt="Icon" />
// //                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
// //                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>ELECTRICITY CONSUMED</div>
// //                                 {rowData2 && rowData2[0] !== undefined && console.log(rowData2[0].total_energy_supply_sum)}
// //                                 {rowData2 && rowData2[0] !== undefined && <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_energy_supply_sum === null ? '0.00 ' : rowData2[0].total_energy_supply_sum.toFixed(2)}kwh</div>}
// //                                 {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_energy_supply_sum.toFixed(2)}kwh</div> */}
// //                             </div>

// //                             <img src={TotalConspPinkIcon} style={{ width: '50px', height: '50px', fill: '#f87fba' }} color='primary' alt="Icons" />
// //                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
// //                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>WATER SUPPLIED</div>
// //                                 {rowData2 && rowData2[0] !== undefined && <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_water_supply_sum === null ? '0.00' : rowData2[0].total_water_supply_sum.toFixed(2)} Liters</div>}
// //                                 {/* <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{rowData2 && rowData2[0].total_water_supply_sum.toFixed(2)}Liters</div> */}
// //                             </div>
// //                         </div>
// //                     </CardTitle>


// //                     <div className="ag-theme-alpine" style={{ height: 300, borderRadius: '10px' }}>
// //                         <AgGridReact

// //                             ref={gridRef}
// //                             rowData={rowData}
// //                             columnDefs={columnDefs}
// //                             animateRows={true}
// //                             //   getRowStyle={getRowStyle}
// //                             rowSelection="multiple"
// //                             //   onCellClicked={cellClickedListener}
// //                             paginationAutoPageSize="true"
// //                             paginationPageSize="11"
// //                             pagination="true"
// //                             defaultColDef={defaultColDef}
// //                             headerColor="ddw-primary"
// //                         //   onGridReady={onGridReady}
// //                         />
// //                     </div>
// //                 </CardBody>
// //             </Card>

// //         </div>
// //     );
// // };

// // export default TotalSupplyConsumption;
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
//     const [data, setData] = useState(null);
//     const gridRef = useRef();
//     const [rowData, setRowData] = useState();
//     const [rowData2, setRowData2] = useState();

//     useEffect(() => {
//         fetchx(API_URL + "/getTodayConsumption")
//             // fetchx("http://172.104.244.42:14012/v9/getTotalComsumption?date="+Today)
//             .then((result) => result.json())
//             .then((rowData) => {
//                 const totalEnergy = rowData?.data?.reduce(
//                     (sum, item) => sum + parseFloat(item.energy_consumed || 0),
//                     0
//                 );
//                 const totalWater = rowData?.data?.reduce(
//                     (sum, item) => sum + parseFloat(item.water_consumed || 0),
//                     0
//                 );

//                 const data = {
//                     "total_energy": totalEnergy,
//                     "total_water": totalWater,
//                 }

//                 setData(data)
//                 // setRowData(rowData["data"]);
//                 // setRowData(rowData.data.districtData);
//                 // setRowData2(rowData.data.totalConsumption);

//             });


//     }, []);



//     function formatValue(value) {
//         if (value === null || value === undefined || value === '') {
//             return '0.00'; // or any placeholder you prefer
//         }
//         return parseFloat(value).toFixed(2);
//     }



//     const [columnDefs, setColumnDefs] = useState([

//         { headerName: 'Village', field: 'district_name', maxWidth: 130 },
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
//                     <CardTitle style={{ color: '#001737', fontWeight: 'bold', fontSize: '16px' }}>Today’s Supply and Consumption(All Village)
//                         <p style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}>Energy and Water Statistics</p>
//                     </CardTitle>
//                     <CardTitle style={{ color: '#8392a5', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
//                         <div style={{ display: 'flex' }}>

//                             <img src={TotalConspIcon} style={{ width: '50px', height: '50px' }} alt="Icon" />
//                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
//                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>ELECTRICITY CONSUMED</div>

//                                 {data && <div style={{ fontWeight: 'bold', fontSize: '24px', alignSelf: 'flex-end', marginTop: '3px', color: '#001737' }}>{(data.total_energy / 1000).toFixed(2)}kwh</div>}

//                             </div>

//                             <img src={TotalConspPinkIcon} style={{ width: '50px', height: '50px', fill: '#f87fba' }} color='primary' alt="Icons" />
//                             <div style={{ paddingRight: '10px', paddingLeft: '10px' }}>
//                                 <div style={{ fontWeight: 'bold', fontSize: '12px', alignItems: 'flex-start' }}>WATER SUPPLIED</div>
//                                 {data && <div style={{ fontWeight: 'bold', fontSize: '24px', alignItems: 'flex-end', marginTop: '3px', color: '#001737' }}>{(data.total_water / 1000).toFixed(2)} m³</div>}
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


import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import {
    useState, useRef, useEffect, useMemo
} from 'react'
import {
    Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem,
    Card
} from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Info } from 'react-feather'
import moment from 'moment'
import API_URL from '../../../config'
import Select from 'react-select'

const TotalSupplyConsumption = () => {
    const navigate = useNavigate()
    const gridRef = useRef()
    const { control } = useForm()
    const location = useLocation();
    const { node_id, GP, village } = location.state || {};

    const [rowData, setRowData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [nodeIdFilter, setNodeIdFilter] = useState("")
    const [villageOptions, setVillageOptions] = useState([])
    const [gpNameOptions, setGpNameOptions] = useState([])

    const [selectedVillage, setSelectedVillage] = useState(null)
    const [selectedGPName, setSelectedGPName] = useState(null)


    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: { buttons: ["apply", "reset"] },
        wrapHeaderText: true, // for AG Grid Enterprise >= 27
        autoHeaderHeight: true
    }), [])

    const columnDefs = useMemo(() => [
        // { headerName: 'ID', field: 'id', maxWidth: 68 },

        { headerName: 'RR No', field: 'rr_no', maxWidth: 96 },
        {
            headerName: 'Node ID',
            field: 'node_id',
            maxWidth: 128,
            valueGetter: params => `${params.data.node_id}`
        },
        { headerName: 'Gram panchayat', field: 'GPName', maxWidth: 138 },

        { headerName: 'Village', field: 'village', maxWidth: 168 },
        {
            headerName: 'Date',
            field: 'date',
            maxWidth: 110,
            valueFormatter: params =>
                params.value ? moment(params.value).format('MMM-DD-YYYY') : ''
        },
        {
            headerName: 'Water Supplied (m³)',
            field: 'water_usage',
            maxWidth: 150,
            headerClass: 'wrap-header',
            cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
            valueFormatter: params =>
                new Intl.NumberFormat('en-US').format((Math.abs(params.value / 1000)).toFixed(2)),
            comparator: (a, b) => Math.abs(a) - Math.abs(b)
        },
        {
            headerName: 'Energy Consumed (kWh)',
            field: 'energy_usage',
            maxWidth: 150,
            headerClass: 'wrap-header',
            cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
            valueFormatter: params => {
                if (params.value == null) return 'N/A'
                return new Intl.NumberFormat('en-US').format(
                    parseFloat(params.value).toFixed(2)
                )
            },
            comparator: (a, b) => (a ?? 0) - (b ?? 0), sort: 'desc'
        },
        {
            headerName: 'Litres/kWh',
            field: 'litr_per_kwh', // You can use a dummy field if needed
            cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
            valueFormatter: params => {
                const waterUsage = params.data?.water_usage;
                const energyUsage = params.data?.energy_usage;

                if (waterUsage == null || energyUsage == null || energyUsage === 0) {
                    return '0';
                }

                const waterLitres = Math.abs(waterUsage); // Convert m³ to litres
                const ratio = waterLitres / Math.abs(energyUsage);

                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(ratio);
            },
            comparator: (a, b, nodeA, nodeB) => {
                const aRatio =
                    nodeA.data?.energy_usage && nodeA.data?.water_usage
                        ? (Math.abs(nodeA.data.water_usage) * 1000) / Math.abs(nodeA.data.energy_usage)
                        : 0;
                const bRatio =
                    nodeB.data?.energy_usage && nodeB.data?.water_usage
                        ? (Math.abs(nodeB.data.water_usage) * 1000) / Math.abs(nodeB.data.energy_usage)
                        : 0;
                return aRatio - bRatio;
            },
            maxWidth: 130,
        }
        ,
        {
            headerName: 'Pump Capacity', field: 'pumpHB', maxWidth: 108, valueFormatter: params => {
                if (params.data?.pumpHB == null) {
                    return 0;
                }
                return params.data?.pumpHB;
            }
        },

        // {
        //     headerName: 'More Info',
        //     maxWidth: 148,
        //     cellStyle: { textAlign: 'center', padding: 0 },
        //     cellRendererFramework: params => (
        //         <Button
        //             color="primary"
        //             style={{
        //                 width: '100%', height: '80%',
        //                 display: 'flex', alignItems: 'center', justifyContent: 'center'
        //             }}
        //             onClick={() => navigate('/dashboard/dailyUse/nodeId', {
        //                 state: { node_id: params.data.node_id }
        //             })}
        //         >
        //             <Info size={16} className="me-1" />
        //             More Info
        //         </Button>
        //     )
        // }
    ], [navigate])

    const onGridReady = params => {
        gridRef.current = params.api
    }

    const fetchData = async () => {
        try {
            const [waterRes, energyRes] = await Promise.all([
                fetch(API_URL + "/getDailyWaterUsage"),
                fetch("https://testpms.ms-tech.in/v15/getDlReport")
            ])

            const [waterData, energyData] = await Promise.all([
                waterRes.json(),
                energyRes.json()
            ])

            const unique = (arr, key) => [...new Map(arr.map(item => [item[key], item])).values()];
            if (waterData.statusCode === 200 && energyData.statusCode === 200) {
                const mergedData = waterData.data.map(waterEntry => {


                    const match = energyData.data.find(e =>
                        e.gwid == waterEntry.node_id &&
                        moment(e.timeclock).subtract(1, 'day').isSame(waterEntry.date, 'day')
                    )

                    return {
                        ...waterEntry,
                        energy_usage: match?.daily_whimp / 1000 ?? null
                    }
                })

                const sorted = mergedData.sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                )

                setRowData(sorted)
                setFilteredData(sorted)

                setVillageOptions(unique(sorted, 'village').map(v => ({
                    label: v.village,
                    value: v.village
                })))

                setGpNameOptions(unique(sorted, 'GPName').map(g => ({
                    label: g.GPName,
                    value: g.GPName
                })))

            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData()
        const intervalId = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const filtered = rowData.filter(item =>
            item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
        )
        setFilteredData(filtered)
    }, [nodeIdFilter, rowData])

    const nextPage = (event) => {
        const nodeId = event?.node_id
        const GP = event?.GPName
        const village = event?.village
        const rr_no = event?.rr_no
        const pumpHp = event?.pumpHB
        console.log(selectedGPName)
        if (nodeId) {
            navigate('/dashboard/dailyUse/nodeId', {
                state: { node_id: nodeId, GP: selectedGPName != null && selectedGPName?.value, village: selectedVillage != null && selectedVillage.value, rr_no, GPName: GP, village_name: village, pumpHp }
            })
        }
    }

    const handleCellRightClick = event => {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return
        event.event.preventDefault()

        nextPage(event.data)
    }
    const handleCellClick = (event) => {
        nextPage(event.data);
    };
    useEffect(() => {
        let filtered = [...rowData]

        if (nodeIdFilter.trim()) {
            filtered = filtered.filter(item =>
                item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
            )
        }

        if (selectedGPName) {
            filtered = filtered.filter(item => item.GPName === selectedGPName.value)
        }

        if (selectedVillage) {
            filtered = filtered.filter(item => item.village === selectedVillage.value)
        }

        setFilteredData(filtered)
    }, [nodeIdFilter, selectedGPName, selectedVillage, rowData])
    useEffect(() => {
        if (GP) {
            setSelectedGPName({ label: GP, value: GP })
        }
        if (village) {
            setSelectedVillage({ label: village, value: village })
        }
        // if (node_id) {
        //   setNodeIdFilter(node_id)
        // }
    }, [GP, village])
    useEffect(() => {
        if (selectedGPName && !village) {
            const villagesUnderGP = rowData
                .filter(item => item.GPName === selectedGPName.value)
                .map(v => ({ label: v.village, value: v.village }));

            // Remove duplicates
            const uniqueVillages = [...new Map(villagesUnderGP.map(item => [item.value, item])).values()];

            setVillageOptions(uniqueVillages);

            // Optional: reset selected village if it's not in the new list
            if (selectedVillage && !uniqueVillages.some(v => v.value === selectedVillage.value)) {
                setSelectedVillage(null);
            }
        } else {
            // If no GP selected, show all villages
            const allVillages = rowData.map(v => ({ label: v.village, value: v.village }));
            const uniqueVillages = [...new Map(allVillages.map(item => [item.value, item])).values()];
            setVillageOptions(uniqueVillages);
        }
    }, [selectedGPName, rowData, village]);

    return (
        <>
            {/* <Breadcrumb>
                 <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem> 
            <BreadcrumbItem active><a href="/dashboard/dailyUse">Daily Usage</a></BreadcrumbItem> 
            </Breadcrumb> */}
            <Card style={{ width: '118%', padding: '10px' }}>
                <h3>Daily Stats </h3>

                <Row className="mb-2">
                    <Col md='3'>
                        <Label>Filter by Node ID</Label>
                        <Input
                            type="text"
                            placeholder="Enter Node ID..."
                            value={nodeIdFilter}
                            onChange={e => setNodeIdFilter(e.target.value)}
                        />
                    </Col>
                    <Col md='3'>
                        <Label>Filter by GPName</Label>
                        <Select
                            isClearable
                            value={selectedGPName}
                            onChange={setSelectedGPName}
                            options={gpNameOptions}
                            classNamePrefix='select'
                            placeholder="Select GP Name"
                        />
                    </Col>

                    <Col md='3'>
                        <Label>Filter by Village</Label>
                        <Select
                            isClearable
                            value={selectedVillage}
                            onChange={setSelectedVillage}
                            options={villageOptions}
                            classNamePrefix='select'
                            placeholder="Select Village"
                        />
                    </Col>
                </Row>

                <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
                    {filteredData.length > 0 ? (
                        <AgGridReact
                            ref={gridRef}
                            rowData={filteredData}
                            columnDefs={columnDefs}
                            animateRows
                            rowSelection="multiple"
                            pagination
                            paginationPageSize={12}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            onCellContextMenu={handleCellRightClick}
                            onCellClicked={handleCellClick}
                        />
                    ) : (
                        <p>No Data Found</p>
                    )}
                </div>
            </Card>
        </>
    )
}

export default TotalSupplyConsumption

