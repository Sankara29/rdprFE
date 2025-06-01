

// import 'ag-grid-enterprise'
// import { AgGridReact } from 'ag-grid-react'
// import '/node_modules/ag-grid-community/styles/ag-grid.css'
// import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

// import {
//     useState, useRef, useEffect, useMemo
// } from 'react'
// import {
//     Row, Col, Label, Input, Button, Breadcrumb, BreadcrumbItem,
//     Card
// } from 'reactstrap'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { Info } from 'react-feather'
// import moment from 'moment'
// import API_URL from '../../../config'
// import Select from 'react-select'

// const TotalSupplyConsumption = () => {
//     const navigate = useNavigate()
//     const gridRef = useRef()
//     const { control } = useForm()
//     const location = useLocation();
//     const { node_id, GP, village } = location.state || {};

//     const [rowData, setRowData] = useState([])
//     const [filteredData, setFilteredData] = useState([])
//     const [nodeIdFilter, setNodeIdFilter] = useState("")
//     const [villageOptions, setVillageOptions] = useState([])
//     const [gpNameOptions, setGpNameOptions] = useState([])

//     const [selectedVillage, setSelectedVillage] = useState(null)
//     const [selectedGPName, setSelectedGPName] = useState(null)


//     const defaultColDef = useMemo(() => ({
//         sortable: true,
//         filter: true,
//         filterParams: { buttons: ["apply", "reset"] },
//         wrapHeaderText: true, // for AG Grid Enterprise >= 27
//         autoHeaderHeight: true
//     }), [])

//     const columnDefs = useMemo(() => [
//         // { headerName: 'ID', field: 'id', maxWidth: 68 },

//         { headerName: 'RR No', field: 'rr_no', maxWidth: 96 },
//         {
//             headerName: 'Node ID',
//             field: 'node_id',
//             maxWidth: 128,
//             valueGetter: params => `${params.data.node_id}`
//         },
//         { headerName: 'Gram panchayat', field: 'GPName', maxWidth: 138 },

//         { headerName: 'Village', field: 'village', maxWidth: 168 },
//         {
//             headerName: 'Date',
//             field: 'date',
//             maxWidth: 110,
//             valueFormatter: params =>
//                 params.value ? moment(params.value).format('MMM-DD-YYYY') : ''
//         },
//         {
//             headerName: 'Water Supplied (m³)',
//             field: 'water_usage',
//             maxWidth: 150,
//             headerClass: 'wrap-header',
//             cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
//             valueFormatter: params =>
//                 new Intl.NumberFormat('en-US').format((Math.abs(params.value / 1000)).toFixed(2)),
//             comparator: (a, b) => Math.abs(a) - Math.abs(b)
//         },
//         {
//             headerName: 'Energy Consumed (kWh)',
//             field: 'energy_usage',
//             maxWidth: 150,
//             headerClass: 'wrap-header',
//             cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
//             valueFormatter: params => {
//                 if (params.value == null) return 'N/A'
//                 return new Intl.NumberFormat('en-US').format(
//                     parseFloat(params.value).toFixed(2)
//                 )
//             },
//             comparator: (a, b) => (a ?? 0) - (b ?? 0), sort: 'desc'
//         },
//         {
//             headerName: 'Litres/kWh',
//             field: 'litr_per_kwh', // You can use a dummy field if needed
//             cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
//             valueFormatter: params => {
//                 const waterUsage = params.data?.water_usage;
//                 const energyUsage = params.data?.energy_usage;

//                 if (waterUsage == null || energyUsage == null || energyUsage === 0) {
//                     return '0';
//                 }

//                 const waterLitres = Math.abs(waterUsage); // Convert m³ to litres
//                 const ratio = waterLitres / Math.abs(energyUsage);

