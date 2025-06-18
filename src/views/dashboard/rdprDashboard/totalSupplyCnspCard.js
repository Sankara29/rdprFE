


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
import { FaWater, FaSignal, FaBolt, FaTint, FaBroadcastTower, FaDatabase, FaClock } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap'

import React, { useContext } from 'react';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';


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
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [selectedGP, setSelectedGP] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([
    { label: 'Bangalore', value: 'Bangalore' },
  ])
  const [talukWiseEnergy, setTalukWiseEnergy] = useState([]);

  const [selectedFakeDistrict, setSelectedFakeDistrict] = useState('Bangalore')
  const lastRightClickRef = useRef(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTalukName, setSelectedTalukName] = useState(null)
  const [talukMonthwiseData, setTalukMonthwiseData] = useState([])

  const handleTalukCardClick = async (talukName) => {
    try {
      setSelectedTalukName(talukName)
      const response = await fetch(API_URL + `/getTalukWiseBillingByTalukName?taluk_name=${talukName}`)
      const data = await response.json()
      setTalukMonthwiseData(data.data || [])
      setModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch taluk data:', error)
    }
  }


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
    {
      headerName: 'Tank_Node', field: 'tank_node', maxWidth: 128, valueFormatter: (params) => {
        return params.value ? params.value : 'Null';
      }
    },
    {
      headerName: 'Water_Level', field: 'water_level', maxWidth: 133, valueFormatter: (params) => {
        return params.value ? params.value : 'Null';
      }
    },
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
    const fetchData = () => {
      fetch("https://testpms.ms-tech.in/v15/getDashBoardData")
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200 && data.data && data.data.length > 0) {
            setDashboardSummary(data.data[0])
          }
        })
        .catch(err => {
          console.error("Failed to fetch dashboard data:", err)
        })
    };
    fetchData();

    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    const fetchTalukWiseBilling = async () => {
      try {
        const res = await fetch("https://testpms.ms-tech.in/v15/getTalukWiseBilling");
        const result = await res.json();

        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const talukMap = {};

          result.data.forEach(({ taluk, cumKwhImp, total_water_supplied }) => {
            if (!talukMap[taluk]) {
              talukMap[taluk] = {
                totalKwh: 0,
                totalWater: 0
              };
            }
            talukMap[taluk].totalKwh += parseFloat(cumKwhImp || 0);
            talukMap[taluk].totalWater += parseFloat(total_water_supplied || 0);
          });

          const grouped = Object.entries(talukMap).map(([taluk, { totalKwh, totalWater }]) => ({
            taluk,
            totalKwh: totalKwh.toFixed(2),
            totalWater: totalWater.toFixed(2)
          }));

          setTalukWiseEnergy(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch taluk-wise billing:", error);
      }
    };

    fetchTalukWiseBilling();
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
    const delta = now - lastRightClickRef?.current
    lastRightClickRef.current = now
    if (delta < 400) {
      nextPage(event.data)
    }
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
  const [energyMeter, setEnergyMeter] = useState([])
  const [todayCommCount, setTodayCommCount] = useState(0)

  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + '/getInstalledNode')
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            const sortedData = data.data
              // .filter(item => new Date(item.created_at) > new Date('2025-05-01T00:00:00'))
              .map(item => ({
                ...item,
                captureddatetime: item.captureddatetime?.split(' ')[0] // Keep only YYYY-MM-DD
              }))
              .sort((a, b) =>
                new Date(b.captureddatetime) - new Date(a.captureddatetime)
              )
            setEnergyMeter(sortedData)
          }
        })
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])


  useEffect(() => {
    const fetchCommStatus = async () => {
      let count = 0
      const today = moment().format('MM/DD/YY') // Format as per API response

      const requests = energyMeter.map(async (item) => {
        const nodeId = item.node_id?.trim()
        if (!nodeId) return

        try {
          // https://api.ms-tech.in/v12/getnodestatus?gwid=NSRT000579
          const res = await fetch(`https://testpms.ms-tech.in/v15/gwid-status/${nodeId}`)
          const text = await res.json()

          const match = text?.timestamp_str
          if (match) {

            const commDate = match?.split(' ')[0]
            if (commDate === today) {
              count++
            }
          }
        } catch (err) {
          console.error(`Error for node ${nodeId}`, err)
        }
      })

      await Promise.all(requests)
      setTodayCommCount(count)
    }

    if (energyMeter.length > 0) {
      fetchCommStatus()
    }
  }, [energyMeter])

  const cardItems = [
    {
      label: 'Installed Starter Nodes',
      value: dashboardSummary?.installed_starter_node_count,
      color: '#4a90e2',
      icon: <FaBolt />,
    },
    {
      label: 'getTime Starter Nodes',
      value: todayCommCount,
      color: '#50c878',
      icon: <FaClock />,
    },
    {
      label: 'Communicated Starter Nodes',
      value: dashboardSummary?.communicating_node_count,
      color: '#50c878',
      icon: <FaSignal />,
    },
    {
      label: 'Water Meters Installed',
      value: dashboardSummary?.water_meter_installed,
      color: '#f5a623',
      icon: <FaTint />,
    },
    {
      label: 'Communicated Water Meters Today',
      value: dashboardSummary?.communicated_water_meter_today,
      color: '#9b51e0',
      icon: <FaWater />,
    },
    {
      label: 'Installed Tank Nodes',
      value: dashboardSummary?.installed_tank_node_count,
      color: '#e94e77',
      icon: <FaDatabase />,
    },
    {
      label: 'Communicated Tank Nodes Today',
      value: dashboardSummary?.communicated_tank_node_today,
      color: '#34495e',
      icon: <FaSignal />,
    },
  ];


  const steps = [

    {
      id: 'summary-card',
      text: 'Click This Card To View Monthly Energy Consumption and Water Supply',
      attachTo: {
        element: '.step-summary-card',
        on: 'bottom'
      },
      highlightClass: 'highlight-glow',
      buttons: [
        {
          text: 'Got it',
          action() {
            this.complete();
          }
        }
      ]
    }
  ];
  // const TourStartButton = () => {
  //   const tour = useContext(ShepherdTourContext);
  //   return <button onClick={() => tour.start()}>Start Tour</button>;
  // };
  const TourStartButton = () => {
    const tour = useContext(ShepherdTourContext);

    useEffect(() => {
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      if (!hasSeenTour && tour && talukWiseEnergy.length > 0) {
        tour.start();
        localStorage.setItem('hasSeenTour', 'true');
      }
    }, [tour, talukWiseEnergy]);

    return null; // nothing is rendered
  };
  // const TourPage = () => {
  const tourOptions = {
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      scrollTo: { behavior: 'smooth', block: 'center' }
    },
    useModalOverlay: true
  }
  // }
  return (
    <>
      <ShepherdTour steps={steps} tourOptions={tourOptions}>
        <TourStartButton />
        <Card style={{ width: "118%", padding: '10px' }}>



          {dashboardSummary && (
            <Card
              body
              style={{
                marginBottom: '30px',
                padding: '30px 40px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)',
                fontFamily: "'Poppins', sans-serif",
                color: '#2d3748',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <h4
                style={{
                  marginBottom: '30px',
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  color: '#2d3748',
                  letterSpacing: '1px',
                }}
              >
                📊 Installation & Communication Summary
              </h4>
              <Row style={{ margin: 0, gap: '20px', justifyContent: 'center' }}>
                {cardItems.map(({ label, value, color, icon }, idx) => (
                  <Col
                    key={idx}
                    md={2}
                    sm={6}
                    xs={12}
                    style={{
                      backgroundColor: '#f9f9fb',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px',
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div style={{ fontSize: '2rem', color, marginBottom: '10px' }}>{icon}</div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#718096',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {value}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
          {talukWiseEnergy.length > 0 && (
            <Card
              body
              className='step-summary-card'
              style={{
                marginBottom: '30px',
                padding: '30px 40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                fontFamily: "'Poppins', sans-serif",
                color: '#2d3748',
              }}
            >
              <h4 style={{ marginBottom: '20px' }}>📊 Taluk-wise Energy Consumption & Water Supplied</h4>
              <Row>
                {talukWiseEnergy.map(({ taluk, totalKwh, totalWater }, idx) => (
                  <Col md={3} key={idx} style={{ marginBottom: '15px' }}>
                    <div
                      onClick={() => handleTalukCardClick(taluk)}
                      style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        borderLeft: '6px solid #4a90e2',
                        height: '100%',
                      }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#555' }}>{taluk}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4a90e2', marginTop: '5px' }}>{totalKwh} kWh</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#20b2aa', marginTop: '5px' }}>{totalWater} L</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}


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
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            📅 Monthly Summary - {selectedTalukName}
          </ModalHeader>
          <ModalBody>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Energy (kWh)</th>
                  <th>Total Water Supplied (L)</th>
                </tr>
              </thead>
              <tbody>
                {talukMonthwiseData.length > 0 ? (
                  talukMonthwiseData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{parseFloat(item.total_energy).toLocaleString()}</td>
                      <td>{parseFloat(item.total_water_supplied).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
      </ShepherdTour>
    </>
  )
}

export default TotalSupplyConsumption

