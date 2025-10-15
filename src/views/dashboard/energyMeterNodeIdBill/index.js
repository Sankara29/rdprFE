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
    const [commanData, setCommanData] = useState(null)
    const [loadData, setLoadData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [dailyLoad, setDailyLoad] = useState([]);
    const [billData, setBillData] = useState([]);
    const [instData, setInstData] = useState([])
    const location = useLocation();
    const { node_id } = location.state || {};
    // console.log(node_id)
    useEffect(() => {
        fetch(API_URL + `/getMeterInfoDataNodeById?node_id=${node_id}`)
            .then(res => res.json())
            .then(data => {
                if (data.statusCode === 200) {
                    console.log(data)
                    setInstData(data.data?.instantaneous);
                    setLoadData(data.data?.load)
                    setEventData(data.data?.event)
                    setBillData(data.data?.bill)
                    setDailyLoad(data.data?.daily)
                    const datas = {
                        meter_no: data?.data?.instantaneous?.[0]?.meterno,
                        node_id: data?.data?.instantaneous?.[0]?.gwid,
                        meter_phase: data?.data?.instantaneous?.[0]?.meterphase
                    }

                    setCommanData(datas)
                    // Initially show all data
                }
            });
    }, [node_id])




    const instRef = useRef();
    const loadRef = useRef();
    const billRef = useRef();
    const eventRef = useRef();
    const dailyRef = useRef();
    const CustomHeader = (props) => {
        return (
            <span dangerouslySetInnerHTML={{ __html: props.displayName }} />
        );
    };


    const columnDefsInst = useMemo(() => [
        {
            headerName: 'Frequency', field: 'frequency', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 250,
            valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '')
        },
        {
            headerName: 'Billing Date',
            field: 'billingdate',
            maxWidth: 150,
            valueFormatter: (params) => (params.data.billingdate ? dayjs(params.data.billingdate).format('MMM-DD-YYYY') : 'N/A')
        },
        {
            headerName: 'Vavgᵣ', field: 'Rvoltage', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Vavgᵧ', field: 'Yvoltage', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Vavgᵦ', field: 'Bvoltage', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Iᵣ', field: 'Rcurrent', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Iᵧ', field: 'Ycurrent', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Iᵦ', field: 'Bcurrent', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Kwh', field: 'cumwhimp', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

        {
            headerName: 'vah', field: 'cumvahimp', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

        {
            headerName: 'powerfailures', field: 'powerfailures', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
    ], []);

    const columnDefsLoad = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 250,
            valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '')
        },
        {
            headerName: 'Block Date',
            field: 'blockdatetime',
            maxWidth: 150,
            valueFormatter: (params) => (params.data.blockdatetime ? dayjs(params.data.blockdatetime).format('MMM-DD-YYYY HH:mm') : 'N/A')
        },
        {
            headerName: 'Vavgᵣ', // proper Unicode subscript r
            field: 'Ravgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Vavgᵧ', // closest to subscript y (actually subscript gamma)
            field: 'Yavgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Vavg<sub>B</sub>', // closest to subscript b (actually subscript beta)
            field: 'Bavgvoltage',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavgᵣ',
            field: 'Ravgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavgᵧ',
            field: 'Yavgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavg<sub>B</sub>',
            field: 'Bavgcurrent',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        }
        ,
        {
            headerName: 'Kwh', field: 'blockwhimp', maxWidth: 155, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

        {
            headerName: 'vah', field: 'blockvahimp', maxWidth: 155, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

    ], []);

    const columnDefsEvent = useMemo(() => [
        {
            headerName: 'Time_Of_Entery',
            field: 'timeofentry',
            maxWidth: 250,
            valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '')
        },
        {
            headerName: 'Event Time',
            field: 'eventtime',
            maxWidth: 150,
            valueFormatter: (params) => (params.data.eventtime ? dayjs(params.data.eventtime).format('MMM-DD-YYYY') : 'N/A')
        },
        { headerName: 'eventtype', field: 'eventtype', maxWidth: 135 },
        { headerName: 'eventID', field: 'eventID', maxWidth: 135 },
        {
            headerName: 'Vᵣ', field: 'Rvoltage', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Vᵧ', field: 'Yvoltage', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'V<sub>B</sub>', field: 'Bvoltage', maxWidth: 120, headerComponentFramework: CustomHeader, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Iᵣ', field: 'Rcurrent', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Iᵧ', field: 'Ycurrent', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'I<sub>B</sub>', field: 'Bcurrent', maxWidth: 120, headerComponentFramework: CustomHeader, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Rpf', field: 'Rpf', maxWidth: 135, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Ypf', field: 'Ypf', maxWidth: 135, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Bpf', field: 'Bpf', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Kwh', field: 'cumwhimp', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? (Number(params.value) / 1000)?.toFixed(2) : '';
            }
        },
    ], []);

    const columnDefsBill = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 250,
            valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '')
        },
        {
            headerName: 'Billing Date',
            field: 'billingdate',
            maxWidth: 150,
            valueFormatter: (params) => (params.data.billingdate ? dayjs(params.data.billingdate).format('MMM-DD-YYYY') : 'N/A')
        },

        // {
        //     headerName: 'cumwhimp', field: 'cumwhimp', maxWidth: 130, valueFormatter: (params) => {
        //         return params.value ? new Intl.NumberFormat('en-US').format(Number(params.value)?.toFixed(2)) : '';
        //     }
        // },
        {
            headerName: 'Kwh', field: 'cumKwhImp', maxWidth: 180, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format(Number(params.value)?.toFixed(2)) : '';
            }
        },
        // {
        //     headerName: 'cumwhexp', field: 'cumwhexp', maxWidth: 130, valueFormatter: (params) => {
        //         return params.value ? Number(params.value)?.toFixed(2) : '';
        //     }
        // },
        {
            headerName: 'Vah', field: 'cumvahimp', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)
                ) : '';
            }
        },
        // {
        //     headerName: 'cumvahexp', field: 'cumvahexp', maxWidth: 125, valueFormatter: (params) => {
        //         return params.value ? Number(params.value)?.toFixed(2) : '';
        //     }
        // },
        {
            headerName: 'mdKwhimp(Kwh)', field: 'mdwimp', maxWidth: 185, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)
                ) : '';
            }
        },
        {
            headerName: 'mdvaimp', field: 'mdvaimp', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },
    ], []);
    //daily
    // {
    //     "id": 1959,
    //     "gwid": "NSGW800001",
    //     "meterno": "1416910",
    //     "meterphase": "3",
    //     "timeclock": "2024-7-23 0:0:00",
    //     "cumwhimp": "367017.0000",
    //     "cumvahimp": "367101.0000",
    //     "cumwhexp": "0.0000",
    //     "cumvahexp": "0.0000",
    //     "captureddatetime": "2024-10-24 12:10:02"
    // },
    const columnDefsDaily = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 250,
            valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '')
        },
        {
            headerName: 'Time clock',
            field: 'timeclock',
            maxWidth: 150,
            valueFormatter: (params) => (params.data.timeclock ? dayjs(params.data.timeclock).subtract(1, 'day').format('MMM-DD-YYYY') : 'N/A')
        },

        {
            headerName: 'Kwh', field: 'daily_whimp', maxWidth: 130, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)
                ) : '0';
            }
        },

        {
            headerName: 'Vah', field: 'daily_vahimp', maxWidth: 130, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)
                ) : '0';
            }
        },


    ], []);
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }), []);
    const onGridReadyInst = (params) => {
        instRef.current = params.api;
    };
    const onGridReadyLoad = (params) => {
        loadRef.current = params.api;
    };
    const onGridReadyEvent = (params) => {
        eventRef.current = params.api;
    };
    const onGridReadyBill = (params) => {
        billRef.current = params.api;
    };
    const onGridReadyDailyLoad = (params) => {
        dailyRef.current = params.api;
    };

    return (
        <>    <>

            <Breadcrumb>
                {/* <BreadcrumbItem>
                    <a href="/dashboard/rdprDashboard">
                        dashboard
                    </a>
                </BreadcrumbItem> */}
                <BreadcrumbItem active>
                    <a href="/dashboard/BillingReport">
                        Billing
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <a href="/dashboard/DlReport">
                        Dl report
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem >
                    <a href="/dashboard/Dl/energyByNodeId">
                        nodeId
                    </a>
                </BreadcrumbItem>

            </Breadcrumb>
        </>
            <h1>Meter Info</h1>
            <div className="nodeDetails">
                {commanData !== null && (
                    <Card
                        className="mb-3 p-3 pt-0 pb-0 shadow-sm"
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            height: '100px',         // Compact height
                            overflow: 'hidden'        // Ensures no extra space
                        }}
                    >
                        <CardBody
                            className="d-flex align-items-center"
                            style={{ padding: '0px' }}
                        >
                            <Row className="w-100">
                                <Col md="4" sm="6">
                                    <Label className="fw-bold" style={{ fontSize: '18px' }}>   {/* Increased font size */}
                                        Meter No:
                                    </Label>
                                    <p style={{ margin: '0px', fontSize: '16px', fontWeight: '500' }}>  {/* Increased size */}
                                        {commanData?.meter_no || 'N/A'}
                                    </p>
                                </Col>
                                <Col md="4" sm="6">
                                    <Label className="fw-bold" style={{ fontSize: '18px' }}>   {/* Increased font size */}
                                        Node ID:
                                    </Label>
                                    <p style={{ margin: '0px', fontSize: '16px', fontWeight: '500' }}>  {/* Increased size */}
                                        {commanData?.node_id || 'N/A'}
                                    </p>
                                </Col>
                                <Col md="4" sm="6">
                                    <Label className="fw-bold" style={{ fontSize: '18px' }}>   {/* Increased font size */}
                                        Meter Phase:
                                    </Label>
                                    <p style={{ margin: '0px', fontSize: '16px', fontWeight: '500' }}>  {/* Increased size */}
                                        {commanData?.meter_phase || 'N/A'}
                                    </p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                )}
                <h2 style={{ marginTop: '20px' }}>Billing Data</h2>
                {billData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                        <AgGridReact
                            ref={billRef}
                            rowData={billData}
                            columnDefs={columnDefsBill}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={5}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyBill}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}
                <h2 style={{ marginTop: '20px' }}>Load Data</h2>
                {loadData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '550px', width: '100%' }}>
                        <AgGridReact
                            ref={loadRef}
                            rowData={loadData}
                            columnDefs={columnDefsLoad}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={50}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyLoad}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}
                <h2 style={{ marginTop: '20px' }}>Daily Load Data</h2>
                {dailyLoad.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                        <AgGridReact
                            ref={billRef}
                            rowData={dailyLoad}
                            columnDefs={columnDefsDaily}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={5}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyDailyLoad}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}

                <h2 style={{ marginTop: '20px' }}>Instantaneous Data</h2>
                {instData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                        <AgGridReact
                            ref={instRef}
                            rowData={instData}
                            columnDefs={columnDefsInst}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={5}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyInst}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}



                <h2 style={{ marginTop: '20px' }}>Events Data</h2>
                {eventData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '350px', width: '100%' }}>
                        <AgGridReact
                            ref={eventRef}
                            rowData={eventData}
                            columnDefs={columnDefsEvent}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={5}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyEvent}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}


            </div>
        </>)
}

export default OverView;