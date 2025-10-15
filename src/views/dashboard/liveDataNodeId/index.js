import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardTitle, Row, Col, Label, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'


import API_URL from '../../../config';
import Moment from "moment";
import moment from "moment";
import dayjs from "dayjs";
const OverView = () => {
    // const [commanData, setCommanData] = useState(null)

    const [instData, setInstData] = useState([])
    const location = useLocation();
    const { node_id } = location.state || {};
    // console.log(node_id)
    useEffect(() => {
        fetch(API_URL + `/getLiveDataTempByNodeId?node_id=${node_id}`)
            .then(res => res.json())
            .then(data => {
                if (data.statusCode === 200) {
                    console.log(data)
                    setInstData(data.data);

                    // const datas = {
                    //     meter_no: data?.data?.instantaneous?.[0]?.meterno,
                    //     node_id: data?.data?.instantaneous?.[0]?.gwid,
                    //     meter_phase: data?.data?.instantaneous?.[0]?.meterphase
                    // }

                    // setCommanData(datas)
                    // Initially show all data
                }
            });
    }, [node_id])




    const instRef = useRef();

    // "id": 238,
    //             "village": "bailappanapalya",
    //             "taluk": "NELMANGALA",
    //             "district": "Bangalore",
    //             "GPName": "SHIVAGANGE",
    //             "rr_no": "TWP336",
    //             "datetime": "2025-04-18 05:53:49",
    //             "node_id": "NSRT000169",
    //             "energy_meter_number": "",
    //             "water_meter_number": null,
    //             "live_energy_data": "4143.034",
    //             "live_water_data": 19341.8,
    //             "motor_status": null,
    //             "flowrate": 0
    const columnDefsInst = useMemo(() => [
        { headerName: 'Id', field: 'id', maxWidth: 88 },
        // { headerName: 'Village Name', field: 'village', maxWidth: 300 },

        {
            headerName: 'Node Id', field: 'node_id', maxWidth: 120, valueGetter: params => {


                // If the difference is within the last 7 minutes, show the green dot
                if (params.data.flowrate > 0) {

                    // return `${params.data.node_id} 🟢`;
                    return `${params.data.node_id} `;
                } else {
                    // return `${params.data.node_id} 🔴`;
                    return `${params.data.node_id} `;
                }
            }
        }, {
            headerName: 'live water(m³)', field: 'live_water_data', maxWidth: 142, valueGetter: (params) => {
                const value = params.data.live_water_data;
                if (value === undefined || value === null) return null;

                const formatted = (Number(value) / 1000).toFixed(2);
                return new Intl.NumberFormat('en-US').format(formatted);
            }
        },
        {
            headerName: 'live energy(Kwh)',
            field: 'live_energy_data',
            maxWidth: 160, valueGetter: (params) => {
                const value = params.data.live_energy_data;
                if (value === undefined || value === null || value === 'Null') return null;

                const formatted = (Number(value)).toFixed(2);
                return new Intl.NumberFormat('en-US').format(formatted);
            }

        },
        { headerName: 'flow rate(m³/h)', field: 'flowrate', maxWidth: 158 },


        {
            headerName: 'lastSeen', field: 'datetime', maxWidth: 300, valueFormatter: (params) => {
                return params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '';
            }
        },




    ], []);


    const onGridReadyInst = (params) => {
        instRef.current = params.api;
    };
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }), []);

    return (
        <>    <>

            <Breadcrumb>
                {/* <BreadcrumbItem>
                    <a href="/dashboard/rdprDashboard">
                        dashboard
                    </a>
                </BreadcrumbItem> */}
                <BreadcrumbItem>
                    <a href="/dashboard/liveData">
                        OverAll Data
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <a href="/dashboard/liveData/nodeId">
                        nodeId
                    </a>
                </BreadcrumbItem>

            </Breadcrumb>
        </>
            <div className="nodeDetails">


                <h2 style={{ marginTop: '20px' }}>OverAll Data</h2>
                {instData && instData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '700px', width: '100%' }}>
                        <AgGridReact
                            ref={instRef}
                            rowData={instData}
                            columnDefs={columnDefsInst}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={20}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyInst}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}



            </div>
        </>)
}

export default OverView;