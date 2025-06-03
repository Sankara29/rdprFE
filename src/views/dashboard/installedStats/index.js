
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
import moment from 'moment/moment'
import Pop from './Pop'

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
    const [recentNodeCount, setRecentNodeCount] = useState(0)
    const lastRightClickRef = useRef(0)
    const [gpOptions, setGpOptions] = useState([]);
    const [villageOptions, setVillageOptions] = useState([]);


    const [rowGP, setrowGP] = useState([]);
    const [rowVillage, setrowVillage] = useState([]);
    const [selectedGP, setSelectedGP] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);

    const [openLogs, setOpenLogs] = useState(false)


    const columnDefs = useMemo(() => [
        {
            headerName: 'SlNo',
            maxWidth: 100,
            valueGetter: (params) => params.node.rowIndex + 1
        },

        { headerName: 'Taluk', field: 'taluk', maxWidth: 200 },
        { headerName: 'GP Name', field: 'GPName', maxWidth: 200 },
        { headerName: 'Village Name', field: 'village', maxWidth: 200 },
        { headerName: 'RR No', field: 'rr_no', maxWidth: 108 },
        {
            headerName: 'Updated At', field: 'updated_at', maxWidth: 200, valueFormatter: (params) => {

                return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
            }
        },
        { headerName: 'Node Id', field: 'node_id', maxWidth: 200 },
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


        {
            headerName: 'More Info', maxWidth: 148,
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
    ], [navigate, recentNodeCount])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] }
    }), [])

    const onGridReady = (params) => {
        gridRef.current = params.api
    }

    // Fetch data
    // useEffect(() => {
    //     const fetchData = () => {
    //         fetch('https://testhotel2.prysmcable.com/v25/getStatus')
    //             .then(res => res.json())
    //             .then(data => {
    //                 if (data.statusCode === 200) {

    //                     setRowData(data.data)

    //                     console.log(data.data, "4")
    //                     setFilterRow(data.data)

    //                     const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]))]
    //                         .map(val => ({ label: val, value: val }))

    //                     setDistrictOptions(getUniqueOptions(data.data, 'district'))
    //                     setTalukOptions(getUniqueOptions(data.data, 'taluk'))
    //                     setGpOptions(getUniqueOptions
    //                         (data.data, 'GPName')
    //                     )
    //                     setVillageOptions(getUniqueOptions(data.data, 'village'))
    //                     setrowGP(getUniqueOptions
    //                         (data.data, 'GPName')
    //                     )
    //                     setrowVillage(getUniqueOptions(data.data, 'village'))
    //                 }
    //             })
    //     }

    //     fetchData(); // Initial fetch on mount

    //     const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    //     return () => clearInterval(intervalId); // Cleanup on unmount
    // }, [])
    // useEffect(() => {
    //     const fetchStarterNodes = async () => {
    //         try {
    //             const res = await fetch('https://testhotel2.prysmcable.com/v25/getAllStarterNodes')
    //             const result = await res.json()

    //             if (result.statusCode === 200 && Array.isArray(result.data)) {
    //                 const nodeMap = {}
    //                 result.data.forEach(item => {
    //                     if (item.rr_no) {
    //                         nodeMap[item.rr_no] = item.node_id
    //                     }
    //                 })

    //                 setRowData(prev =>
    //                     prev.map(row => ({
    //                         ...row,
    //                         node_id: nodeMap[row.rr_no] || '' // Assign matched node_id
    //                     }))
    //                 )
    //             }
    //         } catch (error) {
    //             console.error('Error fetching starter nodes:', error)
    //         }
    //     }

    //     fetchStarterNodes()
    // }, [])
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both datasets in parallel
                const [statusRes, starterRes] = await Promise.all([
                    fetch('https://testhotel2.prysmcable.com/v25/getStatus'),
                    fetch('https://testhotel2.prysmcable.com/v25/getAllStarterNodes')
                ])

                const statusData = await statusRes.json()
                const starterData = await starterRes.json()

                if (statusData.statusCode === 200 && Array.isArray(statusData.data)) {
                    const rawData = statusData.data

                    // Create rr_no → node_id map
                    const nodeMap = {}
                    if (starterData.statusCode === 200 && Array.isArray(starterData.data)) {
                        starterData.data.forEach(item => {
                            if (item.rr_no) {
                                nodeMap[item.rr_no] = item.node_id
                            }
                        })
                    }

                    // Merge node_id into rawData
                    const mergedData = rawData.map(item => ({
                        ...item,
                        node_id: nodeMap[item.rr_no] || ''
                    }))

                    // Sort by captureddatetime (if needed) and trim date
                    // const sortedData = mergedData;
                    const priorityRRNOs = ['DPWP06', 'DPWP42', 'TWP261', 'TWP240', 'TWP144', 'TWP503', 'TWP444', 'DPP242', 'TWP489', 'ALA1', 'TWP371', 'TP1044', 'TWP168', 'DPP267',]
                    const sortedData = mergedData.sort((a, b) => {
                        const indexA = priorityRRNOs.indexOf(a.rr_no);
                        const indexB = priorityRRNOs.indexOf(b.rr_no);

                        if (indexA !== -1 && indexB !== -1) {
                            return indexA - indexB; // both in priority list → keep priority order
                        }
                        if (indexA !== -1) return -1; // a is in priority list
                        if (indexB !== -1) return 1;  // b is in priority list
                        return 0; // neither in priority list → maintain original relative order
                    });
                    setRowData(sortedData)
                    setFilterRow(sortedData)

                    const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]))]
                        .map(val => ({ label: val, value: val }))

                    setDistrictOptions(getUniqueOptions(sortedData, 'district'))
                    setTalukOptions(getUniqueOptions(sortedData, 'taluk'))
                    setGpOptions(getUniqueOptions(sortedData, 'GPName'))
                    setVillageOptions(getUniqueOptions(sortedData, 'village'))
                    setrowGP(getUniqueOptions(sortedData, 'GPName'))
                    setrowVillage(getUniqueOptions(sortedData, 'village'))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 mins
        return () => clearInterval(interval)
    }, [])

    // Apply all filters
    useEffect(() => {
        let filtered = [...rowData];

        if (selectedDistrict) {
            filtered = filtered.filter(item => item.district === selectedDistrict.value);
        }

        if (selectedTaluk) {
            filtered = filtered.filter(item => item.taluk === selectedTaluk.value);
        }

        if (selectedGP) {
            filtered = filtered.filter(item => item.GPName === selectedGP.value);
        }

        if (selectedVillage) {
            filtered = filtered.filter(item => item.village === selectedVillage.value);
        }

        if (nodeIdFilter) {
            filtered = filtered.filter(item =>
                item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
            );
        }

        setFilterRow(filtered);
    }, [selectedDistrict, selectedTaluk, selectedGP, selectedVillage, nodeIdFilter, rowData]);

    useEffect(() => {
        if (selectedTaluk) {
            const gps = [...new Set(rowData.filter(item => item.taluk === selectedTaluk.value).map(item => item.GPName))];
            setGpOptions(gps.map(val => ({ label: val, value: val })));
            setSelectedGP(null);
            setVillageOptions([]);
            setSelectedVillage(null);
        }
        else {
            setGpOptions(rowGP);
            setSelectedGP(null);
            setVillageOptions(rowVillage);
            setSelectedVillage(null);
        }
    }, [selectedTaluk, rowData]);

    useEffect(() => {
        if (selectedGP) {
            const villages = [...new Set(rowData.filter(item => item.GPName === selectedGP.value).map(item => item.village))];
            setVillageOptions(villages.map(val => ({ label: val, value: val })));
            setSelectedVillage(null);
        }
        else {
            setVillageOptions(rowVillage);
            setSelectedVillage(null);
        }
    }, [selectedGP, rowData]);

    const [id, setId] = useState(null);
    const [rrno, setrrno] = useState(null)

    const handleCellRightClick = (event) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) return;

        event.event.preventDefault(); // Prevent browser context menu
        const now = Date.now()
        const delta = now - lastRightClickRef.current
        lastRightClickRef.current = now
        if (delta < 400) {
            const Id = event.data?.id;
            const RRno = event.data?.rr_no;
            setrrno(RRno)
            setId(Id)
            if (Id) {
                setOpenLogs(true)
            }
        }
    };
    const handleCellRightClicks = (data) => {




        const Id = data.data?.id;
        const RRno = data.data?.rr_no;
        setrrno(RRno)
        setId(Id)
        if (Id) {
            setOpenLogs(true)
        }

    };
    const [data, setData] = useState(null);
    const [image, setImage] = useState(null);

    const getDetails = async () => {
        try {
            const res = await fetch(`https://testhotel2.prysmcable.com/v25/getAllMeterByRRno?rrNo=${rrno}`);
            const data = await res.json(); // Parse JSON
            setData(data.data); // Adjust according to API response structure
        } catch (error) {
            console.log(error)
        }
    }
    const getAllImages = async () => {
        try {
            const res = await fetch(`https://testhotel2.prysmcable.com/v25/getImages?rrNumber=${rrno}`);

            const data = await res.json(); // Parse JSON
            setImage(data.data); // Adjust based on actual structure
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



    console.log(filterRow, '$$$')
    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
                <BreadcrumbItem active><a href="/dashboard/other">Installation Status</a></BreadcrumbItem>
            </Breadcrumb>

            <h1>Installation Status</h1>

            <Row style={{ alignItems: 'center', display: 'flex' }}>
                <FilterSelect label="District" options={districtOptions} selected={selectedDistrict} onChange={setSelectedDistrict} control={control} name="district" />
                <FilterSelect label="Taluk" options={talukOptions} selected={selectedTaluk} onChange={setSelectedTaluk} control={control} name="taluk" />
                <FilterSelect label="GP Name" options={gpOptions} selected={selectedGP} onChange={setSelectedGP} control={control} name="gp" />
                <FilterSelect label="Village" options={villageOptions} selected={selectedVillage} onChange={setSelectedVillage} control={control} name="village" />


                <Col md='3' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label'>Search</Label>
                        <Input
                            type='text'
                            placeholder='Search anything...'
                            onChange={(e) => {
                                if (gridRef.current) {
                                    gridRef.current.setQuickFilter(e.target.value);
                                }
                            }}
                        />
                    </div>
                </Col>



            </Row>

            {/* Grid */}
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
                    />
                ) : <p>No Data Found</p>}
            </div>

            <Modal
                isOpen={openLogs}
                toggle={() => setOpenLogs(!openLogs)}
                style={{
                    maxWidth: '95%',
                    width: '95%',
                    maxHeight: '90vh',
                    // overflowY: 'auto',
                    // marginTop: '5vh'
                    // overflowY: 'scroll', // still enables scrolling
                    // scrollbarWidth: 'none' // Firefox
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

