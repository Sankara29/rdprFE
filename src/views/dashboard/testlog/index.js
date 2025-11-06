import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import Loader from '../rdprDashboard/Loader'

const API_KEY = 'uprtvubdxwyuhebwsnkrdirmfoqorkap'
const API_URL = 'https://testhotel2.prysmcable.com/v35/processLabTestLogs'

const OverView = () => {
    const navigate = useNavigate()
    const gridRef = useRef()
    const { control } = useForm({})

    const [rowData, setRowData] = useState([])
    const [filterRow, setFilterRow] = useState([])

    const [districtOptions, setDistrictOptions] = useState([])
    const [talukOptions, setTalukOptions] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedTaluk, setSelectedTaluk] = useState(null)
    const [nodeIdFilter, setNodeIdFilter] = useState("")

    const lastRightClickRef = useRef(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // --- Responsive handling ---
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columnDefs = useMemo(() => {
        const basicColumns = [{
            headerName: 'Node Id', field: 'node_id', maxWidth: 200,
            cellRendererFramework: (params) => (
                <span
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => navigate('/dashboard/energymeter/nodeId', { state: { node_id: params.data.node_id } })}
                    title="Click for more info"
                >
                    {params.data.node_id} {params.data.status === 'success' ? '🟢' : '🔴'}
                </span>
            )
        },
        { headerName: 'E1', field: 'e1', maxWidth: 120 },
        { headerName: 'E2', field: 'e2', maxWidth: 120 },

        { headerName: 'Water Supplied', field: 'water_supplied', maxWidth: 140 },
        { headerName: 'Energy Used', field: 'energy_used', maxWidth: 140 },
        {
            headerName: 'billing posted', field: 'status', maxWidth: 120,
            cellStyle: params => ({ color: params.value === 'success' ? 'green' : 'red', fontWeight: 'bold' })
        },
        { headerName: 'L1', field: 'l1', maxWidth: 120 },
        { headerName: 'L2', field: 'l2', maxWidth: 120 },
        { headerName: 'I1', field: 'i1', maxWidth: 120 },
        { headerName: 'I2', field: 'i2', maxWidth: 120 },

        ];
        let allColumns = [...basicColumns];

        if (screenWidth < 768) allColumns = allColumns.slice(0, 6); // responsive

        return allColumns;

    }, [navigate, screenWidth]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] }
    }), [])

    const onGridReady = (params) => {
        gridRef.current = params.api
    }

    // Fetch data from new API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(API_URL, {
                    method: 'GET',
                    headers: { 'x-api-key': API_KEY }
                })
                const data = await res.json()
                if (data.status === 'ok') {
                    const sortedData = data.data.sort((a, b) => {
                        // optional: sort by node_id or other metric
                        return a.node_id.localeCompare(b.node_id)
                    })
                    setRowData(sortedData)
                    setFilterRow(sortedData)
                }
            } catch (err) {
                console.error('Error fetching Lab Test Logs:', err)
            }
        }

        fetchData()
        const intervalId = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [])

    // Filter node_id search
    useEffect(() => {
        let filtered = [...rowData]
        if (nodeIdFilter) {
            filtered = filtered.filter(item =>
                item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
            )
        }
        setFilterRow(filtered)
    }, [nodeIdFilter, rowData])

    const handleCellRightClick = (event) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (isMobile) return
        event.event.preventDefault()
        const now = Date.now()
        const delta = now - lastRightClickRef.current
        lastRightClickRef.current = now
        if (delta < 400) {
            const nodeId = event.data?.node_id
            if (nodeId) {
                navigate('/dashboard/energymeter/nodeId', { state: { node_id: nodeId } })
            }
        }
    }


    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
                <BreadcrumbItem active><a href="/dashboard/testlog">testlog</a></BreadcrumbItem>
            </Breadcrumb>

            <h1>Lab Test Logs</h1>

            <Row style={{ alignItems: 'center', display: 'flex' }}>
                <Col md='2' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label'>Search Node</Label>
                        <Input
                            type='text'
                            placeholder='Search Node ID...'
                            onChange={(e) => setNodeIdFilter(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md='3' sm='8'>
                    <div><h4 style={{ margin: '10px 0px' }}>Total Nodes - {filterRow.length}</h4></div>
                </Col>
            </Row>

            <div className="ag-theme-alpine" style={{
                width: '100%',
                height: '600px',
                overflowX: 'auto'
            }}>
                {filterRow.length > 0 ? (
                    <AgGridReact
                        ref={gridRef}
                        rowData={filterRow}
                        columnDefs={columnDefs}
                        animateRows
                        rowSelection="multiple"
                        pagination
                        paginationPageSize={12}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                    // onCellContextMenu={handleCellRightClick}
                    />
                ) : <Loader />}
            </div>
        </>
    )
}

export default OverView
