

import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Card, CardBody, CardTitle, CardText, Row, Col, Label, Button,
  Breadcrumb, BreadcrumbItem,
  Input
} from 'reactstrap';
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config';
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather';
import { useNavigate } from 'react-router-dom'
import { data } from 'jquery';
import moment from 'moment';

const OverView = () => {
  const navigate = useNavigate();
  const { control } = useForm({});
  const gridRef = useRef();

  const [rowData, setRowData] = useState([]);
  const [filterRow, setFilterRow] = useState([]);
  const [district, setDistrict] = useState([]);
  const [taluk, setTaluk] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTaluk, setSelectedTaluk] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [recentNodeCount, setRecentNodeCount] = useState(0)
  const lastRightClickRef = useRef(0)

  const calculateRecentNodeCount = () => {
    const now = new Date();
    return filterRow.filter(item => {
      const capturedTime = new Date(item.last_communicated_datetime);
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
  // Function to calculate the recent node count
  // const calculateRecentNodeCount = () => {

  //   const dataj = filterRow.filter(item => {

  //     const diffMins = item.flowrate > 0;
  //     return diffMins;
  //   });
  //   return dataj.length;
  // }
  function formatWaterLiters(liters) {
    if (liters >= 1000) {
      return (liters / 1000).toFixed(2) + ' kL';
    } else {
      return liters.toFixed(2) + ' L';
    }
  }
  useEffect(() => {
    setRecentNodeCount(calculateRecentNodeCount())
  }, [filterRow])
  const columnDefs = useMemo(() => [
    // { headerName: 'Id', field: 'id', maxWidth: 78 },
    { headerName: 'Village Name', field: 'village', maxWidth: 150 },
    {
      headerName: `Node Id (🟢 ${recentNodeCount})`,
      field: 'node_id',
      maxWidth: 180,
      cellRendererFramework: (params) => {
        const dataTime = new Date(params.data.last_communicated_datetime);
        const currentTime = new Date();

        const isToday =
          dataTime.getFullYear() === currentTime.getFullYear() &&
          dataTime.getMonth() === currentTime.getMonth() &&
          dataTime.getDate() === currentTime.getDate();
        // const isOnline = params.data.flowrate > 0;
        const handleClick = () => {
          navigate('/dashboard/watermeter/nodeId', {
            state: { node_id: params.data.node_id }
          });
        };

        return (
          <span
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              // color: isOnline ? 'green' : 'red',
              fontWeight: 'bold'
            }}
            title="Click for more info"
          >
            {params.data.node_id} {isToday ? '🟢' : '🔴'}
          </span>
        );
      }
    },

    {
      headerName: 'Current Reading (m³)', field: 'live_water_data', maxWidth: 185
      , valueGetter: (params) => {
        const value = params.data.live_water_data;
        if (value === undefined || value === null) return null;
        return Number(value) / 1000; // return number for sorting
      },
      valueFormatter: (params) => {
        if (params.value === undefined || params.value === null) return '';
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
      }
    },
    // {
    //   headerName: 'today consumption(m³)',
    //   field: 'water_consumption_change',
    //   maxWidth: 220,
    //   valueGetter: params => {
    //     const value = params.data.water_consumption_change;
    //     return value !== undefined && value !== null ? (Number(value) / 1000) : null;
    //   },
    //   valueFormatter: params => {
    //     return params.value !== null ? params.value.toFixed(2) : '';
    //   }
    // },
    {
      headerName: 'flow rate(m³/h)', field: 'flowrate', maxWidth: 150, valueFormatter: params => {
        return params.value !== null ? params.value.toFixed(2) : 0;
      }
    },
    {
      headerName: 'lastSeen', field: 'last_communicated_datetime', maxWidth: 260, valueFormatter: (params) => {
        return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
      }
    },
    {
      headerName: 'min_flowrate(m³/h)', field: 'min_flowrate', maxWidth: 179, valueFormatter: params => {
        return params.value !== null ? params.value.toFixed(2) : 0;
      }
    },
    {
      headerName: 'median_flowrate(m³/h)', field: 'median_flowrate', maxWidth: 200, valueFormatter: params => {
        return params.value !== null ? params.value.toFixed(2) : 0;
      }
    },
    { headerName: 'max_flowrate(m³/h)', field: 'max_flowrate', maxWidth: 200 },
    {
      headerName: 'More Info',
      cellRendererFramework: (params) => (
        <Button
          color="primary"
          style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => navigate('/dashboard/watermeter/nodeId', {
            state: { node_id: params.data.node_id }
          })}
        >
          <Info style={{ marginRight: '8px' }} />
          More Info
        </Button>
      ),
      maxWidth: 148,
      cellStyle: { textAlign: 'center', padding: 0 }
    },
    { headerName: 'GPName', field: 'GPName', maxWidth: 138 },
    { headerName: 'RR No', field: 'rr_no', maxWidth: 138 },
  ], [navigate, recentNodeCount]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    filterParams: { buttons: ["apply", "reset"] },
  }), []);

  const onGridReady = (params) => {
    gridRef.current = params.api;
  };

  // Main API Fetch
  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + "/getLiveWaterData")
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            const sortedData = data.data.sort((a, b) =>
              new Date(b.last_communicated_datetime) - new Date(a.last_communicated_datetime)
            )
            setRowData(sortedData);
            setFilterRow(sortedData);

            const districts = [...new Set(sortedData.map(item => item.district))]
              .map(d => ({ label: d, value: d }));
            const taluks = [...new Set(sortedData.map(item => item.taluk))]
              .map(t => ({ label: t, value: t }));

            setDistrict(districts);
            setTaluk(taluks);
          }
        });
    };

    fetchData(); // Initial fetch on mount

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Every 5 mins

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  // Unified Filtering Logic
  const filterData = (districtVal, talukVal, searchVal) => {
    let filtered = rowData;

    if (districtVal) {
      filtered = filtered.filter(item => item.district === districtVal);
    }

    if (talukVal) {
      filtered = filtered.filter(item => item.taluk === talukVal);
    }

    if (searchVal) {
      filtered = filtered.filter(item =>
        item.node_id && item.node_id.toLowerCase().includes(searchVal.toLowerCase())
      );
    }

    setFilterRow(filtered);
  };

  const handleChangeDistrict = (selected) => {
    setSelectedDistrict(selected);
    setSelectedTaluk(null);
    setSearchText('');

    if (selected) {
      const filteredTaluks = [...new Set(
        rowData.filter(item => item.district === selected.value).map(item => item.taluk)
      )].map(t => ({ label: t, value: t }));

      setTaluk(filteredTaluks);
    } else {
      const allTaluks = [...new Set(rowData.map(item => item.taluk))]
        .map(t => ({ label: t, value: t }));
      setTaluk(allTaluks);
    }

    filterData(selected?.value, null, '');
  };

  const handleChangeTaluk = (selected) => {
    setSelectedTaluk(selected);
    filterData(selectedDistrict?.value, selected?.value, searchText);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    filterData(selectedDistrict?.value, selectedTaluk?.value, value);
  };
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
        navigate('/dashboard/watermeter/nodeId', {
          state: { node_id: nodeId }
        });
      }
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/dashboard/rdprDashboard">dashboard</a>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <a href="/dashboard/watermeter">waterMeter</a>
        </BreadcrumbItem>
      </Breadcrumb>

      <h1>Water Meter Data</h1>

      <Row className='align-items-center'>
        {/* District Filter */}
        <Col md='3' sm='6'>
          <Label className='form-label'>Select District</Label>
          <Controller
            control={control}
            name='districtName'
            render={({ field }) => (
              <Select
                isClearable
                value={selectedDistrict}
                options={district}
                classNamePrefix='select'
                theme={selectThemeColors}
                className={classnames('react-select')}
                {...field}
                onChange={handleChangeDistrict}
              />
            )}
          />
        </Col>

        {/* Taluk Filter */}
        <Col md='3' sm='6'>
          <Label className='form-label'>Select Taluk</Label>
          <Controller
            control={control}
            name='talukName'
            render={({ field }) => (
              <Select
                isClearable
                value={selectedTaluk}
                options={taluk}
                classNamePrefix='select'
                theme={selectThemeColors}
                className={classnames('react-select')}
                {...field}
                onChange={handleChangeTaluk}
              />
            )}
          />
        </Col>

        {/* Node ID Search */}
        <Col md='3' sm='6'>
          {/* <div className='mb-1'> */}
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
          {/* </div> */}
        </Col>
        {/* Count */}
        <Col md='3' sm='6'>
          <h5 className='mt-2'>Total Installed: {filterRow.length}</h5>
        </Col>
      </Row>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine mt-2" style={{ height: '674px', width: '95%' }}>
        {filterRow.length > 0 ? (
          <AgGridReact
            ref={gridRef}
            rowData={filterRow}
            columnDefs={columnDefs}
            animateRows
            rowSelection="multiple"
            pagination
            paginationPageSize={12}
            paginationAutoPageSize={false}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}

            onCellContextMenu={handleCellRightClick}
          />
        ) : (
          <p className="mt-4">No Data Found</p>
        )}
      </div>
    </>
  );
};

export default OverView;
