import axios from "axios";
import { Col, Input, Row } from "reactstrap";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Loader from "../rdprDashboard/Loader";


const ComparingReport = () => {
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef()
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // default: current month
    });

    const columnDefs = [
        { headerName: 'Node ID', field: 'node_id', sortable: true, filter: true, maxWidth: 110 },
        { headerName: 'RR No', field: 'rr_no', maxWidth: 100 },
        { headerName: 'Taluk', field: 'taluk', maxWidth: 140 },
        { headerName: 'Village', field: 'village', maxWidth: 140 },
        { headerName: 'GP Name', field: 'GPName', maxWidth: 140 },
        { headerName: 'Month', field: 'bill_month', maxWidth: 120 },
        // { headerName: 'Energy (kWh)', field: 'monthly_kWh' },
        {
            headerName: 'Energy (kWh)', field: 'monthly_kWh', maxWidth: 140, sort: 'desc'
            , valueGetter: (params) => {
                const value = params.data.monthly_kWh;
                if (value === undefined || value === null) return null;
                return Number(value) / 1000; // return number for sorting
            },
            valueFormatter: (params) => {
                if (params.value === undefined || params.value === null) return '0';
                return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
            }
        },
        {
            headerName: 'Previous-Year', field: 'water_consumption', maxWidth: 140, valueFormatter: (params) => {
                if (params.value === undefined || params.value === null) return '';
                return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
            }
        },
        { headerName: 'PF', field: 'PF', maxWidth: 90 },
        {
            headerName: 'Population', field: 'population', maxWidth: 140, valueFormatter: (params) => {
                if (params.value === undefined || params.value === null) return '';
                return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
            }
        },
        {
            headerName: 'Pump Power', field: 'pumpHB', maxWidth: 140
        },
        // {
        //     headerName: 'Mdwimp', field: 'mdwimp', maxWidth: 120, valueFormatter: (params) => {
        //         if (params.value === undefined || params.value === null) return '';
        //         return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
        //     }
        // },
        // {
        //     headerName: 'Mdvaimp', field: 'mdvaimp', maxWidth: 120, valueFormatter: (params) => {
        //         if (params.value === undefined || params.value === null) return '';
        //         return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
        //     }
        // },


    ];

    const fetchData = useCallback(async (selectedMonth) => {
        try {
            const response = await fetch(`https://testpms.ms-tech.in/v15/getBillingForCompare?month=${selectedMonth}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRowData(data.data || []); // fallback to empty array if data.data is undefined
        } catch (err) {
            console.error('Failed to load data:', err);
            setRowData([]); // optionally clear table on error
        }
    }, []);


    useEffect(() => {
        fetchData(month);
    }, [month, fetchData]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] }
    }), [])

    const onGridReady = (params) => {
        gridRef.current = params.api
    }
    const handleCellRightClick = (event) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) return;

        event.event.preventDefault(); // Prevent browser context menu
        const now = Date.now()
        const delta = now - lastRightClickRef.current
        lastRightClickRef.current = now
        if (delta < 400) {
            const nodeId = event.data?.node_id;
            if (nodeId) {
                // navigate('/dashboard/energymeter/nodeId', {
                //   state: { node_id: nodeId }
                // });
            }
        }
    };
    return (
        <>
            <h1>Comparing Report </h1>
            <Row className="mb-3">
                <Col md="4">
                    <label>Filter by Month</label>
                    <Input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />
                </Col>
            </Row>
            <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
                {rowData.length > 0 ? (
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        animateRows
                        rowSelection="multiple"
                        pagination
                        paginationPageSize={12}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        onCellContextMenu={handleCellRightClick}
                    />
                ) : <><div className="ag-theme-alpine" style={{ height: '14px', width: '100%' }}>
                    <Loader />
                </div></>}
            </div>
        </>
    )
}

export default ComparingReport;