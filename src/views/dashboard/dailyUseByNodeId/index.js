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
import Loader from '../rdprDashboard/Loader'
import dayjs from 'dayjs'

const OverView = () => {
  const navigate = useNavigate()
  const gridRef = useRef()
  const gridRef2 = useRef()
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
  const [todayCon, setTodayCon] = useState([]);
  const [connectId, setConnectionId] = useState(null)
  const [billingDetails, setBillingDetails] = useState([])

  const columnDefs = useMemo(() => [

    { headerName: 'RR No', field: 'rr_no', maxWidth: 96 },
    { headerName: 'Village', field: 'village', maxWidth: 188 },
    { headerName: 'Gram panchayat', field: 'GPName', maxWidth: 128 },
    {
      headerName: 'date', field: 'date', maxWidth: 100, valueFormatter: (params) => {
        return params.value ? dayjs(params.value).format('MMM-DD-YYYY') : '';
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
        return year && month ? dayjs(`${year}-${month}-01`).format('MMM-YYYY') : '';
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


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: { buttons: ["apply", "reset"] }, wrapHeaderText: true, // for AG Grid Enterprise >= 27
    autoHeaderHeight: true
  }), [])

  const onGridReady = params => {
    gridRef.current = params.api
  }
  const onGridReady2 = params => {
    gridRef2.current = params.api
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {

      const [waterRes, energyRes, todayRes] = await Promise.all([
        fetch(API_URL + `/getDailyWaterUsage?nodeId=${node_id}`),
        fetch(`https://testpms.ms-tech.in/v15/getDlReport?node_id=${node_id}`),
        fetch("https://testpms.ms-tech.in/v15/getLiveDataTemp")
      ])

      const [waterData, energyData, todayData] = await Promise.all([
        waterRes.json(),
        energyRes.json(),
        todayRes.json()
      ])

      if (waterData.statusCode === 200 && energyData.statusCode === 200) {
        setTodayCon(todayData.data)
        const mergedData = waterData.data.map(waterEntry => {
          const match = energyData.data.find(e =>
            e.gwid == waterEntry.node_id &&
            dayjs(e.timeclock).subtract(1, 'day').isSame(waterEntry.date, 'day')
          )
          // console.log(match?.daily_whimp, match?.daily_whimp / 1000, waterEntry)
          return {
            ...waterEntry,
            energy_usage: match?.daily_whimp / 1000 ?? null
          }
        })



        setRowData(mergedData)
        // setFilteredData(mergedData)
      }
    }

    fetchData(); // Initial fetch on mount

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [node_id])

  useEffect(() => {
    const fetchConnection = async () => {
      const res = await fetch(API_URL + `/getrrNoAndConnectionMapp?rrNo=${rr_no}`);
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

  // Filter logic
  useEffect(() => {
    let filtered = [...rowData]



    if (nodeIdFilter.trim() !== "") {
      filtered = filtered.filter(item =>
        item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
      )
    }

    const todays = todayCon.filter((data) => data.node_id == node_id);
    const todayDateStr = new Date().toISOString().split('T')[0];

    // Check if `todays[0]` exists and has today's date
    const isTodayDataValid = todays[0] && todays[0].datetime?.startsWith(todayDateStr);

    const combined = isTodayDataValid
      ? [{
        rr_no: todays[0].rr_no,
        node_id: todays[0].node_id,
        village: todays[0].village,
        GPName: todays[0].GPName,
        water_usage: todays[0].today_water_consumption,
        energy_usage: todays[0].today_energy_consumption,
        date: todays[0].datetime,
        pumpHB: filtered?.[1]?.pumpHB
      }, ...filtered]
      : [...filtered];

    setFilterRow(combined);
  }, [nodeIdFilter, rowData])

  const handleCellRightClick = (event) => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return
    event.event.preventDefault()
    setDate(event?.data?.date)
    const GP = event?.data?.GPName
    const village = event?.data?.village
    const rr_no = event?.data?.rr_no

    const population = event?.data?.population ? event?.data?.population : filterRow[2].population
    const pumpHp = event?.data?.pumpHB ? event?.data?.pumpHB : filterRow[2].pumpHB

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
    const population = event?.data?.population ? event?.data?.population : filterRow[2].population
    const pumpHp = event?.data?.pumpHB ? event?.data?.pumpHB : filterRow[2].pumpHB
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
        <span style={{ fontWeight: 'bold' }}>Population:</span> {filterRow.length > 0 && filterRow?.[2]?.population} |
        <span style={{ fontWeight: 'bold' }}>pumpHp:</span> {filterRow.length > 0 && filterRow?.[2]?.pumpHB}  |
        <span style={{ fontWeight: 'bold' }}>Node:</span> {node_id} |
        <span style={{ fontWeight: 'bold' }}>Connection ID:</span>{connectId ?? 0}
      </h2>

      <h3 style={{ marginTop: '20px', marginBottom: '20px' }}>Day Wise Energy & Water Status</h3>
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
            paginationPageSize={10}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellContextMenu={handleCellRightClick}
            onCellClicked={handleCellClick}
          />
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: '14px', width: '100%' }}>
          <Loader />
        </div>
      )}

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
    </>
  )
}

export default OverView
