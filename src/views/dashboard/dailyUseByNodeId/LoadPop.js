import { useEffect, useRef, useState, useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, Spinner, Table } from "reactstrap";
import API_URL from '../../../config';
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import moment from "moment";

const OverView = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const gridRef = useRef()
    const gridRef2 = useRef()
    const { node_id, date, GP, village, rr_no, pumpHp, population } = location.state || {};
    const [loadData, setLoadData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [billData, setBillData] = useState([]);
    const [waterSupplied, setWaterSupplied] = useState([]);
    const [waterData, setWaterData] = useState([]);
    const [instanData, setInstanData] = useState([]);
    const [connectId, setConnectionId] = useState(null)
    const [billingDetails, setBillingDetails] = useState([])

    const formatDateToComparable = (input) => {
        const d = new Date(input);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // no leading zeros
    };

    useEffect(() => {
        const fetchLoadData = async () => {
            if (!node_id) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/getMeterInfoDataNodeById?node_id=${node_id}`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                setLoadData(data.data.load || []);
                setBillData(data.data?.bill);

                const normalizeDate = (str) => {
                    const [datePart] = str.split(' ');
                    const [yyyy, mm, dd] = datePart.split('-');
                    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
                };

                const targetDate = normalizeDate(date);

                const instantaneous = data.data?.instantaneous?.filter(entry => {
                    return normalizeDate(entry.realtimeclock) === targetDate;
                });
                setInstanData(instantaneous)
                setError(null);
            } catch (err) {
                setError(err.message);
                setLoadData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLoadData();
    }, [node_id]);
    useEffect(() => {
        const fetchWaterData = async () => {
            if (!node_id || !date) return;
            const formattedDate = new Date(date).toISOString().split('T')[0];
            try {
                const res = await fetch(`${API_URL}/getLiveWaterDataByNodeId?node_id=${node_id}&date=${formattedDate}`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                setWaterData(data.data)
            } catch (err) {
                console.log(err)
            }
        };

        fetchWaterData();
    }, [node_id, date])
    const [tankDetails, setTankDetails] = useState([])
    useEffect(() => {
        const fetchTankDetails = async () => {
            if (!node_id) return;
            try {
                const res = await fetch(`${API_URL}/getTankNodes?node_id=${node_id}`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                setTankDetails(data.data);
            } catch (err) {
                console.log(err)
            }

        }
        fetchTankDetails()
    }, [node_id])
    useEffect(() => {
        if (!date || loadData.length === 0) {
            setFilteredData([]);
            return;
        } else {
            const targetDate = formatDateToComparable(date);
            const result = loadData.filter((row) => {
                const rowDatePart = row.blockdatetime?.split(' ')[0];
                return rowDatePart === targetDate;
            });
            setFilteredData(result);
        }


    }, [date, loadData]);
    const CustomHeader = (props) => {
        return (
            <span dangerouslySetInnerHTML={{ __html: props.displayName }} />
        );
    };
    const columnDefs = useMemo(() => [

        {
            headerName: 'Date', field: 'blockdatetime', maxWidth: 156,
            // valueFormatter: (params) =>
            //     params.data.blockdatetime
            //         ? moment(params.data.blockdatetime).format('MMM-DD-YYYY HH:MM')  // Format date and time
            //         : 'N/A'  // Fallback in case of missing value
        },
        {
            headerName: 'Kwh', field: 'blockwhimp', maxWidth: 98, valueFormatter: params => {
                const formatted = Math.abs(params.value / 1000).toFixed(2);
                return new Intl.NumberFormat('en-US').format(formatted);
            }, comparator: (a, b) => Math.abs(a) - Math.abs(b)
        },
        {
            headerName: 'Vᵣ', // proper Unicode subscript r
            field: 'Ravgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Vᵧ', // closest to subscript y (actually subscript gamma)
            field: 'Yavgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'V<sub>B</sub>', // closest to subscript b (actually subscript beta)
            field: 'Bavgvoltage',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iᵣ',
            field: 'Ravgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iᵧ',
            field: 'Yavgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'I<sub>B</sub>',
            field: 'Bavgcurrent',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'PowerFactor', field: 'averagePowerFactor', maxWidth: 158, valueFormatter: params => {

                return params.value;
            }
        },


    ], [navigate])
    const columnDefs2 = useMemo(() => [
        { headerName: 'Bill No', field: 'Billno', maxWidth: 160 },
        { headerName: 'Connection ID', field: 'Connectionid', maxWidth: 150 },
        {
            headerName: 'Billing Date',
            field: 'MonthId',
            maxWidth: 180,
            valueFormatter: (params) => {
                const year = params.data?.YearOfBill;
                const month = params.data?.MonthId;
                return year && month ? moment(`${year}-${month}-01`).format('MMM-YYYY') : '';
            }
        },
        {
            headerName: 'Status',
            field: 'Status',
            maxWidth: 100,
            cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Meter Reading',
            field: 'MeterReading',
            maxWidth: 180,
            cellStyle: { textAlign: 'center' },
            valueFormatter: params => new Intl.NumberFormat('en-US').format(params.value)
        },
        {
            headerName: 'Consumption (kWh)',
            field: 'Consumption',
            maxWidth: 180,
            cellStyle: { textAlign: 'center' },
            valueFormatter: params => new Intl.NumberFormat('en-US').format(params.value)
        },
        {
            headerName: 'Reason',
            field: 'ReasonDesc',
            maxWidth: 180,
            cellStyle: { textAlign: 'center' },
            valueFormatter: params => params.value === "0" ? 'Normal' : params.value
        }
    ], [navigate]);

    const onGridReady2 = params => {
        gridRef2.current = params.api
    }

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: { buttons: ["apply", "reset"] }
    }), [])

    const billRef = useRef();
    const instRef = useRef();
    const waterRef = useRef();
    const onGridReady = params => {
        gridRef.current = params.api
    }
    const onGridReadyWater = params => {
        gridRefWater.current = params.api
    }
    const onGridReadyBill = (params) => {
        billRef.current = params.api;
    };
    const onGridReadyInst = (params) => {
        instRef.current = params.api;
    }
    const columnDefsWater = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'datetime',
            maxWidth: 180, valueFormatter: (params) =>
                params.data.datetime
                    ? moment(params.data.datetime).format('MMM-DD-YYYY HH:MM')  // Format date and time
                    : 'N/A'  // Fallback in case of missing value

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
    ], [navigate])
    const columnDefsBill = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 250,
            valueFormatter: (params) => {
                return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
            }
        },
        {
            headerName: 'Billing Date',
            field: 'billingdate',
            maxWidth: 150,
            valueFormatter: (params) =>
                params.data.billingdate
                    ? moment(params.data.billingdate).format('MMM-DD-YYYY')  // Format date and time
                    : 'N/A'  // Fallback in case of missing value
        },

        // {
        //     headerName: 'cumwhimp', field: 'cumwhimp', maxWidth: 130, valueFormatter: (params) => {
        //         return params.value ? new Intl.NumberFormat('en-US').format(Number(params.value)?.toFixed(2)) : '';
        //     }
        // },
        {
            headerName: 'Kwh Consumption', field: 'cumKwhImp', maxWidth: 180, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format(Number(params.value / 1000)?.toFixed(2)) : '';
            }
        },

        {
            headerName: 'Kvah Consumption', field: 'cumvahimp', maxWidth: 155, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)
                ) : '';
            }
        },

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
    ], [navigate]);
    const columnDefsInst = useMemo(() => [
        {
            headerName: 'Frequency', field: 'frequency', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
        {
            headerName: 'Date time',
            field: 'realtimeclock',
            maxWidth: 250
            , valueFormatter: (params) => {
                return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
            }
        },
        {
            headerName: 'Kwh', field: 'cumwhimp', maxWidth: 120, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },
        {
            headerName: 'Billing Date',
            field: 'billingdate',
            maxWidth: 150,
            valueFormatter: (params) =>
                params.data.billingdate
                    ? moment(params.data.billingdate).format('MMM-DD-YYYY')  // Format date and time
                    : 'N/A'  // Fallback in case of missing value
        },
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
            headerName: 'Vᵦ', field: 'Bvoltage', maxWidth: 120, valueFormatter: (params) => {
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
            headerName: 'vah', field: 'cumvahimp', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

        {
            headerName: 'powerfailures', field: 'powerfailures', maxWidth: 125, valueFormatter: (params) => {
                return params.value ? Number(params.value)?.toFixed(2) : '';
            }
        },
    ], [navigate]);
    const workingMinutes = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return 0;

        // Sort ascending by datetime
        const sorted = [...filteredData].sort((a, b) => new Date(a.blockdatetime) - new Date(b.blockdatetime));
        let totalMinutes = 0;

        for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];

            const currentKwh = parseFloat(current.blockwhimp);
            const nextKwh = parseFloat(next.blockwhimp);

            if (currentKwh > 0 && nextKwh > 0) {
                const diff = moment(next.blockdatetime).diff(moment(current.blockdatetime), 'minutes');
                if (diff > 0) totalMinutes += diff;
            }
        }

        // Optionally add 15 min for the last record if it has kWh > 0 (assuming each block ~15 mins)
        const lastRecord = sorted[sorted.length - 1];
        if (lastRecord && parseFloat(lastRecord.blockwhimp) > 0) {
            totalMinutes += 15; // Or your known block duration
        }

        return totalMinutes;
    }, [filteredData]);
    const workingHours = useMemo(() => (workingMinutes / 60).toFixed(2), [workingMinutes]);



    const extractSessions = (data) => {
        if (!data || data.length === 0) return [];

        const sorted = [...data].sort((a, b) => new Date(a.blockdatetime) - new Date(b.blockdatetime));
        const sessions = [];
        let currentSession = [];
        let currentKwhSum = 0;

        for (let i = 0; i < sorted.length; i++) {
            const entry = sorted[i];
            const kwh = parseFloat(entry.blockwhimp);

            if (kwh > 0) {
                currentSession.push(entry);
                currentKwhSum += kwh;
            } else {
                if (currentSession.length > 0) {
                    // Add totalKwh to each entry in the session
                    currentSession = currentSession.map(e => ({ ...e, totalKwh: currentKwhSum }));

                    sessions.push(currentSession);
                    currentSession = [];
                    currentKwhSum = 0;
                }
            }
        }

        // Push last session if still collecting
        if (currentSession.length > 0) {
            currentSession = currentSession.map(e => ({ ...e, totalKwh: currentKwhSum }));
            sessions.push(currentSession);
        }

        return sessions;
    };

    const sessions = useMemo(() => extractSessions(filteredData), [filteredData]);

    useEffect(() => {
        if (!sessions.length || !node_id) {
            setWaterSupplied([]);
            return;
        }

        let isCancelled = false;

        const fetchWaterSupplied = async () => {
            try {
                const results = await Promise.all(
                    sessions.map(session => {
                        const startTime = session[0]?.blockdatetime;
                        const endTime = session[session.length - 1]?.blockdatetime;
                        return fetch(`${API_URL}/getDetails?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&nodeId=${node_id}`)
                            .then(res => res.json());
                    })
                );

                if (!isCancelled) {
                    // Extract data arrays and flatten them into one array
                    const waterData = results.flatMap(res => res.data);

                    setWaterSupplied(prevWaterSupplied => {

                        return waterData;
                    });
                }


            } catch (error) {
                console.error("Error fetching water supplied data:", error);
                if (!isCancelled) setWaterSupplied([]);
            }
        };

        fetchWaterSupplied();

        return () => {
            isCancelled = true;
        };
    }, [sessions, node_id]);


    useEffect(() => {
        const fetchConnection = async () => {
            const res = await fetch(API_URL + "/getrrNoAndConnectionMapp");
            const data = await res.json();
            const currentConnectionId = data.data.filter((data) => data.rr_no == rr_no);
            setConnectionId(currentConnectionId?.[0]?.con_id)
        }
        fetchConnection()
    }, [])

    useEffect(() => {

        if (connectId) {
            const fetchConnectionDetails = async () => {
                const res = await fetch(API_URL + `/getBillingDetailsWithConnectionId?con_id=${connectId}`);
                const data = await res.json();
                setBillingDetails(data.data)
            }
            fetchConnectionDetails()
        }
    }, [connectId])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Breadcrumb>
                <BreadcrumbItem active>
                    <Link
                        to={{
                            pathname: "/dashboard/rdprDashboard",
                        }}
                        state={{ node_id, GP }}
                    >
                        Dashboard
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <Link
                        to={{
                            pathname: "/dashboard/dailyUse/nodeId",
                        }}
                        state={{ node_id, GPName: GP, village_name: village, rr_no }}
                    >
                        NodeId
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active><a href="/dashboard/dailyUse/nodeId/date">date</a></BreadcrumbItem>
            </Breadcrumb>

            <div className="nodeDetails">
                <h2 style={{ marginTop: '20px', fontFamily: 'monospace', lineHeight: '1.6' }}>
                    <span style={{ fontWeight: 'bold' }}>RR NO:</span> {rr_no} |
                    <span style={{ fontWeight: 'bold' }}>GP Name:</span> {GP} |
                    <span style={{ fontWeight: 'bold' }}>Village:</span> {village} |
                    <span style={{ fontWeight: 'bold' }}>Population:</span> {population} |
                    <span style={{ fontWeight: 'bold' }}>pumpHp:</span> {pumpHp} |
                    <span style={{ fontWeight: 'bold' }}>Node:</span> {node_id} |
                    <span style={{ fontWeight: 'bold' }}>Connection ID:</span>{connectId ?? 0} |
                    {tankDetails && <><span style={{ fontWeight: 'bold' }}>Tank Node:</span>{tankDetails?.tank_node ?? 'Null'} |
                        <span style={{ fontWeight: 'bold' }}>Water Level:</span>{tankDetails?.water_level ?? 'Null'}</>}
                </h2>
                <p style={{
                    fontSize: '18px',
                    marginTop: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#f9f9f9',
                    borderLeft: '5px solid #27ae60',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    fontWeight: '500',
                    color: '#2c3e50'
                }}>
                    <strong>Working Time:</strong> {workingMinutes} minutes ({workingHours} hours)
                </p>

                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#f0f4f8',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Segoe UI, sans-serif',
                    marginBottom: '30px',
                    maxWidth: '96%'
                }}>
                    <h5 style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '15px',
                        borderBottom: '2px solid #3498db',
                        paddingBottom: '8px'
                    }}>
                        Start Session
                    </h5>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease'
                        }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2980b9'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#3498db'}
                        >
                            Read
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease'
                        }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e8449'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#27ae60'}
                        >
                            Start
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease'
                        }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                        >
                            Stop
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Segoe UI, sans-serif',
                    // maxWidth: '96%'
                }}>
                    <h5 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '15px',
                        borderBottom: '2px solid #3498db',
                        paddingBottom: '6px'
                    }}>
                        📅 <strong>Date:</strong> {date} &nbsp;&nbsp; ⚡ No Of Sessions: <span style={{ color: '#3498db' }}>{sessions.length}</span>
                    </h5>

                    <ul style={{
                        listStyleType: 'none',
                        paddingLeft: '0',
                        margin: '0'
                    }}>

                        {sessions.filter(session => session.length > 1).map((session, i) => (
                            <li
                                key={i}
                                style={{
                                    marginBottom: '12px',
                                    padding: '10px 14px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    fontSize: '16px'
                                }}
                            >
                                <span style={{ fontWeight: '500', color: '#34495e' }}>
                                    Session {i + 1}:
                                </span> &nbsp;
                                From <strong style={{ color: '#2c3e50' }}>
                                    {new Date(session[0].blockdatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                                &nbsp; to &nbsp;
                                <strong style={{ color: '#2c3e50' }}>
                                    {new Date(session[session.length - 1].blockdatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                                &nbsp; (
                                Duration :<span style={{ color: '#27ae60', fontWeight: '500' }}>
                                    {(() => {
                                        const start = new Date(session[0].blockdatetime);
                                        const end = new Date(session[session.length - 1].blockdatetime);
                                        const durationInMinutes = Math.round((end - start) / 60000);
                                        return `${durationInMinutes} min ,`;
                                    })()}
                                </span>&nbsp;
                                Water Supplied: <span style={{ color: '#2980b9' }}>
                                    {
                                        Number.isFinite(waterSupplied?.[i]?.consumedWater)
                                            ? waterSupplied[i].consumedWater.toFixed(2)
                                            : 'N/A'
                                    } liters ,

                                </span>
                                &nbsp;
                                Energy Consumption: <span style={{ color: '#2980b9  ' }}>
                                    {
                                        (session?.[0]?.totalKwh / 1000).toFixed(2)
                                    } Kwh,

                                </span>
                                &nbsp;
                                liters/kwh: <span style={{ color: '#2980b9  ' }}>
                                    {
                                        (waterSupplied?.[i]?.consumedWater / session?.[0]?.totalKwh).toFixed(2) * 1000
                                    } ,

                                </span>
                                )
                            </li>
                        ))}

                    </ul>
                </div>


                <h4 style={{ marginTop: '20px' }}>Load Data </h4>
                {loading && <Spinner color="primary" />}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && filteredData.length > 0 && (


                    <div className="ag-theme-alpine" style={{ height: '674px', width: '95%', marginTop: '20px' }}>
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
                        // onCellContextMenu={handleCellRightClick}
                        // onCellClicked={handleCellClick}
                        />
                    </div>

                )}
                {!loading && !error && filteredData.length === 0 && <p>No load data available for selected date.</p>}

                <h4 style={{ marginTop: '20px' }}>Water Data </h4>

                {waterData.length > 0 && (


                    <div className="ag-theme-alpine" style={{ height: '674px', width: '95%', marginTop: '20px' }}>
                        <AgGridReact
                            ref={waterRef}
                            rowData={waterData}
                            columnDefs={columnDefsWater}
                            animateRows
                            rowSelection="multiple"
                            pagination
                            paginationPageSize={12}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyWater}
                        // onCellContextMenu={handleCellRightClick}
                        // onCellClicked={handleCellClick}
                        />
                    </div>

                )}
                {waterData.length === 0 && <p>No Water data available for selected date.</p>}

                <h4 style={{ marginTop: '20px' }}>Instantanous Data </h4>

                {instanData.length > 0 && (


                    <div className="ag-theme-alpine" style={{ height: '674px', width: '95%', marginTop: '20px' }}>
                        <AgGridReact
                            ref={instRef}
                            rowData={instanData}
                            columnDefs={columnDefsInst}
                            animateRows
                            rowSelection="multiple"
                            pagination
                            paginationPageSize={12}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyInst}
                        // onCellContextMenu={handleCellRightClick}
                        // onCellClicked={handleCellClick}
                        />
                    </div>

                )}
                {instanData.length === 0 && <p>No instantaneous data available for selected date.</p>}

                <h4 style={{ marginTop: '20px' }}>Billing Data</h4>
                {billData.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '350px', width: '95%', marginTop: '20px' }}>
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

                <h3 style={{ marginTop: '20px', marginBottom: '20px' }}>Billing Details As Per BSCOM</h3>
                {/* AG Grid */}
                {billingDetails.length > 0 ? (
                    <div className="ag-theme-alpine" style={{ height: '674px', width: '95%' }}>
                        <AgGridReact
                            ref={gridRef2}
                            rowData={billingDetails}
                            columnDefs={columnDefs2}
                            animateRows
                            rowSelection="multiple"
                            pagination
                            paginationPageSize={10}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady2}
                        // onCellContextMenu={handleCellRightClick}
                        // onCellClicked={handleCellClick}
                        />
                    </div>
                ) : (
                    <div className="ag-theme-alpine" style={{ height: '674px', width: '70%' }}>
                        <p>No Data Found</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OverView;
