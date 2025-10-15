
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
import dayjs from 'dayjs'

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
  // Function to calculate the recent node count
  const calculateRecentNodeCount = () => {
    const now = new Date();

    return filterRow.filter(item => {
      const capturedTime = new Date(item.captureddatetime);
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
    { headerName: 'Village Name', field: 'village_name', maxWidth: 200 },



    {
      headerName: 'Node Id', field: 'gwid', maxWidth: 138, valueFormatter: (params) => {


        return params.value ? params.value : 'Null';
      },
    },
    {
      headerName: 'Tank Node', field: 'tank_node', maxWidth: 188, valueFormatter: (params) => {


        return params.value ? params.value : 'Null';
      },
    },
    {
      headerName: 'RR No', field: 'rr_no', maxWidth: 138, valueFormatter: (params) => {


        return params.value ? params.value : 'Null';
      },
    },
    {
      headerName: 'Water level', field: 'water_level', maxWidth: 138, valueFormatter: (params) => {


        return params.value ? params.value : 'Null';
      },
    },
    {
      headerName: 'Battery percentage', field: 'battery_percentage', maxWidth: 138, valueFormatter: (params) => {


        return params.value ? params.value : 'Null';
      },
    },
    {
      headerName: 'Last Seen',
      field: 'datetime',
      maxWidth: 180,
      valueGetter: (params) => {
        return params.data?.datetime;
      },
      valueFormatter: (params) => {


        return params.value ? dayjs(params.value).format('MMM-DD-YYYY') : 'Null';
      },

    }

    ,
    // { headerName: 'Installed At', field: 'created_at', maxWidth: 300 },

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
  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + '/getTankNodes')
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            const sortedData = data.data
              .map(item => ({
                ...item,
                captureddatetime: item.datetime?.split(' ')[0] // Keep only YYYY-MM-DD
              }))
              .sort((a, b) =>
                new Date(b.captureddatetime) - new Date(a.captureddatetime)
              )
            setRowData(sortedData)

            console.log(sortedData, "4")
            setFilterRow(sortedData)

            // const getUniqueOptions = (arr, key) => [...new Set(arr.map(item => item[key]))]
            //   .map(val => ({ label: val, value: val }))


            const villages = [...new Set(data.data.map(item => item.village_name
            ))].sort();
            // setGpOptions(gps.map(item => ({ label: item, value: item })));
            setVillageOptions(villages.map(item => ({ label: item, value: item })));
          }
        })
    }

    fetchData(); // Initial fetch on mount

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [])

  // Apply all filters
  useEffect(() => {
    let filtered = [...rowData]

    // if (selectedDistrict) {
    //   filtered = filtered.filter(item => item.district === selectedDistrict.value)
    // }

    // if (selectedTaluk) {
    //   filtered = filtered.filter(item => item.taluk === selectedTaluk.value)
    // }

    if (nodeIdFilter) {
      filtered = filtered.filter(item =>
        item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
      )
    }

    // if (selectedGP) {
    //   filtered = filtered.filter(item => item.GPName === selectedGP.value);
    // }

    if (selectedVillage) {
      filtered = filtered.filter(item => item.village_name === selectedVillage.value);
    }

    setFilterRow(filtered)
  }, [selectedDistrict, selectedTaluk, nodeIdFilter, rowData, selectedGP, selectedVillage])

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
        navigate('/dashboard/energymeter/nodeId', {
          state: { node_id: nodeId }
        });
      }
    }
  };
  // useEffect(() => {
  //   if (selectedGP) {
  //     const filteredVillages = rowData
  //       .filter(item => item.GPName === selectedGP.value)
  //       .map(item => item.village);

  //     const uniqueVillages = [...new Set(filteredVillages)]
  //       .sort()
  //       .map(v => ({
  //         label: v,
  //         value: v
  //       }));

  //     setVillageOptions(uniqueVillages);
  //     setSelectedVillage(null); // clear village when GP changes
  //   } else {
  //     // if GP not selected, show all villages sorted
  //     const allVillages = [...new Set(rowData.map(item => item.village))]
  //       .sort()
  //       .map(v => ({
  //         label: v,
  //         value: v
  //       }));
  //     setVillageOptions(allVillages);
  //   }
  // }, [selectedGP, rowData]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem>
        <BreadcrumbItem active><a href="/dashboard/tankNode">Tank Node</a></BreadcrumbItem>
      </Breadcrumb>

      <h1>Tank Node Data</h1>

      <Row style={{ alignItems: 'center', display: 'flex' }}>
        {/* <FilterSelect label="District" options={districtOptions} selected={selectedDistrict} onChange={setSelectedDistrict} control={control} name="district" />
        <FilterSelect label="Taluk" options={talukOptions} selected={selectedTaluk} onChange={setSelectedTaluk} control={control} name="taluk" />
        <FilterSelect label="GPName" options={gpOptions} selected={selectedGP} onChange={setSelectedGP} control={control} name="GPName" /> */}
        <FilterSelect label="Village" options={villageOptions} selected={selectedVillage} onChange={setSelectedVillage} control={control} name="Village" />
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

        {/* Count Display */}
        <Col md='3' sm='8'>
          <div><h4 style={{ margin: '10px 0px' }}>Total Installed Count - {filterRow.length}</h4></div>
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
          // onCellContextMenu={handleCellRightClick}
          />
        ) : <p>No Data Found</p>}
      </div>
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

