// import React from 'react';
// import { Modal, ModalHeader } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ModelData = ({ isOpen, toggle, date, data, node_id }) => {

//     return (
//         <Modal isOpen={isOpen} toggle={toggle} style={{ maxWidth: '85%', height: '100%' }}>
//             <ModalHeader toggle={toggle}>
//                 NodeId - {node_id} |  Session Data of Date - {date ? new Date(date).toLocaleDateString() : 'N/A'}
//             </ModalHeader>

//             <div style={{
//                 margin: '20px',
//                 padding: '20px',
//                 backgroundColor: '#f9f9f9',
//                 border: '1px solid #ddd',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//                 fontFamily: 'Segoe UI, sans-serif'
//             }}>
//                 <h5 style={{
//                     fontSize: '20px',
//                     fontWeight: '600',
//                     color: '#2c3e50',
//                     marginBottom: '15px',
//                     borderBottom: '2px solid #3498db',
//                     paddingBottom: '6px'
//                 }}>
//                     📅 <strong>Date:</strong> {date ? new Date(date).toLocaleDateString() : 'N/A'} &nbsp;&nbsp;
//                     ⚡ No Of Sessions: <span style={{ color: '#3498db' }}>{data.length}</span>
//                 </h5>

//                 <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
//                     {data.map((session, i) => {
//                         // Parse numeric fields
//                         const energyWh = parseFloat(session.energy_consumed_wh || 0);
//                         const waterSupplied = parseFloat(session.water_supplied || 0);
//                         const avgFlowRate = parseFloat(session.avg_flow_rate || 0);
//                         const kwh = energyWh / 1000;
//                         const litersPerKwh = kwh > 0 ? (waterSupplied / kwh).toFixed(2) : 'N/A';

//                         // Calculate duration in minutes
//                         const start = new Date(session.start_time);
//                         const end = new Date(session.end_time);
//                         const durationInMinutes = Math.round((end - start) / 60000);

//                         return (
//                             <li key={i} style={{
//                                 marginBottom: '12px',
//                                 padding: '12px 16px',
//                                 backgroundColor: '#ffffff',
//                                 border: '1px solid #eee',
//                                 borderRadius: '8px',
//                                 boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//                                 fontSize: '16px'
//                             }}>
//                                 <div style={{ marginBottom: '6px', fontWeight: '500', color: '#34495e' }}>
//                                     Session {i + 1}:
//                                 </div>
//                                 <div>
//                                     ⏰ From <strong>{start.toLocaleString()}</strong> to <strong>{end.toLocaleString()}</strong>
//                                 </div>
//                                 <div>
//                                     🕒 Duration: <span style={{ color: '#27ae60', fontWeight: '500' }}>{durationInMinutes} min</span>
//                                 </div>
//                                 <div>
//                                     💧 Water Supplied: <span style={{ color: '#2980b9' }}>{waterSupplied.toFixed(2)} liters</span> &nbsp; | &nbsp;
//                                     ⚡ Energy: <span style={{ color: '#2980b9' }}>{kwh.toFixed(2)} kWh</span> &nbsp; | &nbsp;
//                                     💧/⚡: <span style={{ color: '#2980b9' }}>{litersPerKwh}</span> liters/kWh &nbsp; | &nbsp;
//                                     🌊 Avg Flow Rate: <span style={{ color: '#2980b9' }}>{avgFlowRate.toFixed(2)}</span>
//                                 </div>
//                             </li>
//                         )
//                     })}
//                 </ul>
//             </div>
//         </Modal>
//     );
// };

// export default ModelData;