//                 return new Intl.NumberFormat('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                 }).format(ratio);
//             },
//             comparator: (a, b, nodeA, nodeB) => {
//                 const aRatio =
//                     nodeA.data?.energy_usage && nodeA.data?.water_usage
//                         ? (Math.abs(nodeA.data.water_usage) * 1000) / Math.abs(nodeA.data.energy_usage)
//                         : 0;
//                 const bRatio =
//                     nodeB.data?.energy_usage && nodeB.data?.water_usage
//                         ? (Math.abs(nodeB.data.water_usage) * 1000) / Math.abs(nodeB.data.energy_usage)
//                         : 0;
//                 return aRatio - bRatio;
//             },
//             maxWidth: 130,
//         }
//         ,
//         {
//             headerName: 'Pump Capacity', field: 'pumpHB', maxWidth: 108, valueFormatter: params => {
//                 if (params.data?.pumpHB == null) {
//                     return 0;
//                 }
//                 return params.data?.pumpHB;
//             }
//         },

//         // {
//         //     headerName: 'More Info',
//         //     maxWidth: 148,
//         //     cellStyle: { textAlign: 'center', padding: 0 },
//         //     cellRendererFramework: params => (
//         //         <Button
//         //             color="primary"
//         //             style={{
//         //                 width: '100%', height: '80%',
//         //                 display: 'flex', alignItems: 'center', justifyContent: 'center'
//         //             }}
//         //             onClick={() => navigate('/dashboard/dailyUse/nodeId', {
//         //                 state: { node_id: params.data.node_id }
//         //             })}
//         //         >
//         //             <Info size={16} className="me-1" />
//         //             More Info
//         //         </Button>
//         //     )
//         // }
//     ], [navigate])

//     const onGridReady = params => {
//         gridRef.current = params.api
//     }

//     const fetchData = async () => {
//         try {
//             const [waterRes, energyRes] = await Promise.all([
//                 fetch(API_URL + "/getDailyWaterUsage"),
//                 fetch("https://testpms.ms-tech.in/v15/getDlReport")
//             ])

//             const [waterData, energyData] = await Promise.all([
//                 waterRes.json(),
//                 energyRes.json()
//             ])

//             const unique = (arr, key) => [...new Map(arr.map(item => [item[key], item])).values()];
//             if (waterData.statusCode === 200 && energyData.statusCode === 200) {
//                 const mergedData = waterData.data.map(waterEntry => {


//                     const match = energyData.data.find(e =>
//                         e.gwid == waterEntry.node_id &&
//                         moment(e.timeclock).subtract(1, 'day').isSame(waterEntry.date, 'day')
//                     )

//                     return {
//                         ...waterEntry,
//                         energy_usage: match?.daily_whimp / 1000 ?? null
//                     }
//                 })

//                 const sorted = mergedData.sort((a, b) =>
//                     new Date(b.date) - new Date(a.date)
//                 )

//                 setRowData(sorted)
//                 setFilteredData(sorted)

//                 setVillageOptions(unique(sorted, 'village').map(v => ({
//                     label: v.village,
//                     value: v.village
//                 })))

//                 setGpNameOptions(unique(sorted, 'GPName').map(g => ({
//                     label: g.GPName,
//                     value: g.GPName
//                 })))

//             }
//         } catch (error) {
//             console.error('Error fetching data:', error)
//         }
//     }

//     useEffect(() => {
//         fetchData()
//         const intervalId = setInterval(fetchData, 5 * 60 * 1000)
//         return () => clearInterval(intervalId)
//     }, [])

//     useEffect(() => {
//         const filtered = rowData.filter(item =>
//             item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
//         )
//         setFilteredData(filtered)
//     }, [nodeIdFilter, rowData])

//     const nextPage = (event) => {
//         const nodeId = event?.node_id
//         const GP = event?.GPName
//         const village = event?.village
//         const rr_no = event?.rr_no
//         const pumpHp = event?.pumpHB
//         console.log(selectedGPName)
//         if (nodeId) {
//             navigate('/dashboard/dailyUse/nodeId', {
//                 state: { node_id: nodeId, GP: selectedGPName != null && selectedGPName?.value, village: selectedVillage != null && selectedVillage.value, rr_no, GPName: GP, village_name: village, pumpHp }
//             })
//         }
//     }

