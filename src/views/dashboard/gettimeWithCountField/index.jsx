// GwidTimeGrid.js
import React, { useEffect, useState } from "react";
import 'ag-grid-enterprise'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Table,
} from "reactstrap";
import toast from 'react-hot-toast';

const GwidTimeGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [selectedNode, setSelectedNode] = useState("");
    const [commandModalOpen, setCommandModalOpen] = useState(false);
    const [commandModalData, setCommandModalData] = useState([]);
    const [commandSelectedNode, setCommandSelectedNode] = useState(null);



    const columnDefs = [
        {
            headerName: "Location",
            field: "location",
            cellStyle: (params) => {
                const val = params.value;
                if (val === "Nsoft3rdfloor") {
                    return {
                        backgroundColor: "#d0f0fd", // light blue
                        color: "#000",
                        fontWeight: "bold"
                    };
                } else if (val === "NsoftBasement") {
                    return {
                        backgroundColor: "#d4fdd0", // light green
                        color: "#000",
                        fontWeight: "bold"
                    };
                }
                else if (val === "SimCom_MST") {
                    return {
                        backgroundColor: "#ffffe0", // light green
                        color: "#000",
                        fontWeight: "bold"
                    };
                }
                return {};
            }
        },
        {
            headerName: "Node ID",
            field: "node_id",
            maxWidth: 175,
            cellRendererFramework: (params) => {
                const handleClick = async () => {
                    try {
                        const res = await fetch(`https://testpms.ms-tech.in/v15/gwid-time/${params.value}`);
                        const data = await res.json();
                        setModalData(data); // API returns an array
                        setModalOpen(true);
                        setSelectedNode(params.value);
                    } catch (err) {
                        console.error("Error fetching node details:", err);
                    }
                };

                return (
                    <span
                        onClick={handleClick}
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                        title="Click for more info"
                    >
                        {params.value}
                    </span>
                );
            }
        },

        { headerName: "CSQ", field: "csq", maxWidth: 115 },
        { headerName: "Time", field: "tm" },
        { headerName: "CV", field: "cv", maxWidth: 115 },
        // { headerName: "CID", field: "cid" },
        { headerName: "GetTime Count", field: "gettime_count", maxWidth: 175 },
        {
            headerName: "GetCommand Count",
            field: "getcommand_count",
            maxWidth: 185,
            cellRendererFramework: (params) => {
                const handleClick = async () => {
                    if (params.data.cv === "7.40") {
                        toast.error(`7.40 version detected for node: ${params.data.node_id}`, {
                            duration: 4000,
                            position: 'top-right',
                        });
                        return; // Stop further action
                    }
                    try {
                        const res = await fetch(`https://testpms.ms-tech.in/v15/getGetCommandPerNode?node_id=${params.data.node_id}`);
                        const result = await res.json();
                        setCommandModalData(result.data || []);
                        setCommandModalOpen(true);
                        setCommandSelectedNode(params.data.node_id);
                    } catch (err) {
                        console.error("Error fetching command data:", err);
                    }
                };

                return (
                    <span
                        onClick={handleClick}
                        style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'darkblue',
                            textDecoration: 'underline',
                        }}
                        title="Click to see GetCommand detail"
                    >
                        {params.value}
                    </span>
                );
            }
        }
        ,
        { headerName: "senddata_time", field: "senddata_time", maxWidth: 185 },

        // { headerName: "Created At", field: "created_at" },

        // ✅ Add this: Location column with color

    ];
    const getRowStyle = (params) => {
        const loc = params.data?.location;
        if (loc === "Nsoft3rdfloor") {
            return { backgroundColor: "#f0faff" }; // light blue
        } else if (loc === "NsoftBasement") {
            return { backgroundColor: "#f2fff0" }; // light green
        } else if (loc === "SimCom_MST") {
            return { backgroundColor: "#ffffe0" }; // light green
        }
        return null;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://testpms.ms-tech.in/v15/gwid-time-field");
                const data = await res.json();
                const excludedNodes = ["NSRT000010", "NSRT000538"];

                const thirdFloorNodes = [
                ];

                const groundFloorNodes = [
                    "NSRT000629", "NSRT000630", "NSRT000631", "NSRT000632", "NSRT000633"
                ];
                const simcomNodes = [
                    "NSRT000262", "NSRT000021", "NSRT000250", "NSRT000212", "NSRT000227"
                ]

                // Step 1: Filter out excluded nodes
                const filteredData = data?.data.filter(item => !excludedNodes.includes(item.node_id));

                // Step 2: Add location info conditionally
                const enrichedData = filteredData?.reverse()?.map(item => {
                    if (thirdFloorNodes.includes(item.node_id)) {
                        return { ...item, location: "Nsoft3rdfloor" };
                    } else if (groundFloorNodes.includes(item.node_id)) {
                        return { ...item, location: "NsoftBasement" };
                    } else if (simcomNodes.includes(item.node_id)) {
                        return { ...item, location: "SimCom_MST" }
                    } else {
                        return { ...item, location: 'field' }; // unchanged
                    }
                });

                setRowData(enrichedData);
            } catch (error) {
                console.error("Error fetching GWID data:", error);
            }
        };

        fetchData();
    }, []);
    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <h3>Field Nodes </h3>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                }}
                pagination={true}
                paginationPageSize={10}
                getRowStyle={getRowStyle}
            />

            {/* Modal */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} style={{
                maxWidth: '95%',
                width: '95%',
                maxHeight: '90vh',
            }}>






                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                    Detailed Data for Node ID: {selectedNode}
                </ModalHeader>
                <ModalBody>
                    <Table bordered responsive size="sm">
                        <thead>
                            <tr>
                                {/* <th>IMEI</th> */}
                                {/* <th>MEM</th> */}
                                <th>CSQ</th>
                                <th>CPSI</th>
                                <th>Time</th>
                                <th>CV</th>
                                {/* <th>CID</th> */}
                                <th>Send Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalData.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.imei}</td> */}
                                    {/* <td>{item.mem}</td> */}
                                    <td>{item.csq}</td>
                                    <td>
                                        {item.cpsi?.startsWith("LTE")
                                            ? (() => {
                                                const parts = item.cpsi.split(',');
                                                const eutran = parts[6];
                                                const lastFour = parts.slice(-4);
                                                return `${eutran || ""}, ${lastFour.join(',')}`;
                                            })()
                                            : item.cpsi}</td>
                                    <td>{item.tm}</td>
                                    <td>{item.cv}</td>
                                    {/* <td>{item.cid}</td> */}
                                    <td>{item.senddata_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
            <Modal isOpen={commandModalOpen} toggle={() => setCommandModalOpen(!commandModalOpen)} style={{
                maxWidth: '95%',
                width: '95%',
                maxHeight: '90vh',
            }}>
                <ModalHeader toggle={() => setCommandModalOpen(!commandModalOpen)}>
                    Detailed Data for Node ID: {commandSelectedNode}
                </ModalHeader>
                <ModalBody>
                    <Table bordered responsive size="sm">
                        <thead>
                            <tr>
                                {/* <th>IMEI</th> */}
                                {/* <th>MEM</th> */}
                                <th>CSQ</th>
                                <th>CPSI</th>
                                <th>Time</th>
                                <th>CV</th>
                                {/* <th>CID</th> */}
                                <th>posttime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandModalData.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.imei}</td> */}
                                    {/* <td>{item.mem}</td> */}
                                    <td>{item.csq}</td>
                                    <td>
                                        {item.cpsi?.startsWith("LTE")
                                            ? (() => {
                                                const parts = item.cpsi.split(',');
                                                const eutran = parts[6];
                                                const lastFour = parts.slice(-4);
                                                return `${eutran || ""}, ${lastFour.join(',')}`;
                                            })()
                                            : item.cpsi}</td>
                                    <td>{item.tm}</td>
                                    <td>{item.cv}</td>
                                    {/* <td>{item.cid}</td> */}
                                    <td>{item?.posttime ?? "NA"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000
    },
    modal: {
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "400px",
        boxShadow: "0 0 10px rgba(0,0,0,0.25)"
    },
    closeBtn: {
        marginTop: 15,
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: 5,
        cursor: "pointer"
    }
};

export default GwidTimeGrid;