import React, { useState, useMemo, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import classnames from 'classnames';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import API_URL from '../../../config';

const ModelData = ({ isOpen, toggle, date, data, node_id }) => {
    const [open, setOpen] = useState('');
    const [activeTab, setActiveTab] = useState('1');

    const toggleAccordion = (id) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };


    // ---- Column Definitions per Tab ----
    const instColumns = useMemo(() => [
        { headerName: 'Date/Time', field: 'date_text', flex: 1 },
        { headerName: 'Meter No', field: 'meter_no', flex: 1 },
        { headerName: 'Cumulative Wh Imp', field: 'cumwhimp', flex: 1 },
        { headerName: 'Active PF', field: 'activepowerfactor', flex: 1 }
    ], []);

    const loadColumns = useMemo(() => [
        { headerName: 'Date/Time', field: 'date_text', flex: 1 },
        { headerName: 'Meter No', field: 'meter_no', flex: 1 },
        { headerName: 'Block Wh Imp', field: 'blockwhimp', flex: 1 },
        { headerName: 'Avg PF', field: 'averagepowerfactor', flex: 1 }
    ], []);


    const dailyLoadColumns = useMemo(() => [
        { headerName: 'Date', field: 'date_text', flex: 1 },
        { headerName: 'Meter No', field: 'meter_no', flex: 1 },
        { headerName: 'Cumulative Wh Imp', field: 'cumwhimp', flex: 1 }
    ], []);


    const billingColumns = useMemo(() => [
        { headerName: 'Bill Date', field: 'date_text', flex: 1 },
        { headerName: 'Meter No', field: 'meter_no', flex: 1 },
        { headerName: 'Cumulative Wh Imp', field: 'cumwhimp', flex: 1 },
        { headerName: 'Active PF', field: 'activepowerfactor', flex: 1 }
    ], []);



    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState(instColumns);
    const getEnergyData = async (node_id, date, table) => {
        try {
            const res = await fetch(`${API_URL}/getNodeDetails_nodeid_date?node_id=${node_id}&date=${date}&table=${table}`);
            const rows = await res.json();



            setRowData(rows.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (node_id) {
            const tables = {
                1: "instantaneousdata",
                2: "loaddata",
                3: "dailyloaddata",
                4: "billingdata"
            };

            getEnergyData(node_id, date, tables[activeTab]);

            // update columns when tab changes
            switch (activeTab) {
                case 1:
                    setColumnDefs(instColumns);
                    break;
                case 2:
                    setColumnDefs(loadColumns);
                    break;
                case 3:
                    setColumnDefs(dailyLoadColumns);
                    break;
                case 4:
                    setColumnDefs(billingColumns);
                    break;
                default:
                    setColumnDefs([]);
            }
        }
    }, [node_id, activeTab, date]);


    return (
        <Modal isOpen={isOpen} toggle={toggle} style={{ maxWidth: '85%', height: '100%' }}>
            <ModalHeader toggle={toggle}>
                NodeId - {node_id} | Session Data of Date - {date ? new Date(date).toLocaleDateString() : 'N/A'}
            </ModalHeader>

            {/* --- Existing Session Data Block --- */}
            <div style={{
                margin: '20px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                fontFamily: 'Segoe UI, sans-serif'
            }}>
                <h5 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '15px',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '6px'
                }}>
                    📅 <strong>Date:</strong> {date ? new Date(date).toLocaleDateString() : 'N/A'} &nbsp;&nbsp;
                    ⚡ No Of Sessions: <span style={{ color: '#3498db' }}>{data.length}</span>
                </h5>

                <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                    {data.map((session, i) => {
                        const energyWh = parseFloat(session.energy_consumed_wh || 0);
                        const waterSupplied = parseFloat(session.water_supplied || 0);
                        const avgFlowRate = parseFloat(session.avg_flow_rate || 0);
                        const kwh = energyWh / 1000;
                        const litersPerKwh = kwh > 0 ? (waterSupplied / kwh).toFixed(2) : 'N/A';

                        const start = new Date(session.start_time);
                        const end = new Date(session.end_time);
                        const durationInMinutes = Math.round((end - start) / 60000);

                        return (
                            <li key={i} style={{
                                marginBottom: '12px',
                                padding: '12px 16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                fontSize: '16px'
                            }}>
                                <div style={{ marginBottom: '6px', fontWeight: '500', color: '#34495e' }}>
                                    Session {i + 1}:
                                </div>
                                <div>
                                    ⏰ From <strong>{start.toLocaleString()}</strong> to <strong>{end.toLocaleString()}</strong>
                                </div>
                                <div>
                                    🕒 Duration: <span style={{ color: '#27ae60', fontWeight: '500' }}>{durationInMinutes} min</span>
                                </div>
                                <div>
                                    💧 Water Supplied: <span style={{ color: '#2980b9' }}>{waterSupplied.toFixed(2)} liters</span> &nbsp; | &nbsp;
                                    ⚡ Energy: <span style={{ color: '#2980b9' }}>{kwh.toFixed(2)} kWh</span> &nbsp; | &nbsp;
                                    💧/⚡: <span style={{ color: '#2980b9' }}>{litersPerKwh}</span> liters/kWh &nbsp; | &nbsp;
                                    🌊 Avg Flow Rate: <span style={{ color: '#2980b9' }}>{avgFlowRate.toFixed(2)}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* --- New Accordion with Ag-Grid --- */}
            <div style={{ margin: '20px' }}>
                <Accordion open={open} toggle={toggleAccordion}>
                    <AccordionItem>
                        <AccordionHeader targetId="1">Energy Consumption Details On - {date ? new Date(date).toLocaleDateString() : 'N/A'}</AccordionHeader>
                        <AccordionBody accordionId="1">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggleTab('1')}>Inst</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggleTab('2')}>Load</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggleTab('3')}>Daily Load</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => toggleTab('4')}>Billing</NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={activeTab} style={{ marginTop: '15px' }}>
                                <TabPane tabId="1">
                                    <div className="ag-theme-alpine" style={{ height: 250, width: '100%' }}>
                                        <AgGridReact columnDefs={instColumns} rowData={rowData} pagination={true} />
                                    </div>
                                </TabPane>

                                <TabPane tabId="2">
                                    <div className="ag-theme-alpine" style={{ height: 250, width: '100%' }}>
                                        <AgGridReact columnDefs={loadColumns} rowData={rowData} pagination={true} />
                                    </div>
                                </TabPane>

                                <TabPane tabId="3">
                                    <div className="ag-theme-alpine" style={{ height: 250, width: '100%' }}>
                                        <AgGridReact columnDefs={dailyLoadColumns} rowData={rowData} pagination={true} />
                                    </div>
                                </TabPane>

                                <TabPane tabId="4">
                                    <div className="ag-theme-alpine" style={{ height: 250, width: '100%' }}>
                                        <AgGridReact columnDefs={billingColumns} rowData={rowData} pagination={true} />
                                    </div>
                                </TabPane>
                            </TabContent>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>
        </Modal>
    );
};

export default ModelData;
