import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import Pop from './Pop'
import dayjs from 'dayjs'

const OverView = () => {
    const navigate = useNavigate()
    const gridRef = useRef()
    const { control } = useForm({})

    const [rowData, setRowData] = useState([])
    const [filterRow, setFilterRow] = useState([])
    const [districtOptions, setDistrictOptions] = useState([])
    const [talukOptions, setTalukOptions] = useState([])
    const [gpOptions, setGpOptions] = useState([])
    const [villageOptions, setRowVillage] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedTaluk, setSelectedTaluk] = useState(null)
    const [selectedGP, setSelectedGP] = useState(null)
    const [selectedVillage, setSelectedVillage] = useState(null)
    const [nodeIdFilter, setNodeIdFilter] = useState("")
    const [recentNodeCount, setRecentNodeCount] = useState(0)
    const [selectedMeterType, setSelectedMeterType] = useState(null)
    const lastRightClickRef = useRef(0)
    const [rowGP, setRowGP] = useState([])
    const [openLogs, setOpenLogs] = useState(false)
    const [rowVillage, setrowVillage] = useState([]);

    // Define meter type options
    const meterTypeOptions = [
        { label: 'Energy Meter', value: 'energyMeter' },
        { label: 'Water Meter', value: 'waterMeter' },
        { label: 'Starter Node', value: 'starterNode' },
        { label: 'Neutral Data', value: 'neutralData' }
    ]

    // Define column definitions for each meter type
    const getColumnDefs = (meterType) => {
        const baseColumns = [
            {
                headerName: 'SlNo',
                maxWidth: 100,
                valueGetter: (params) => params.node.rowIndex + 1
            },
            { headerName: 'Taluk', field: 'taluk', maxWidth: 200 },
            { headerName: 'GP Name', field: 'GPName', maxWidth: 200 },
            { headerName: 'Village Name', field: 'village', maxWidth: 200 },
            { headerName: 'RR No', field: 'rr_no', maxWidth: 108 },

        ]

        const specificColumns = {
            default: [
                {
                    headerName: "node", field: "has_starter_node", cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },
                {
                    headerName: "water", field: "has_water_meter", cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },
                {
                    headerName: "energy", field: "has_energy_meter", cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },
                {
                    headerName: 'Updated At',
                    field: 'updated_at',
                    maxWidth: 200,
                    valueFormatter: (params) => {
                        return params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : ''
                    }
                }
            ],
            energyMeter: [
                { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },
                { headerName: "fuse_cut_out", field: "fuse_cut_out", maxWidth: 200 },
                { headerName: "starter_node", field: "starter_node", hide: true },
                { headerName: "neutral", field: "neutral", hide: true },
                { headerName: "meter_no", field: "meter_no" },
                { headerName: "cable_used", field: "cable_used", hide: true },
                { headerName: "cable_used_meter_neutral", field: "cable_used_meter_neutral", hide: true },
                {
                    headerName: 'Energy Meter',
                    field: 'has_energy_meter',
                    maxWidth: 138,
                    cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },

            ],
            waterMeter: [
                { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },
                { headerName: "meter_no", field: "meter_no" },
                {
                    headerName: 'Water Meter',
                    field: 'has_water_meter',
                    maxWidth: 138,
                    cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },

            ],
            starterNode: [
                { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },
                { headerName: "reason", field: "reason_replacement", hide: true },
                {
                    headerName: 'Starter Node',
                    field: 'has_starter_node',
                    maxWidth: 138,
                    cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },
            ],
            neutralData: [
                { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },

                { headerName: "cable_used_meter_neutral", field: "cable_used_meter_neutral", hide: true },
                {
                    headerName: 'Neutral Status',
                    field: 'has_neutral_data',
                    maxWidth: 138,
                    cellRendererFramework: (params) => (
                        <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {params.value === 1 ? '✓' : '✗'}
                        </span>
                    )
                },
            ]
        }

        const moreInfoColumn = {
            headerName: 'More Info',
            maxWidth: 148,
            cellRendererFramework: (params) => (
                <div className="button-cell">
                    <Button
                        color="primary"
                        style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleCellRightClicks(params)}
                    >
                        <Info style={{ marginRight: '8px' }} />
                        More Info
                    </Button>
                </div>
            ),
            cellStyle: { textAlign: 'center', padding: 0 }
        }

        return [...baseColumns, ...(specificColumns[meterType] || []), moreInfoColumn]
    }

    const columnDefs = useMemo(() => {
        return getColumnDefs(selectedMeterType?.value || 'default')
    }, [selectedMeterType, navigate, recentNodeCount])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] }
    }), [])

    const onGridReady = (params) => {
        gridRef.current = params.api
    }

    // Fetch data based on meter type
    const fetchDataByMeterType = async (meterType) => {
        try {
            let apiUrl
            switch (meterType) {
                case 'energyMeter':
                    apiUrl = 'https://testhotel2.prysmcable.com/v35/getAllEnergyMeter'
                    break
                case 'waterMeter':
                    apiUrl = 'https://testhotel2.prysmcable.com/v35/getAllWaterMeter'
                    break
                case 'starterNode':
                    apiUrl = 'https://testhotel2.prysmcable.com/v35/getAllStarterNodes'
                    break
                case 'neutralData':
                    apiUrl = 'https://testhotel2.prysmcable.com/v35/getAllNeutralMeter'
                    break
                default:
                    apiUrl = 'https://testhotel2.prysmcable.com/v35/getStatus'
                    break
            }

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()
            if (data.statusCode === 200 && Array.isArray(data.data)) {
                let rawData = data.data

                // Transform data to ensure consistent fields
                rawData = rawData.map(item => ({
                    ...item,
                    taluk: item.taluk || '',
                    GPName: item.GPName || item.gp_name || '',
                    village: item.village || '',
                    rr_no: item.rr_no || '',
                    updated_at: item.updated_at || item.timestamp || '',
                    node_id: item.node_id || '',
                    has_energy_meter: item.has_energy_meter ?? (meterType === 'energyMeter' ? 1 : 0),
                    has_water_meter: item.has_water_meter ?? (meterType === 'waterMeter' ? 1 : 0),
                    has_starter_node: item.has_starter_node ?? (meterType === 'starterNode' ? 1 : 0),
                    has_neutral_data: item.has_neutral_data ?? (meterType === 'neutralData' ? 1 : 0),
                    voltage: item.voltage || '',
                    current: item.current || '',
                    flow_rate: item.flow_rate || '',
                    total_volume: item.total_volume || '',
                    starter_status: item.starter_status || '',
                    neutral_value: item.neutral_value || ''
                }))

                // Fetch starter nodes for node_id if not starterNode
                let nodeMap = {}
                if (meterType !== 'starterNode') {
                    const starterRes = await fetch('https://testhotel2.prysmcable.com/v35/getAllStarterNodes', {
                        method: "GET",
                        headers: {
                            "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                            "Content-Type": "application/json"
                        }
                    })
                    const starterData = await starterRes.json()
                    if (starterData.statusCode === 200 && Array.isArray(starterData.data)) {
                        starterData.data.forEach(item => {
                            if (item.rr_no) {
                                nodeMap[item.rr_no] = item.node_id
                            }
                        })
                    }
                } else {
                    rawData.forEach(item => {
                        if (item.rr_no) {
                            nodeMap[item.rr_no] = item.node_id
                        }
                    })
                }

                // Merge node_id into rawData
                const mergedData = rawData.map(item => ({
                    ...item,
                    node_id: nodeMap[item.rr_no] || item.node_id || ''
                }))

                // Sort data with priority RR numbers
                const priorityRRNOs = ['DPWP06', 'DPWP42', 'TWP261', 'TWP240', 'TWP144', 'TWP503', 'TWP444', 'DPP242', 'TWP489', 'ALA1', 'TWP371', 'TP1044', 'TWP168', 'DPP267']
                const sortedData = mergedData.sort((a, b) => {
                    const indexA = priorityRRNOs.indexOf(a.rr_no)
                    const indexB = priorityRRNOs.indexOf(b.rr_no)
                    if (indexA !== -1 && indexB !== -1) {
                        return indexA - indexB
                    }
                    if (indexA !== -1) return -1
                    if (indexB !== -1) return 1
                    return 0
                })

                setRowData(sortedData)
                setFilterRow(sortedData)

                // Update filter options
                const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]).filter(val => val))]
                    .map(val => ({ label: val, value: val }))

                setDistrictOptions(getUniqueOptions(sortedData, 'district'))
                setTalukOptions(getUniqueOptions(sortedData, 'taluk'))
                setGpOptions(getUniqueOptions(sortedData, 'GPName'))
                setRowVillage(getUniqueOptions(sortedData, 'village'))
                setRowGP(getUniqueOptions(sortedData, 'GPName'))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    // Fetch initial data or when meter type changes
    useEffect(() => {
        if (selectedMeterType) {
            fetchDataByMeterType(selectedMeterType.value)
        } else {
            fetchDataByMeterType(null)
        }
        const interval = setInterval(() => fetchDataByMeterType(selectedMeterType?.value || null), 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [selectedMeterType])

    // Apply filters
    useEffect(() => {
        let filtered = [...rowData]

        if (selectedDistrict) {
            filtered = filtered.filter(item => item.district === selectedDistrict.value)
        }

        if (selectedTaluk) {
            filtered = filtered.filter(item => item.taluk === selectedTaluk.value)
        }

        if (selectedGP) {
            filtered = filtered.filter(item => item.GPName === selectedGP.value)
        }

        if (selectedVillage) {
            filtered = filtered.filter(item => item.village === selectedVillage.value)
        }

        if (nodeIdFilter) {
            filtered = filtered.filter(item =>
                item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
            )
        }

        setFilterRow(filtered)
    }, [selectedDistrict, selectedTaluk, selectedGP, selectedVillage, nodeIdFilter, rowData])

    useEffect(() => {
        if (selectedTaluk) {
            const gps = [...new Set(rowData.filter(item => item.taluk === selectedTaluk.value).map(item => item.GPName).filter(val => val))]
            setGpOptions(gps.map(val => ({ label: val, value: val })))
            setSelectedGP(null)
            setRowVillage([])
            setSelectedVillage(null)
        } else {
            setGpOptions(rowGP)
            setSelectedGP(null)
            setRowVillage(rowVillage)
            setSelectedVillage(null)
        }
    }, [selectedTaluk, rowData])

    useEffect(() => {
        if (selectedGP) {
            const villages = [...new Set(rowData.filter(item => item.GPName === selectedGP.value).map(item => item.village).filter(val => val))]
            setRowVillage(villages.map(val => ({ label: val, value: val })))
            setSelectedVillage(null)
        } else {
            setRowVillage(rowVillage)
            setSelectedVillage(null)
        }
    }, [selectedGP, rowData])

    const [id, setId] = useState(null)
    const [rrno, setRrno] = useState(null)

    const handleCellRightClick = (event) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (isMobile) return

        event.event.preventDefault()
        const now = Date.now()
        const delta = now - lastRightClickRef.current
        lastRightClickRef.current = now
        if (delta < 400) {
            const Id = event.data?.id
            const RRno = event.data?.rr_no
            setRrno(RRno)
            setId(Id)
            if (Id) {
                setOpenLogs(true)
            }
        }
    }

    const handleCellRightClicks = (data) => {
        const Id = data.data?.id
        const RRno = data.data?.rr_no
        setRrno(RRno)
        setId(Id)
        if (Id) {
            setOpenLogs(true)
        }
    }

    const [data, setData] = useState(null)
    const [image, setImage] = useState(null)

    const getDetails = async () => {
        try {
            const res = await fetch(`https://testhotel2.prysmcable.com/v35/getAllMeterByRRno?rrNo=${rrno}`, {
                method: "GET",
                headers: {
                    "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            setData(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllImages = async () => {
        try {
            const res = await fetch(`https://testhotel2.prysmcable.com/v35/getImages?rrNumber=${rrno}`, {
                method: "GET",
                headers: {
                    "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap",
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            setImage(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (rrno) {
            getDetails()
            getAllImages()
        }
    }, [rrno])




    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
                <BreadcrumbItem active><a href="/dashboard/other">Installation Status</a></BreadcrumbItem>
            </Breadcrumb>

            <h1>Installation Status</h1>

            <Row style={{ alignItems: 'center', display: 'flex' }}>
                <FilterSelect
                    label="Meter Type"
                    options={meterTypeOptions}
                    selected={selectedMeterType}
                    onChange={setSelectedMeterType}
                    control={control}
                    name="meterType"
                />
                <FilterSelect
                    label="District"
                    options={districtOptions}
                    selected={selectedDistrict}
                    onChange={setSelectedDistrict}
                    control={control}
                    name="district"
                />
                <FilterSelect
                    label="Taluk"
                    options={talukOptions}
                    selected={selectedTaluk}
                    onChange={setSelectedTaluk}
                    control={control}
                    name="taluk"
                />
                <FilterSelect
                    label="GP Name"
                    options={gpOptions}
                    selected={selectedGP}
                    onChange={setSelectedGP}
                    control={control}
                    name="gp"
                />
                <FilterSelect
                    label="Village"
                    options={villageOptions}
                    selected={selectedVillage}
                    onChange={setSelectedVillage}
                    control={control}
                    name="village"
                />
                <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label'>Search</Label>
                        <Input
                            type='text'
                            placeholder='Search anything...'
                            onChange={(e) => {
                                if (gridRef.current) {
                                    gridRef.current.setQuickFilter(e.target.value)
                                }
                            }}
                        />
                    </div>
                </Col>
                <Col md='3' sm='8'>
                    <Button color="primary" className='primary' onClick={() => handleDownload()}>Download</Button>
                </Col>
            </Row>

            <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
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
                        onCellContextMenu={handleCellRightClick}
                        gridOptions={{
                            defaultCsvExportParams: {
                                allColumns: true // Includes hidden columns in CSV exports
                            }, defaultExcelExportParams: {
                                allColumns: true // Includes hidden columns in Excel (xlsx) exports
                            }
                        }}

                    />
                ) : <p>No Data Found</p>}
            </div>

            <Modal
                isOpen={openLogs}
                toggle={() => setOpenLogs(!openLogs)}
                style={{
                    maxWidth: '95%',
                    width: '95%',
                    maxHeight: '90vh'
                }}
            >
                <ModalHeader toggle={() => setOpenLogs(!openLogs)}></ModalHeader>
                <ModalBody className="pb-3 px-sm-1 mx-2">
                    <Pop rrno={rrno} data={data} image={image} />
                </ModalBody>
            </Modal>
        </>
    )
}

const FilterSelect = ({ label, options, selected, onChange, control, name }) => (
    <Col md='3' sm='8'>
        <div className='mb-1'>
            <Label className='form-label'>{`Select ${label}`}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        isClearable
                        value={selected}
                        options={options}
                        classNamePrefix='select'
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        {...field}
                        onChange={(val) => {
                            field.onChange(val)
                            onChange(val)
                        }}
                    />
                )}
            />
        </div>
    </Col>
)

export default OverView







// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
// import { useState, useRef, useEffect, useMemo } from 'react'
// import { Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
// import Select from 'react-select'
// import classnames from 'classnames'
// import API_URL from '../../../config'
// import { selectThemeColors } from '@utils'
// import { useForm, Controller } from 'react-hook-form'
// import { Info } from 'react-feather'
// import { useNavigate } from 'react-router-dom'
// import moment from 'moment/moment'
// import Pop from './Pop'
// import dayjs from 'dayjs'

// const OverView = () => {
//     const navigate = useNavigate()
//     const gridRef = useRef()
//     const { control } = useForm({})

//     const [rowData, setRowData] = useState([])
//     const [filterRow, setFilterRow] = useState([])

//     const [districtOptions, setDistrictOptions] = useState([])
//     const [talukOptions, setTalukOptions] = useState([])

//     const [selectedDistrict, setSelectedDistrict] = useState(null)
//     const [selectedTaluk, setSelectedTaluk] = useState(null)
//     const [nodeIdFilter, setNodeIdFilter] = useState("")
//     const [recentNodeCount, setRecentNodeCount] = useState(0)
//     const lastRightClickRef = useRef(0)
//     const [gpOptions, setGpOptions] = useState([]);
//     const [villageOptions, setVillageOptions] = useState([]);


//     const [rowGP, setrowGP] = useState([]);
//     const [rowVillage, setrowVillage] = useState([]);
//     const [selectedGP, setSelectedGP] = useState(null);
//     const [selectedVillage, setSelectedVillage] = useState(null);

//     const [openLogs, setOpenLogs] = useState(false)


//     const columnDefs = useMemo(() => [
//         {
//             headerName: 'SlNo',
//             maxWidth: 100,
//             valueGetter: (params) => params.node.rowIndex + 1
//         },

//         { headerName: 'Taluk', field: 'taluk', maxWidth: 200 },
//         { headerName: 'GP Name', field: 'GPName', maxWidth: 200 },
//         { headerName: 'Village Name', field: 'village', maxWidth: 200 },
//         { headerName: 'RR No', field: 'rr_no', maxWidth: 108 },
//         {
//             headerName: 'Updated At', field: 'updated_at', maxWidth: 200, valueFormatter: (params) => {

//                 return params.value ? dayjs(params.value).format('MMM-DD-YYYY HH:mm') : '';
//             }
//         },
//         { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },
//         {
//             headerName: 'Water Meter',
//             field: 'has_water_meter',
//             maxWidth: 138,
//             cellRendererFramework: (params) => (
//                 <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
//                     {params.value === 1 ? '✓' : '✗'}
//                 </span>
//             )

//         },
//         {
//             headerName: 'Starter Node',
//             field: 'has_starter_node',
//             maxWidth: 138,
//             cellRendererFramework: (params) => (
//                 <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
//                     {params.value === 1 ? '✓' : '✗'}
//                 </span>
//             )

//         },


//         {
//             headerName: 'More Info', maxWidth: 148,
//             cellRendererFramework: (params) => (
//                 <div className="button-cell">
//                     <Button
//                         color="primary"
//                         style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                         onClick={() => handleCellRightClicks(params)}
//                     >
//                         <Info style={{ marginRight: '8px' }} />
//                         More Info
//                     </Button>
//                 </div>
//             ),
//             cellStyle: { textAlign: 'center', padding: 0 }
//         }
//     ], [navigate, recentNodeCount])

//     const defaultColDef = useMemo(() => ({
//         sortable: true,
//         filter: true,
//         flex: 1,
//         filterParams: { buttons: ['apply', 'reset'] }
//     }), [])

//     const onGridReady = (params) => {
//         gridRef.current = params.api
//     }


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch both datasets in parallel
//                 const [statusRes, starterRes] = await Promise.all([
//                     fetch('https://testhotel2.prysmcable.com/v35/getStatus', {
//                         headers: {
//                             "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap", // replace with your API key
//                             "Content-Type": "application/json"
//                         }
//                     }),
//                     fetch('https://testhotel2.prysmcable.com/v35/getAllStarterNodes', {
//                         method: "GET",
//                         headers: {
//                             "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap", // replace with your API key
//                             "Content-Type": "application/json"
//                         }
//                     })
//                 ])

//                 const statusData = await statusRes.json()
//                 const starterData = await starterRes.json()

//                 if (statusData.statusCode === 200 && Array.isArray(statusData.data)) {
//                     const rawData = statusData.data

//                     // Create rr_no → node_id map
//                     const nodeMap = {}
//                     if (starterData.statusCode === 200 && Array.isArray(starterData.data)) {
//                         starterData.data.forEach(item => {
//                             if (item.rr_no) {
//                                 nodeMap[item.rr_no] = item.node_id
//                             }
//                         })
//                     }

//                     // Merge node_id into rawData
//                     const mergedData = rawData.map(item => ({
//                         ...item,
//                         node_id: nodeMap[item.rr_no] || ''
//                     }))

//                     // Sort by captureddatetime (if needed) and trim date
//                     // const sortedData = mergedData;
//                     const priorityRRNOs = ['DPWP06', 'DPWP42', 'TWP261', 'TWP240', 'TWP144', 'TWP503', 'TWP444', 'DPP242', 'TWP489', 'ALA1', 'TWP371', 'TP1044', 'TWP168', 'DPP267',]
//                     const sortedData = mergedData.sort((a, b) => {
//                         const indexA = priorityRRNOs.indexOf(a.rr_no);
//                         const indexB = priorityRRNOs.indexOf(b.rr_no);

//                         if (indexA !== -1 && indexB !== -1) {
//                             return indexA - indexB; // both in priority list → keep priority order
//                         }
//                         if (indexA !== -1) return -1; // a is in priority list
//                         if (indexB !== -1) return 1;  // b is in priority list
//                         return 0; // neither in priority list → maintain original relative order
//                     });
//                     setRowData(sortedData)
//                     setFilterRow(sortedData)

//                     const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]))]
//                         .map(val => ({ label: val, value: val }))

//                     setDistrictOptions(getUniqueOptions(sortedData, 'district'))
//                     setTalukOptions(getUniqueOptions(sortedData, 'taluk'))
//                     setGpOptions(getUniqueOptions(sortedData, 'GPName'))
//                     setVillageOptions(getUniqueOptions(sortedData, 'village'))
//                     setrowGP(getUniqueOptions(sortedData, 'GPName'))
//                     setrowVillage(getUniqueOptions(sortedData, 'village'))
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error)
//             }
//         }

//         fetchData()
//         const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 mins
//         return () => clearInterval(interval)
//     }, [])

//     // Apply all filters
//     useEffect(() => {
//         let filtered = [...rowData];

//         if (selectedDistrict) {
//             filtered = filtered.filter(item => item.district === selectedDistrict.value);
//         }

//         if (selectedTaluk) {
//             filtered = filtered.filter(item => item.taluk === selectedTaluk.value);
//         }

//         if (selectedGP) {
//             filtered = filtered.filter(item => item.GPName === selectedGP.value);
//         }

//         if (selectedVillage) {
//             filtered = filtered.filter(item => item.village === selectedVillage.value);
//         }

//         if (nodeIdFilter) {
//             filtered = filtered.filter(item =>
//                 item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
//             );
//         }

//         setFilterRow(filtered);
//     }, [selectedDistrict, selectedTaluk, selectedGP, selectedVillage, nodeIdFilter, rowData]);

//     useEffect(() => {
//         if (selectedTaluk) {
//             const gps = [...new Set(rowData.filter(item => item.taluk === selectedTaluk.value).map(item => item.GPName))];
//             setGpOptions(gps.map(val => ({ label: val, value: val })));
//             setSelectedGP(null);
//             setVillageOptions([]);
//             setSelectedVillage(null);
//         }
//         else {
//             setGpOptions(rowGP);
//             setSelectedGP(null);
//             setVillageOptions(rowVillage);
//             setSelectedVillage(null);
//         }
//     }, [selectedTaluk, rowData]);

//     useEffect(() => {
//         if (selectedGP) {
//             const villages = [...new Set(rowData.filter(item => item.GPName === selectedGP.value).map(item => item.village))];
//             setVillageOptions(villages.map(val => ({ label: val, value: val })));
//             setSelectedVillage(null);
//         }
//         else {
//             setVillageOptions(rowVillage);
//             setSelectedVillage(null);
//         }
//     }, [selectedGP, rowData]);

//     const [id, setId] = useState(null);
//     const [rrno, setrrno] = useState(null)

//     const handleCellRightClick = (event) => {
//         const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//         if (isMobile) return;

//         event.event.preventDefault(); // Prevent browser context menu
//         const now = Date.now()
//         const delta = now - lastRightClickRef.current
//         lastRightClickRef.current = now
//         if (delta < 400) {
//             const Id = event.data?.id;
//             const RRno = event.data?.rr_no;
//             setrrno(RRno)
//             setId(Id)
//             if (Id) {
//                 setOpenLogs(true)
//             }
//         }
//     };
//     const handleCellRightClicks = (data) => {




//         const Id = data.data?.id;
//         const RRno = data.data?.rr_no;
//         setrrno(RRno)
//         setId(Id)
//         if (Id) {
//             setOpenLogs(true)
//         }

//     };
//     const [data, setData] = useState(null);
//     const [image, setImage] = useState(null);

//     const getDetails = async () => {
//         try {
//             const res = await fetch(`https://testhotel2.prysmcable.com/v35/getAllMeterByRRno?rrNo=${rrno}`, {
//                 method: "GET",
//                 headers: {
//                     "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap", // replace with your API key
//                     "Content-Type": "application/json"
//                 }
//             });
//             const data = await res.json(); // Parse JSON
//             setData(data.data); // Adjust according to API response structure
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     const getAllImages = async () => {
//         try {
//             const res = await fetch(`https://testhotel2.prysmcable.com/v35/getImages?rrNumber=${rrno}`, {
//                 method: "GET",
//                 headers: {
//                     "x-api-key": "uprtvubdxwyuhebwsnkrdirmfoqorkap", // replace with your API key
//                     "Content-Type": "application/json"
//                 }
//             });

//             const data = await res.json(); // Parse JSON
//             setImage(data.data); // Adjust based on actual structure
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     useEffect(() => {
//         if (rrno) {
//             getDetails()
//             getAllImages()
//         }
//     }, [rrno])



//     console.log(filterRow, '$$$')
//     return (
//         <>
//             <Breadcrumb>
//                 <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
//                 <BreadcrumbItem active><a href="/dashboard/other">Installation Status</a></BreadcrumbItem>
//             </Breadcrumb>

//             <h1>Installation Status</h1>

//             <Row style={{ alignItems: 'center', display: 'flex' }}>
//                 <FilterSelect label="District" options={districtOptions} selected={selectedDistrict} onChange={setSelectedDistrict} control={control} name="district" />
//                 <FilterSelect label="Taluk" options={talukOptions} selected={selectedTaluk} onChange={setSelectedTaluk} control={control} name="taluk" />
//                 <FilterSelect label="GP Name" options={gpOptions} selected={selectedGP} onChange={setSelectedGP} control={control} name="gp" />
//                 <FilterSelect label="Village" options={villageOptions} selected={selectedVillage} onChange={setSelectedVillage} control={control} name="village" />


//                 <Col md='3' sm='8'>
//                     <div className='mb-1'>
//                         <Label className='form-label'>Search</Label>
//                         <Input
//                             type='text'
//                             placeholder='Search anything...'
//                             onChange={(e) => {
//                                 if (gridRef.current) {
//                                     gridRef.current.setQuickFilter(e.target.value);
//                                 }
//                             }}
//                         />
//                     </div>
//                 </Col>



//             </Row>

//             {/* Grid */}
//             <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
//                 {filterRow.length > 0 ? (
//                     <AgGridReact
//                         ref={gridRef}
//                         rowData={filterRow}
//                         columnDefs={columnDefs}
//                         animateRows
//                         rowSelection="multiple"
//                         pagination
//                         paginationPageSize={12}
//                         defaultColDef={defaultColDef}
//                         onGridReady={onGridReady}
//                         onCellContextMenu={handleCellRightClick}
//                     />
//                 ) : <p>No Data Found</p>}
//             </div>

//             <Modal
//                 isOpen={openLogs}
//                 toggle={() => setOpenLogs(!openLogs)}
//                 style={{
//                     maxWidth: '95%',
//                     width: '95%',
//                     maxHeight: '90vh',
//                     // overflowY: 'auto',
//                     // marginTop: '5vh'
//                     // overflowY: 'scroll', // still enables scrolling
//                     // scrollbarWidth: 'none' // Firefox
//                 }}
//             >
//                 <ModalHeader toggle={() => setOpenLogs(!openLogs)}></ModalHeader>
//                 <ModalBody className="pb-3 px-sm-1 mx-2">

//                     <Pop rrno={rrno} data={data} image={image} />

//                 </ModalBody>
//             </Modal>


//         </>
//     )
// }

// const FilterSelect = ({ label, options, selected, onChange, control, name }) => (
//     <Col md='3' sm='8'>
//         <div className='mb-1'>
//             <Label className='form-label'>{`Select ${label}`}</Label>
//             <Controller
//                 name={name}
//                 control={control}
//                 render={({ field }) => (
//                     <Select
//                         isClearable
//                         value={selected}
//                         options={options}
//                         classNamePrefix='select'
//                         theme={selectThemeColors}
//                         className={classnames('react-select')}
//                         {...field}
//                         onChange={(val) => {
//                             field.onChange(val)
//                             onChange(val)
//                         }}
//                     />
//                 )}
//             />
//         </div>
//     </Col>
// )

// export default OverView

