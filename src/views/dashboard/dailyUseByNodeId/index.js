import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Button, Breadcrumb, BreadcrumbItem, Input, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import LoadPop from './LoadPop'

const OverView = () => {
  const navigate = useNavigate()
  const gridRef = useRef()
  const { control } = useForm()
  const location = useLocation();
  const { node_id, GP, village, GPName, village_name, rr_no, pumpHp } = location.state || {};

  const [rowData, setRowData] = useState([])
  const [filterRow, setFilterRow] = useState([])
  const [district, setDistrict] = useState([])
  const [taluk, setTaluk] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedTaluk, setSelectedTaluk] = useState(null)
  const [nodeIdFilter, setNodeIdFilter] = useState("")
  const [load, setLoad] = useState(false)
  const [date, setDate] = useState(null)

  const columnDefs = useMemo(() => [
    // { headerName: 'Id', field: 'id', maxWidth: 66 },
    // {
    //   headerName: 'Node Id', field: 'node_id', maxWidth: 118,
    //   valueGetter: params => {
    //     return `${params.data.node_id}`
    //   }
    // },
    { headerName: 'RR No', field: 'rr_no', maxWidth: 96 },
    { headerName: 'Village', field: 'village', maxWidth: 188 },
    { headerName: 'Gram panchayat', field: 'GPName', maxWidth: 128 },
    {
      headerName: 'date', field: 'date', maxWidth: 100, valueFormatter: (params) => {
        return params.value ? moment(params.value).format('MMM-DD-YYYY') : '';
      }
    },
    {
      headerName: 'pumpHp', field: 'pumpHB', maxWidth: 108,
      cellStyle: { whiteSpace: 'normal', textAlign: 'center' }, valueFormatter: params => {
        if (params.data?.pumpHB == null) {
          return 15;
        }
        return params.data?.pumpHB;
      }
    },
    {
      headerName: 'Water Supplied (m³)',
      field: 'water_usage',
      maxWidth: 150, headerClass: 'wrap-header',
      cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
      valueFormatter: params => {
        const formatted = Math.abs(params.value / 1000).toFixed(2);
        return new Intl.NumberFormat('en-US').format(formatted);
      }, comparator: (a, b) => Math.abs(a) - Math.abs(b)
    },
    {
      headerName: 'Energy Consumed (kWh)',
      field: 'energy_usage',
      maxWidth: 150, headerClass: 'wrap-header',
      cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
      valueFormatter: params => {
        if (params.value == null) return 'N/A'
        return new Intl.NumberFormat('en-US').format(
          parseFloat(params.value).toFixed(2)
        )
      },
      comparator: (a, b) => (a ?? 0) - (b ?? 0), 
      // sort: 'desc'
    },
    {
      headerName: 'Litres/kWh',
      field: 'litr_per_kwh', // You can use a dummy field if needed
      cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
      valueFormatter: params => {
        const waterUsage = params.data?.water_usage;
        const energyUsage = params.data?.energy_usage;


        if (waterUsage == null || energyUsage == null || energyUsage === 0) {
          return 'N/A';
        }

        const waterLitres = waterUsage;

        const ratio = waterLitres / energyUsage;


        return ratio.toFixed(2)
      },

      maxWidth: 150,
    }


  ], [navigate])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: { buttons: ["apply", "reset"] }, wrapHeaderText: true, // for AG Grid Enterprise >= 27
    autoHeaderHeight: true
  }), [])

  const onGridReady = params => {
    gridRef.current = params.api
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {

      const [waterRes, energyRes] = await Promise.all([
        fetch(API_URL + `/getDailyWaterUsage?nodeId=${node_id}`),
        fetch("https://testpms.ms-tech.in/v15/getDlReport")
      ])

      const [waterData, energyData] = await Promise.all([
        waterRes.json(),
        energyRes.json()
      ])

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



        setRowData(mergedData)
        setFilteredData(mergedData)
      }
    }

    fetchData(); // Initial fetch on mount

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [node_id])

  // Filter logic
  useEffect(() => {
    let filtered = [...rowData]



    if (nodeIdFilter.trim() !== "") {
      filtered = filtered.filter(item =>
        item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
      )
    }

    setFilterRow(filtered)
  }, [nodeIdFilter, rowData])

  const handleCellRightClick = (event) => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return
    event.event.preventDefault()
    setDate(event?.data?.date)
    const GP = event?.data?.GPName
    const village = event?.data?.village
    const rr_no = event?.data?.rr_no

    const population = event?.data?.population
    const pumpHp = event?.data?.pumpHB

    navigate('/dashboard/dailyUse/nodeId/date', {

      state: { node_id: node_id, date: event?.data?.date, GP, village, rr_no, pumpHp, population }

    })
    // setLoad(true)
  }
  const handleCellClick = (event) => {
    setDate(event?.data?.date)

    const GP = event?.data?.GPName
    const village = event?.data?.village
    const rr_no = event?.data?.rr_no
    const pumpHp = event?.data?.pumpHB
    const population = event?.data?.population
    navigate('/dashboard/dailyUse/nodeId/date', {


      state: { node_id: node_id, date: event?.data?.date, GP: GP, village: village, rr_no: rr_no, pumpHp, population }

    })
    // setLoad(true);
  };

  return (
    <>
      <Breadcrumb>
        {/* <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem> */}
        {/* <BreadcrumbItem active><a href="/dashboard/dailyUse">Daily Usage Water</a></BreadcrumbItem> */}
        <BreadcrumbItem active>
          <Link
            to={{
              pathname: "/dashboard/rdprDashboard",
            }}
            state={{ node_id, GP, village }}
          >
            Dashboard
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active><a href="/dashboard/dailyUse/nodeId">NodeId</a></BreadcrumbItem>
      </Breadcrumb>

      <h2 style={{ marginTop: '20px', fontFamily: 'monospace', lineHeight: '1.6' }}>
        <span style={{ fontWeight: 'bold' }}>RR NO:</span> {rr_no}  |
        <span style={{ fontWeight: 'bold' }}>GP Name:</span> {GPName}  |
        <span style={{ fontWeight: 'bold' }}>Village:</span> {village_name}  |
        <span style={{ fontWeight: 'bold' }}>Population:</span> {filterRow.length > 0 && filterRow?.[0]?.population} |
        <span style={{ fontWeight: 'bold' }}>pumpHp:</span> {pumpHp ?? 15}  |
        <span style={{ fontWeight: 'bold' }}>Node:</span> {node_id}
      </h2>


      {/* AG Grid */}
      {filterRow.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: '674px', width: '95%' }}>
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
            onCellClicked={handleCellClick}
          />
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: '674px', width: '70%' }}>
          <p>No Data Found</p>
        </div>
      )}

      {/* {node_id && (<Modal isOpen={load}
        toggle={() => setLoad(!load)} className="" style={{ maxWidth: '95%', width: '1400px' }}>
        <ModalHeader className="modal-lg" toggle={() => setLoad(!load)} ></ModalHeader>
        <ModalBody className="pb-3 px-sm-1 mx-20">
          <div>
            <LoadPop node_id={node_id} date={date} />
          </div>
        </ModalBody>
      </Modal>)} */}
    </>
  )
}

export default OverView