//     const handleCellRightClick = event => {
//         if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return
//         event.event.preventDefault()

//         nextPage(event.data)
//     }
//     const handleCellClick = (event) => {
//         nextPage(event.data);
//     };
//     useEffect(() => {
//         let filtered = [...rowData]

//         if (nodeIdFilter.trim()) {
//             filtered = filtered.filter(item =>
//                 item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
//             )
//         }

//         if (selectedGPName) {
//             filtered = filtered.filter(item => item.GPName === selectedGPName.value)
//         }

//         if (selectedVillage) {
//             filtered = filtered.filter(item => item.village === selectedVillage.value)
//         }

//         setFilteredData(filtered)
//     }, [nodeIdFilter, selectedGPName, selectedVillage, rowData])
//     useEffect(() => {
//         if (GP) {
//             setSelectedGPName({ label: GP, value: GP })
//         }
//         if (village) {
//             setSelectedVillage({ label: village, value: village })
//         }
//         // if (node_id) {
//         //   setNodeIdFilter(node_id)
//         // }
//     }, [GP, village])
//     useEffect(() => {
//         if (selectedGPName && !village) {
//             const villagesUnderGP = rowData
//                 .filter(item => item.GPName === selectedGPName.value)
//                 .map(v => ({ label: v.village, value: v.village }));

//             // Remove duplicates
//             const uniqueVillages = [...new Map(villagesUnderGP.map(item => [item.value, item])).values()];

//             setVillageOptions(uniqueVillages);

//             // Optional: reset selected village if it's not in the new list
//             if (selectedVillage && !uniqueVillages.some(v => v.value === selectedVillage.value)) {
//                 setSelectedVillage(null);
//             }
//         } else {
//             // If no GP selected, show all villages
//             const allVillages = rowData.map(v => ({ label: v.village, value: v.village }));
//             const uniqueVillages = [...new Map(allVillages.map(item => [item.value, item])).values()];
//             setVillageOptions(uniqueVillages);
//         }
//     }, [selectedGPName, rowData, village]);

//     return (
//         <>
//             {/* <Breadcrumb>
//                  <BreadcrumbItem><a href="/dashboard/rdprDashboard">Dashboard</a></BreadcrumbItem> 
//             <BreadcrumbItem active><a href="/dashboard/dailyUse">Daily Usage</a></BreadcrumbItem> 
//             </Breadcrumb> */}
//             <Card style={{ width: '118%', padding: '10px' }}>
//                 <h3>Daily Stats </h3>

//                 <Row className="mb-2">
//                     <Col md='3'>
//                         <Label>Filter by Node ID</Label>
//                         <Input
//                             type="text"
//                             placeholder="Enter Node ID..."
//                             value={nodeIdFilter}
//                             onChange={e => setNodeIdFilter(e.target.value)}
//                         />
//                     </Col>
//                     <Col md='3'>
//                         <Label>Filter by GPName</Label>
//                         <Select
//                             isClearable
//                             value={selectedGPName}
//                             onChange={setSelectedGPName}
//                             options={gpNameOptions}
//                             classNamePrefix='select'
//                             placeholder="Select GP Name"
//                         />
//                     </Col>

//                     <Col md='3'>
//                         <Label>Filter by Village</Label>
//                         <Select
//                             isClearable
//                             value={selectedVillage}
//                             onChange={setSelectedVillage}
//                             options={villageOptions}
//                             classNamePrefix='select'
//                             placeholder="Select Village"
//                         />
//                     </Col>
//                 </Row>

//                 <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
//                     {filteredData.length > 0 ? (
//                         <AgGridReact
//                             ref={gridRef}
//                             rowData={filteredData}
//                             columnDefs={columnDefs}
//                             animateRows
//                             rowSelection="multiple"
//                             pagination
//                             paginationPageSize={12}
//                             defaultColDef={defaultColDef}
//                             onGridReady={onGridReady}
//                             onCellContextMenu={handleCellRightClick}
//                             onCellClicked={handleCellClick}
//                         />
//                     ) : (
//                         <p>No Data Found</p>
//                     )}
//                 </div>
//             </Card>
//         </>
//     )
// }

