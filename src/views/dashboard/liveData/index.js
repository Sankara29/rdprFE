import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Button, Breadcrumb, BreadcrumbItem, Input } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const OverView = () => {
  const navigate = useNavigate()
  const gridRef = useRef()
  const { control } = useForm()

  const [rowData, setRowData] = useState([])
  const [filterRow, setFilterRow] = useState([])
  const [district, setDistrict] = useState([])
  const [taluk, setTaluk] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedTaluk, setSelectedTaluk] = useState(null)
  const [nodeIdFilter, setNodeIdFilter] = useState("")
  const isMobileDevice = () =>
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const columnDefs = useMemo(() => [
    // { headerName: 'Id', field: 'id', maxWidth: 88 },
    { headerName: 'Village', field: 'village', maxWidth: 148 },
    // { headerName: 'RR No', field: 'rr_no', maxWidth: 108 },
    {
      headerName: 'Node Id', field: 'node_id', maxWidth: 140,
      valueGetter: params => {
        return `${params.data.node_id}`
      }
    },
    // {
    //   headerName: 'Live Water(m³)', field: 'live_water_data', maxWidth: 149, valueGetter: (params) => {
    //     const value = params.data.live_water_data;
    //     if (value === undefined || value === null) return null;

    //     const formatted = (Number(value) / 1000).toFixed(2);
    //     return new Intl.NumberFormat('en-US').format(formatted);
    //   }
    // },
    // {
    //   headerName: 'Live Energy(Kwh)', field: 'live_energy_data', maxWidth: 168, valueGetter: (params) => {
    //     const value = params.data.live_energy_data;
    //     if (value === undefined || value === null || value === 'Null') return null;

    //     const formatted = Number(value).toFixed(2);
    //     return new Intl.NumberFormat('en-US').format(formatted);
    //   }
    // },
    {
      headerName: 'Water-today(m³)', field: 'today_water_consumption', maxWidth: 159, valueGetter: (params) => {
        const value = params.data.today_water_consumption;
        if (value === undefined || value === null) return null;

        const formatted = (Number(value) / 1000).toFixed(2);
        return new Intl.NumberFormat('en-US').format(formatted);
      }
    },
    {
      headerName: 'Energy-today(Kwh)', field: 'today_energy_consumption', maxWidth: 178, valueGetter: (params) => {
        const value = params.data.today_energy_consumption;
        if (value === undefined || value === null || value === 'Null') return null;

        const formatted = Number(value).toFixed(2);
        return new Intl.NumberFormat('en-US').format(formatted);
      }
    },
    // { headerName: 'Flowrate(m³/h)', field: 'flowrate', maxWidth: 148 },
    {
      headerName: 'Last Seen', field: 'datetime', maxWidth: 220, valueFormatter: (params) => {
        return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
      }
    },
    {
      headerName: 'History',
      maxWidth: 128,
      cellStyle: { textAlign: 'center', padding: 0 },
      cellRendererFramework: (params) => {
        const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const handleContextMenu = (event) => {
          if (isMobileDevice()) return;
          event.preventDefault();
          navigate('/dashboard/liveData/nodeId', {
            state: { node_id: params.data.node_id }
          })
        };

        return (
          <div
            onContextMenu={handleContextMenu}
          // style={{ width: '100%', height: '100%' }}
          >
            <Button
              color="primary"
              style={{
                width: '100%',
                height: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() =>
                navigate('/dashboard/liveData/nodeId', {
                  state: { node_id: params.data.node_id }
                })
              }
            >
              <Info style={{ marginRight: '8px' }} />
              History
            </Button>
          </div>
        );
      }
    }
    ,
    {
      headerName: 'Energy Info',
      maxWidth: 128,
      cellStyle: { textAlign: 'center', padding: 0 },
      cellRendererFramework: (params) => {
        const handleContextMenu = (event) => {
          if (isMobileDevice()) return;
          event.preventDefault();
          navigate('/dashboard/liveData/energyByNodeId', {
            state: { node_id: params.data.node_id }
          });
        };

        return (
          <div className="button-cell" onContextMenu={handleContextMenu}>
            <Button
              color="warning"
              style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {
                navigate('/dashboard/liveData/energyByNodeId', {
                  state: { node_id: params.data.node_id }
                });
              }}
            >
              <Info style={{ marginRight: '8px' }} />
              Energy Info
            </Button>
          </div>
        );
      }
    },
    {
      headerName: 'Water Info',
      maxWidth: 128,
      cellStyle: { textAlign: 'center', padding: 0 },
      cellRendererFramework: (params) => {
        const handleContextMenu = (event) => {
          if (isMobileDevice()) return;
          event.preventDefault();
          navigate('/dashboard/liveData/waterByNodeId', {
            state: { node_id: params.data.node_id }
          });
        };

        return (
          <div className="button-cell" onContextMenu={handleContextMenu}>
            <Button
              color="info"
              style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {
                navigate('/dashboard/liveData/waterByNodeId', {
                  state: { node_id: params.data.node_id }
                });
              }}
            >
              <Info style={{ marginRight: '8px' }} />
              Water Info
            </Button>
          </div>
        );
      }
    },
    {
      headerName: 'DL Info',
      maxWidth: 128,
      cellStyle: { textAlign: 'center', padding: 0 },
      cellRendererFramework: (params) => {
        const handleContextMenu = (event) => {
          if (isMobileDevice()) return;
          event.preventDefault();
          navigate('/dashboard/DlReport', {
            state: { node_id: params.data.node_id }
          });
        };

        return (
          <div className="button-cell" onContextMenu={handleContextMenu}>
            <Button
              color="secondary"
              style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {
                navigate('/dashboard/DlReport', {
                  state: { node_id: params.data.node_id }
                });
              }}
            >
              <Info style={{ marginRight: '8px' }} />
              DL Info
            </Button>
          </div>
        );
      }
    },


  ], [navigate])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,

    flex: 1,
    filterParams: { buttons: ["apply", "reset"] }
  }), [])

  const onGridReady = params => {
    gridRef.current = params.api
  }

  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + "/getLiveDataTemp")
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            setRowData(data.data)
            setFilterRow(data.data)


          }
        })
    }

    fetchData(); // Initial fetch on mount

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [])

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



  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
        <BreadcrumbItem active><a href="/dashboard/liveData">OverAll Data</a></BreadcrumbItem>
      </Breadcrumb>

      <h1>Water Supplied Village Wise</h1>

      <Row style={{ alignItems: 'center', display: 'flex', marginBottom: "20px" }}>

        {/* Node ID Text Filter */}
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
