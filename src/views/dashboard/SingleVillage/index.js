


import React from 'react';
import { Card, CardBody, Button, CardHeader, Row, Col, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, Users } from 'react-feather';
import { useState, useEffect } from 'react';
import Icon from '@src/views/dashboard/controlPanelOnOff/icons/Icon Stat.svg'
import FlowChartImage1 from '@src/views/dashboard/controlPanelOnOff/icons/Group 427319542.jpg'
import OutPutControlData from './outputControlData'
import { format, parseISO } from 'date-fns'
import AssetInfoSideCard from './assetInformationSideCard'
import BelowTwoCard from './overallConsumption'
import { useThemeProps } from '@mui/material';
import InstallationDetails from './installtionData'
import API_URL from '../../../config';
import { useNavigate } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import CircularProgress from '@mui/material/CircularProgress'
import DataInsights from '../villageDataInsights'
import Logs from './logs'
import DistrictWiseSupplyAndConsumption from './../villageDataInsights/districtWiseSupplyAndConsumption'
import SessionWiseData from './../villageDataInsights/sessionWiseData'
import Load from './Load';
import PopulationCard from './PopullationCard';
import WaterSuppliedCard from './waterSuppliedCard';

const MySwal = withReactContent(Swal)

const Overview = () => {
    const navigate = useNavigate()

    const location = useLocation();
    const { selectedTaluk, selectedDistrict, village_name, population } = location.state || {};

    const [openModify, setOpenModify] = useState(false);
    const [mainDropDownData, setMainDropDownData] = useState(true);
    const [isCheckedMotorStatus, setIsCheckedMotorStatus] = useState()
    const [open, setOpen] = useState(false);
    const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);
    const [openDataInsightsByVillageLineid, setOpenDataInsightsByVillageLineid] = useState(false);
    const [dataInsightItem, setDataInsightItem] = useState();
    const [node_id, setNodeId] = useState()
    const [openLoad, setOpenLoad] = useState(false);
    const [mothlyWater, setMonthlyWater] = useState([]);
    const [mothlyBilling, setMonthlyBilling] = useState([])
    const [combinedData, setCombinedData] = useState([]);
    useEffect(() => {
        fetchx(API_URL + `/getVillageDetailByName?village=${village_name}`)

            .then(result => result.json())
            .then(resp => {
                console.log("resp")
                console.log(resp)
                if (resp.statusCode === 200) {
                    console.log(resp.data)
                    setMainDropDownData(resp.data)

                }
            })

        fetchx(API_URL + `/getVillageWaterReport?village=${village_name}`)

            .then(result => result.json())
            .then(resp => {
                console.log("resp")
                console.log(resp)
                if (resp.statusCode === 200) {
                    console.log(resp.data)
                    setMonthlyWater(resp.data)

                }
            })

        fetchx(API_URL + `/getBillingReportByVillage?village=${village_name}`)

            .then(result => result.json())
            .then(resp => {
                console.log("resp")
                console.log(resp)
                if (resp.statusCode === 200) {
                    console.log(resp.data)
                    setMonthlyBilling(resp.data)

                }
            })

    }, [village_name])

    useEffect(() => {
        const merged = new Map();

        mothlyWater.forEach(item => {
            const key = item.usage_month;
            merged.set(key, {
                month: key,
                total_monthly_usage: item.total_monthly_usage,
                total_monthly_kWh: null,
                days: item.days_with_data
            });
        });

        mothlyBilling.forEach(item => {
            const key = item.month_start.slice(0, 7); // "YYYY-MM"

            if (key.startsWith('2025-02')) return;
            if (merged.has(key)) {
                merged.get(key).total_monthly_kWh = item.total_monthly_kWh;
            } else {
                merged.set(key, {
                    month: key,
                    total_monthly_usage: null,
                    total_monthly_kWh: item.total_monthly_kWh
                });
            }
        });

        const sortedCombined = Array.from(merged.values()).sort((a, b) => a.month.localeCompare(b.month));
        setCombinedData(sortedCombined);
    }, [mothlyWater, mothlyBilling]);

    // console.log(combinedData[combinedData.length - 1].total_monthly_usage, "^^^^^^^")
    return (
        <div >
            <div className='me-1' style={{ display: 'flex', alignItems: 'center' }}>
                <Button className='me-1' size='sm' outline style={{ marginRight: '1rem', marginBottom: '10px' }} color='primary' onClick={() => navigate('/dashboard/Overall')}>
                    Back
                </Button>
            </div>



            <Card  >
                <CardHeader style={{ border: 'none', backgroundColor: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <div style={{ width: '850px', display: 'flex', alignItems: 'center', gap: '50px' }}>  <p style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#000000', marginTop: '5px', textTransform: 'capitalize' }}>
                            <img src={Icon} style={{ width: '40px', height: '40px', marginRight: '10px' }} alt="Icon" />
                            {village_name}
                        </p>

                            <PopulationCard population={population} />
                            <WaterSuppliedCard water={combinedData.length > 0 && combinedData[combinedData.length - 1].total_monthly_usage} population={population} days={combinedData.length > 0 && combinedData[combinedData.length - 1].days}
                            />
                        </div>

                        <div>
                            <h2 style={{ color: '#6d00fe', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}>Village Monthly Report</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Month</th>
                                        <th style={thStyle}>Water Supplied (m³)</th>
                                        <th style={thStyle}>liters/capita (l)</th>
                                        <th style={thStyle}>Cum Energy (kWh)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {combinedData.map((item, idx) => {
                                        const date = new Date(item.month + '-01');
                                        const monthLabel = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
                                        const perCapita = item.total_monthly_usage && population ? ((item.total_monthly_usage / item.days) / population).toFixed(2) : '—';

                                        return (
                                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                                <td style={tdStyle}>{monthLabel}</td>
                                                <td style={tdStyle}>{item.total_monthly_usage ? (item.total_monthly_usage / 1000).toFixed(2) : '—'}</td>
                                                <td style={tdStyle}>{item.total_monthly_usage ? perCapita : '—'}</td>
                                                <td style={tdStyle}>{item.total_monthly_kWh ? (item.total_monthly_kWh / 1000).toFixed(2).toLocaleString() : '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>





                        <p style={{ color: '#6d00fe', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}>All RR Details</p>

                    </div>



                </CardHeader>

                <CardBody style={{ marginTop: '20px' }}>
                    {mainDropDownData && mainDropDownData.length > 0 ? (
                        mainDropDownData.map((item, index) => (
                            <div>
                                <div key={index} style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px', cursor: 'pointer' }} onClick={() => toggle(index)}>
                                    <div style={{ fontSize: '16px' }} >
                                        {openModify[index] ? <ChevronDown style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} /> : <ChevronUp style={{ color: 'white', fontWeight: 'bold', backgroundColor: '#ffbe00', borderRadius: '20%', padding: '2px', marginRight: '10px' }} />}
                                        {item.rr_no}

                                    </div>

                                </div>


                                {/* {openModify[index] && ( */}
                                <Row>
                                    <Col md="10" style={{ marginTop: '20px', height: '150px' }}>
                                        < div style={{ border: '2px solid #dbdbdb', borderRadius: '8px', padding: '10px' }}>



                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', marginTop: '-24px', backgroundColor: 'white', width: '30%' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#000000', margin: 0 }}>
                                                    {item.node_id}
                                                </p>&nbsp;&nbsp;&nbsp;
                                                <p style={{ marginLeft: '12px', fontSize: '14px', color: '#706d7d', margin: 0 }}>
                                                    ({item.ipaddr})
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#a3a3a3' }}>Pump {item.pumpHB}HP</p>
                                                <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#a3a3a3', marginTop: '-8px' }}>
                                                    {item.last_communicated_time !== null ? 'Last Updated ' + item.last_communicated_time : 'No Update'}
                                                </p>
                                                <p style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-38px' }}>
                                                    <Button color={''} style={{ color: '#03a19f', marginRight: '10px', border: '1px solid #03a19f' }} outline onClick={() => { setOpenLogs(true), setNodeId(item.node_id) }}>Daily load</Button>

                                                    <Button color={''} style={{ background: '#6d00fe', color: 'white', marginRight: '10px' }} onClick={() => { setOpenLoad(true), setNodeId(item.node_id) }}>Load</Button>


                                                </p>
                                            </div>

                                        </div>
                                    </Col>

                                </Row>
                                {/* )} */}

                            </div>

                        ))
                    ) : (
                        <div style={{ fontWeight: 'bold', color: '#202020', paddingTop: '10px' }}>
                            No data available
                        </div>
                    )}

                    <div>
                        {node_id && (<Modal isOpen={openLogs}
                            toggle={() => setOpenLogs(!openLogs)} className="" style={{ maxWidth: '95%', width: '1400px' }}>
                            <ModalHeader className="modal-lg" toggle={() => setOpenLogs(!openLogs)} ></ModalHeader>
                            <ModalBody className="pb-3 px-sm-1 mx-20">
                                <div>
                                    <Logs node_id={node_id} />
                                </div>
                            </ModalBody>
                        </Modal>)}
                    </div>
                    <div>
                        {node_id && openLoad && (<Modal isOpen={openLoad}
                            toggle={() => { setOpenLoad(!openLoad), setNodeId(null) }} className="modal-xl">
                            <ModalHeader className="modal-lg" toggle={() => { setOpenLoad(!openLoad), setNodeId(null) }} ></ModalHeader>
                            <ModalBody className="pb-3 px-sm-1 mx-20">
                                <div>
                                    <Load node_id={node_id} />
                                </div>
                            </ModalBody>
                        </Modal>)}
                    </div>


                </CardBody>
            </Card>
        </div>
    );
};

const thStyle = {
    border: '1px solid #ddd',
    padding: '8px 12px',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
};

const tdStyle = {
    border: '1px solid #ddd',
    padding: '6px 12px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555'
};

export default Overview;
