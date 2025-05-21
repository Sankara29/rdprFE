import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardTitle, Row, Col, Label, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import Chart from 'react-apexcharts'

import API_URL from '../../../config';
import Moment from "moment";
import FlowrateLineChart from "../../charts/lineChart";
const OverView = () => {
    // const [commanData, setCommanData] = useState(null)

    const [instData, setInstData] = useState([])
    const location = useLocation();
    const { node_id } = location.state || {};
    // console.log(node_id)
    useEffect(() => {
        fetch(API_URL + `/getLiveWaterDataByNodeId?node_id=${node_id}`)
            .then(res => res.json())
            .then(data => {
                if (data.statusCode === 200) {
                    console.log(data)
                    setInstData(data.data);

                }
            });
    }, [node_id])




    const instRef = useRef();


    const columnDefsInst = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'datetime',
            maxWidth: 180,

        },
        {
            headerName: 'live data(m³)', field: 'live_water_data', maxWidth: 135, valueGetter: (params) => {
                const value = params.data.live_water_data;
                if (value === undefined || value === null) return null;

                const formatted = (Number(value) / 1000).toFixed(2);
                return new Intl.NumberFormat('en-US').format(formatted);
            }
        },
        { headerName: 'flow rate', field: 'flowrate', maxWidth: 125 },
        { headerName: 'node_id', field: 'node_id', maxWidth: 125 },
        {
            headerName: 'rr_no', field: 'rr_no', maxWidth:
                125
        },
        { headerName: 'village', field: 'village', maxWidth: 150 },
        { headerName: 'taluk', field: 'taluk', maxWidth: 150 },
        { headerName: 'district', field: 'district', maxWidth: 125 },
        { headerName: 'GPName', field: 'GPName', maxWidth: 125 },




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

    // function filterSignificantFlowrates(data) {
    //     const sorted = [...data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    //     return sorted.filter((item, index, arr) => {
    //       const prev = arr[index - 1];
    //       const next = arr[index + 1];

    //       if (item.flowrate !== 0 && item.flowrate !== null) return true;

    //       // Keep 0s only if there's a change from or to non-zero
    //       const beforeWasNonZero = prev && prev.flowrate !== 0 && prev.flowrate !== null;
    //       const afterWillBeNonZero = next && next.flowrate !== 0 && next.flowrate !== null;

    //       return beforeWasNonZero || afterWillBeNonZero;
    //     });
    //   }

    // const sortedData =instData.length>0&& filterSignificantFlowrates(instData)

    //   const categories = instData.length>0&&sortedData.map(item => item.datetime);
    //   const flowrates = instData.length>0&&sortedData.map(item => item.flowrate);

    function computeEnergyUsage(data) {
        const sorted = [...data].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        return sorted.map((item, index) => {
            const prev = sorted[index - 1];
            const prevEnergy = prev ? parseFloat(prev.live_energy_data) : parseFloat(item.live_energy_data);
            const currEnergy = parseFloat(item.live_energy_data);

            return {
                datetime: item.datetime,
                flowrate: item.flowrate,
                live_energy_data: currEnergy,
                energy_used: +(currEnergy - prevEnergy).toFixed(3)
            };
        });
    }


    return (
        <>    <>

            <Breadcrumb>
                <BreadcrumbItem>
                    <a href="/dashboard/rdprDashboard">
                        dashboard
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <a href="/dashboard/watermeter">
                        watermeter
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <a href="/dashboard/watermeter/nodeId">
                        nodeId
                    </a>
                </BreadcrumbItem>

            </Breadcrumb>
        </>
            <div className="nodeDetails">


                <h2 style={{ marginTop: '20px' }}>waterMeter Data</h2>

                {/* <FlowrateLineChart   categories={categories} data={flowrates} /> */}
                {instData && instData.length > 0 && <FlowrateLineChart rawData={instData} />}
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



