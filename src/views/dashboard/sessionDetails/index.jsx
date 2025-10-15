
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import Loader from '../rdprDashboard/Loader'
import { format, parse, isValid, differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import ModelData from './modelData'

const OverView = () => {
    const navigate = useNavigate()
    const gridRef = useRef()
    const { control } = useForm({})

    const [rowData, setRowData] = useState([])
    const [filterRow, setFilterRow] = useState([])

    const [districtOptions, setDistrictOptions] = useState([])
    const [talukOptions, setTalukOptions] = useState([])

    const [gpOptions, setGpOptions] = useState([]);
    const [villageOptions, setVillageOptions] = useState([]);

    const [selectedGP, setSelectedGP] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);

    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedTaluk, setSelectedTaluk] = useState(null)
    const [nodeIdFilter, setNodeIdFilter] = useState("")
    const [recentNodeCount, setRecentNodeCount] = useState(0)
    const lastRightClickRef = useRef(0)
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [selectedNode, setSelectedNode] = useState(null)


    // Function to calculate the recent node count
    const calculateRecentNodeCount = () => {
        const now = new Date();

        return filterRow.filter(item => {
            const capturedTime = new Date(item.realtimeclock);
            if (isNaN(capturedTime)) {
                return false;
            }

            return (
                capturedTime.getFullYear() === now.getFullYear() &&
                capturedTime.getMonth() === now.getMonth() &&
                capturedTime.getDate() === now.getDate()
            );
        }).length;
    };



    useEffect(() => {
        setRecentNodeCount(calculateRecentNodeCount())
    }, [filterRow]) // Recalculate whenever filterRow changes

    const columnDefs = useMemo(() => [
        // { headerName: 'Id', field: 'id', maxWidth: 68 },
        { headerName: 'GP Name', field: 'gpname', maxWidth: 188 },
        { headerName: 'Village Name', field: 'village', maxWidth: 200 },
        {
            headerName: `Node Id`,
            field: 'node_id',
            maxWidth: 200,
            cellRendererFramework: (params) => {



                return (
                    <span
                        onClick={() => { handleNavigate(params.data.node_id) }}
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                        title="Click or Right-Click for more info"
                    >
                        {params.data.node_id}
                    </span>
                );
            }
        },

        { headerName: 'RR No', field: 'rr_no', maxWidth: 138 },
        {
            headerName: 'EnergyConsumption (kWhImp)',
            field: 'total_wh',
            maxWidth: 300,
            // provide numeric value for sorting
            valueGetter: (params) => {
                const val = Number(params.data?.total_wh) || 0;
                return val / 1000; // kWh
            },
            // format display with 2 decimals
            valueFormatter: (params) => {
                const val = Number(params.value) || 0;
                return val.toFixed(2);
            },
            sortable: true
        },
        {
            headerName: 'WaterSuppied (m³)',
            field: 'total_wh',
            maxWidth: 300,
            valueGetter: (params) => {
                const value = params.data.water_used;
                if (value === undefined || value === null) return null;
                return Number(value) / 1000; // return number for sorting
            },
            valueFormatter: (params) => {
                if (params.value === undefined || params.value === null) return '';
                return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
            }
        },


        { headerName: 'session_count', field: 'session_count', maxWidth: 150 },


    ], [navigate, recentNodeCount])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] },
        wrapHeaderText: true, // for AG Grid Enterprise >= 27
        autoHeaderHeight: true
    }), [])

    const onGridReady = (params) => {
        gridRef.current = params.api
    }



    useEffect(() => {
        const fetchData = () => {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')
            fetch(`${API_URL}/getAllNodeSessionsTodaycount?date=${selectedDate}`)
                .then(res => res.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        const sortedData = data.data
                        setRowData(sortedData)
                        setFilterRow(sortedData)

                        const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]))]
                            .map(val => ({ label: val, value: val }))

                        setDistrictOptions(getUniqueOptions(data.data, 'district'))
                        setTalukOptions(getUniqueOptions(data.data, 'taluk'))
                        const gps = [...new Set(data.data.map(item => item.gpname))].sort()
                        const villages = [...new Set(data.data.map(item => item.village))].sort()
                        setGpOptions(gps.map(item => ({ label: item, value: item })))
                        setVillageOptions(villages.map(item => ({ label: item, value: item })))
                    }
                })
        }

        fetchData()
        const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [selectedDate])


    // Apply all filters
    useEffect(() => {
        let filtered = [...rowData]

        if (selectedDistrict) {
            filtered = filtered.filter(item => item.district === selectedDistrict.value)
        }

        if (selectedTaluk) {
            filtered = filtered.filter(item => item.taluk === selectedTaluk.value)
        }

        if (nodeIdFilter) {
            filtered = filtered.filter(item =>
                item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
            )
        }

        if (selectedGP) {
            filtered = filtered.filter(item => item.GPName === selectedGP.value);
        }

        if (selectedVillage) {
            filtered = filtered.filter(item => item.village === selectedVillage.value);
        }

        setFilterRow(filtered)
    }, [selectedDistrict, selectedTaluk, nodeIdFilter, rowData, selectedGP, selectedVillage])


    useEffect(() => {
        if (selectedGP) {
            const filteredVillages = rowData
                .filter(item => item.GPName === selectedGP.value)
                .map(item => item.village);

            const uniqueVillages = [...new Set(filteredVillages)]
                .sort()
                .map(v => ({
                    label: v,
                    value: v
                }));

            setVillageOptions(uniqueVillages);
            setSelectedVillage(null); // clear village when GP changes
        } else {
            // if GP not selected, show all villages sorted
            const allVillages = [...new Set(rowData.map(item => item.village))]
                .sort()
                .map(v => ({
                    label: v,
                    value: v
                }));
            setVillageOptions(allVillages);
        }
    }, [selectedGP, rowData]);

    const [session, setSession] = useState([])
    const getSession = async (node, selectedDate) => {
        try {
            const getCurrentDate = () => {
                if (dateRef.current && dateRef.current.flatpickr) {
                    return dayjs(dateRef.current.flatpickr.selectedDates[0]).format("YYYY-MM-DD")
                }
                return selectedDate // fallback to state
            }
            const formattedDate = getCurrentDate()
            fetch(`${API_URL}/getNodeSessions?node_id=${node}&date=${formattedDate}`)
                .then(res => res.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        const sortedData = data.data
                        setSession(sortedData)
                        setModalOpen(true)

                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    const handleNavigate = (node_id) => {
        console.log(selectedDate)
        setSelectedNode(node_id)
        getSession(node_id, selectedDate)
    }
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalClose = () => {
        setModalOpen(false);
        setSession(null);
    };
    const dateRef = useRef(null)
    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem><a href="/dashboard/energymeterhttp">Dashboard</a></BreadcrumbItem>
                <BreadcrumbItem active><a href="/dashboard/session">Session Details</a></BreadcrumbItem>
            </Breadcrumb>

            <h2>Session Data Node Wise</h2>

            <Row style={{ alignItems: 'center', display: 'flex' }}>
                <FilterSelect label="District" options={districtOptions} selected={selectedDistrict} onChange={setSelectedDistrict} control={control} name="district" />
                <FilterSelect label="Taluk" options={talukOptions} selected={selectedTaluk} onChange={setSelectedTaluk} control={control} name="taluk" />
                <FilterSelect label="GPName" options={gpOptions} selected={selectedGP} onChange={setSelectedGP} control={control} name="GPName" />
                <FilterSelect label="Village" options={villageOptions} selected={selectedVillage} onChange={setSelectedVillage} control={control} name="Village" />



            </Row>
            <Row style={{ alignItems: 'center', display: 'flex' }}>
                <Col md='2' sm='8'>
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
                <Col md='2' sm='8'>
                    <div className='mb-1'>
                        <Label className='form-label'>Select Date</Label>
                        <Flatpickr
                            ref={dateRef}
                            value={selectedDate}
                            options={{ dateFormat: "Y-m-d", maxDate: "today" }}
                            onChange={([date]) => {
                                if (date) setSelectedDate(dayjs(date).format("YYYY-MM-DD"))
                            }}
                            className="form-control"
                        />

                    </div>
                </Col>
            </Row>
            {/* Grid */}
            <div className="ag-theme-alpine" style={{ height: '674px', width: '90%' }}>
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
                    />
                ) : <Loader />}
            </div>

            {session?.length && <ModelData
                isOpen={modalOpen}
                toggle={handleModalClose}
                data={session}
                date={selectedDate}
                node_id={selectedNode}
            />}

        </>
    )
}

const FilterSelect = ({ label, options, selected, onChange, control, name }) => (
    <Col md='2' sm='8'>
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