// export default TotalSupplyConsumption


import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Row, Col, Label, Button, Breadcrumb, BreadcrumbItem, Input, Card } from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import API_URL from '../../../config'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'
import { Info } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'

const TotalSupplyConsumption = () => {
  const navigate = useNavigate()
  const gridRef = useRef()
  const { control } = useForm()
  const location = useLocation();
  const { node_id, GP, village } = location.state || {};
  const [rowData, setRowData] = useState([])
  const [filterRow, setFilterRow] = useState([])
  const [district, setDistrict] = useState([])
  const [taluk, setTaluk] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedTaluk, setSelectedTaluk] = useState(null)
  const [gpOptions, setGpOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);

  const [selectedGP, setSelectedGP] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([
    { label: 'Bangalore', value: 'Bangalore' },
  ])
  const [selectedFakeDistrict, setSelectedFakeDistrict] = useState('Bangalore')

  const [nodeIdFilter, setNodeIdFilter] = useState("")
  const isMobileDevice = () =>
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const columnDefs = useMemo(() => [
    // { headerName: 'Id', field: 'id', maxWidth: 88 },
    { headerName: 'Village', field: 'village', maxWidth: 148 },
    { headerName: 'RR No', field: 'rr_no', maxWidth: 108 },
    {
      headerName: 'Node Id', field: 'node_id', maxWidth: 140,
      valueGetter: params => {
        return `${params.data.node_id}`
      }
    },

    {
      headerName: 'Water-today(m³)', field: 'today_water_consumption', maxWidth: 259, sort: 'desc',
      sortIndex: 0, valueGetter: (params) => {
        const value = params.data.today_water_consumption;
        if (value === undefined || value === null) return null;
        return Number(value) / 1000; // return number for sorting
      },
      valueFormatter: (params) => {
        if (params.value === undefined || params.value === null) return '';
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
      }
    },
    {
      headerName: 'Energy-today(Kwh)', field: 'today_energy_consumption', maxWidth: 248, valueGetter: (params) => {
        const value = params.data.today_energy_consumption;
        if (value === undefined || value === null || value === 'Null') return null;

        const formatted = Number(value).toFixed(2);
        return new Intl.NumberFormat('en-US').format(formatted);
      }
    },
    // { headerName: 'Flowrate(m³/h)', field: 'flowrate', maxWidth: 148 },
    {
      headerName: 'Last Seen', field: 'datetime', maxWidth: 220, valueFormatter: (params) => {
        return params.value ? moment(params.value).format('MMM-DD HH:mm') : '';
      }
    },

    { headerName: 'GPName', field: 'GPName', maxWidth: 148 },
    { headerName: 'Taluk', field: 'taluk', maxWidth: 148 },


  ], [navigate])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,

    flex: 1,
    filterParams: { buttons: ["apply", "reset"] },
    wrapHeaderText: true, // for AG Grid Enterprise >= 27
    autoHeaderHeight: true
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
            setRowData(data.data);
            setFilterRow(data.data);

            // Extract unique values
            // const taluks = [...new Set(data.data.map(item => item.taluk))];
            // const gps = [...new Set(data.data.map(item => item.GPName))];
            // const villages = [...new Set(data.data.map(item => item.village))];

            // setTaluk(taluks.map(item => ({ label: item, value: item })));
            // setGpOptions(gps.map(item => ({ label: item, value: item })));
            // setVillageOptions(villages.map(item => ({ label: item, value: item })));
            const taluks = [...new Set(data.data.map(item => item.taluk))].sort();
            const gps = [...new Set(data.data.map(item => item.GPName))].sort();
            const villages = [...new Set(data.data.map(item => item.village))].sort();

            setTaluk(taluks.map(item => ({ label: item, value: item })));
            setGpOptions(gps.map(item => ({ label: item, value: item })));
            setVillageOptions(villages.map(item => ({ label: item, value: item })));

          }
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);



  useEffect(() => {
    let filtered = [...rowData];

    if (nodeIdFilter.trim() !== "") {
      filtered = filtered.filter(item =>
        item.node_id?.toLowerCase().includes(nodeIdFilter.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(item => item.taluk === selectedDistrict.value);
    }

    if (selectedGP) {
      filtered = filtered.filter(item => item.GPName === selectedGP.value);
    }

    if (selectedVillage) {
      filtered = filtered.filter(item => item.village === selectedVillage.value);
    }

    setFilterRow(filtered);
  }, [nodeIdFilter, rowData, selectedDistrict, selectedGP, selectedVillage]);

  const nextPage = (event) => {
    const nodeId = event?.node_id
    const GP = event?.GPName
    const village = event?.village
    const rr_no = event?.rr_no
    // const pumpHp = event?.pumpHB
    console.log(selectedGP)
    if (nodeId) {
      navigate('/dashboard/dailyUse/nodeId', {
        state: { node_id: nodeId, GP: selectedGP != null && selectedGP?.value, village: selectedVillage != null && selectedVillage.value, rr_no, GPName: GP, village_name: village }
      })
    }
  }

  const handleCellRightClick = event => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return
    event.event.preventDefault()

    nextPage(event.data)
  }
  const handleCellClick = (event) => {
    nextPage(event.data);
  };

  useEffect(() => {
    if (GP) {
      setSelectedGP({ label: GP, value: GP })
    }
    if (village) {
      setSelectedVillage({ label: village, value: village })
    }
    // if (node_id) {
    //   setNodeIdFilter(node_id)
    // }
  }, [GP, village])
  // useEffect(() => {
  //   if (selectedGP) {
  //     const filteredVillages = rowData
  //       .filter(item => item.GPName === selectedGP.value)
  //       .map(item => item.village);

  //     const uniqueVillages = [...new Set(filteredVillages)].map(v => ({
  //       label: v,
  //       value: v
  //     }));

  //     setVillageOptions(uniqueVillages);
  //     setSelectedVillage(null); // clear village when GP changes
  //   } else {
  //     // if GP not selected, show all villages
  //     const allVillages = [...new Set(rowData.map(item => item.village))].map(v => ({
  //       label: v,
  //       value: v
  //     }));
  //     setVillageOptions(allVillages);
  //   }
  // }, [selectedGP, rowData]);
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


  return (
    <Card style={{ width: "118%", padding: '10px' }}>


      <h1>Energy & Water Stats Of today</h1>

      <Row style={{ alignItems: 'center', display: 'flex', marginBottom: "20px" }}>

        {/* Node ID Text Filter */}
        <Col md='3' sm='8'>
          <div className=''>
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
        <Col md="3">
          <Label>District </Label>
          <Select
            options={districtOptions}
            value={selectedFakeDistrict}
            onChange={setSelectedFakeDistrict}
            isClearable
            placeholder="Select District"
            theme={selectThemeColors}
          />
        </Col>
        <Col md="3">
          <Label>Taluk</Label>
          <Select
            options={taluk}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            isClearable
            placeholder="Select Taluk"
            theme={selectThemeColors}
          />
        </Col>

        <Col md="3">
          <Label>GP Name</Label>
          <Select
            options={gpOptions}
            value={selectedGP}
            onChange={setSelectedGP}
            isClearable
            placeholder="Select GP Name"
            theme={selectThemeColors}
          />
        </Col>

        <Col md="3">
          <Label>Village</Label>
          <Select
            options={villageOptions}
            value={selectedVillage}
            onChange={setSelectedVillage}
            isClearable
            placeholder="Select Village"
            theme={selectThemeColors}
          />
        </Col>

      </Row>

      {/* AG Grid */}
      {filterRow.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: '674px', width: '100%' }}>
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
    </Card>
  )
}

export default TotalSupplyConsumption

