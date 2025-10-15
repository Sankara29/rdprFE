// curl --location 'https://testhotel2.prysmcable.com/v25/getAllEnergyMeter'
// curl --location 'https://testhotel2.prysmcable.com/v25/getAllWaterMeter'
// curl --location 'https://testhotel2.prysmcable.com/v25/getAllNeutralMeter'
// curl --location 'https://testhotel2.prysmcable.com/v25/getAllStarterNodes'

import React, { useEffect, useRef, useState, useMemo } from "react";
import 'ag-grid-enterprise'
import { AgGridReact } from "ag-grid-react";
import { Button, Input, Label } from "reactstrap";
import moment from "moment";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Papa from "papaparse";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const InstallStatusTable = () => {
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const gridRef = useRef();

    // const fetchData = async () => {
    //     const urls = [
    //         "https://testhotel2.prysmcable.com/v25/getAllEnergyMeter",
    //         "https://testhotel2.prysmcable.com/v25/getAllWaterMeter",
    //         "https://testhotel2.prysmcable.com/v25/getAllNeutralMeter",
    //         "https://testhotel2.prysmcable.com/v25/getAllStarterNodes",
    //     ];



    //     try {
    //         const results = await Promise.all(urls.map(url => fetch(url)));
    //         const rawData = await Promise.all(results.map(res => res.json()));
    //         const data = rawData.map(d => d.data);
    //         // Normalize and combine
    //         const mergedData = data.flatMap((arr, idx) =>
    //             arr.map(item => ({
    //                 id: item.id || item._id || Math.random(),
    //                 type: ["Energy", "Water", "Neutral", "Starter"][idx],
    //                 meterno: item.meterno || item.node_id || item.meter_no || "N/A",
    //                 rr_no: item.rr_no || "N/A",
    //                 installationDate: item.created_at || null,
    //                 taluk: item.taluk || "N/A",
    //                 village: item.village || "N/A",
    //             }))
    //         );

    //         setRowData(mergedData);
    //         setFilteredData(mergedData);
    //     } catch (err) {
    //         console.error("Data fetch failed:", err);
    //     }
    // };

    const fetchData = async () => {
        const queryApi = "https://testhotel2.prysmcable.com/v24/query-checker";

        const node = `SELECT w.id, w.node_id, r.remark, w.status, w.created_at, w.updated_at, u.first_name as created_by, d.TalukName as taluk, d.district, d.VillageName as village, d.GPName, d.Entered_RRNO as rr_no, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.latitude')) AS latitude, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.longitude')) AS longitude FROM starterNode w LEFT JOIN remark r ON w.remark_id = r.id LEFT JOIN location l ON w.location_id = l.id LEFT JOIN rrno_data d on w.rr_no_id = d.id LEFT JOIN User u on w.created_by = u.id;`

        const Neutral = `SELECT n.id, CASE WHEN n.neutral_installed = 1 THEN 'Yes' ELSE 'No' END AS neutral_installed, n.cable_used_meter_neutral, n.status, u.first_name as created_by, n.created_at, n.updated_at, r.remark, d.TalukName as taluk, d.district, d.VillageName as village, d.GPName, d.Entered_RRNO as rr_no, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.latitude')) AS latitude, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.longitude')) AS longitude FROM neutralMeter n LEFT JOIN remark r ON n.remark_id = r.id LEFT JOIN location l ON n.location_id = l.id LEFT JOIN rrno_data d on n.rr_no_id = d.id LEFT JOIN User u on n.created_by = u.id;`

        const water = `SELECT w.id, m.meter_no, CASE WHEN m.new_meter = 1 THEN 'Yes' ELSE 'No' END AS new_meter, r.remark, w.status, w.created_at, w.updated_at, u.first_name as created_by, d.TalukName as taluk, d.district, d.VillageName as village, d.GPName, d.Entered_RRNO as rr_no, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.latitude')) AS latitude, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.longitude')) AS longitude FROM waterMeter w LEFT JOIN remark r ON w.remark_id = r.id LEFT JOIN location l ON w.location_id = l.id LEFT JOIN rrno_data d on w.rr_no_id = d.id LEFT JOIN meter m on w.meter_id = m.id LEFT JOIN User u on w.created_by = u.id;`

        const energy = `SELECT e.id, CASE WHEN e.fuse_cut_out = 1 THEN 'Yes' ELSE 'No' END AS fuse_cut_out, CASE WHEN e.starter_node = 1 THEN 'Yes' ELSE 'No' END AS starter_node, CASE WHEN e.neutral = 1 THEN 'Yes' ELSE 'No' END AS neutral, m.meter_no, CASE WHEN m.new_meter = 1 THEN 'Yes' ELSE 'No' END AS new_meter, e.cable_used, e.cable_used_meter_neutral, e.status, e.created_at, e.updated_at, u.first_name as created_by, r.remark, d.TalukName as taluk, d.district, d.VillageName as village, d.GPName, d.Entered_RRNO as rr_no, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.latitude')) AS latitude, JSON_UNQUOTE(JSON_EXTRACT(l.location, '$.longitude')) AS longitude FROM energyMeter e LEFT JOIN remark r ON e.remark_id = r.id LEFT JOIN location l ON e.location_id = l.id LEFT JOIN rrno_data d on e.rr_no_id = d.id LEFT JOIN meter m on e.meter_id = m.id LEFT JOIN User u on e.created_by = u.id;`

        const queries = [
            { type: "Energy", sql: energy },
            { type: "Water", sql: water },
            { type: "Neutral", sql: Neutral },
            { type: "Starter", sql: node }
        ];

        try {
            const fetchQuery = async ({ type, sql }) => {
                const response = await fetch(queryApi, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sql: sql })  // NOTE: send one query at a time
                });

                if (!response.ok) throw new Error(`Failed to fetch ${type}`);

                const csvText = await response.text(); // get CSV text
                const parsed = Papa.parse(csvText, { header: true });

                if (parsed.errors.length > 0) {
                    console.warn(`${type} CSV parse errors:`, parsed.errors);
                }


                return parsed.data.map(item => ({
                    id: item.id || Math.random(),
                    type,
                    meterno: item.meter_no || item.node_id || item.cable_used_meter_neutral || "N/A",
                    rr_no: item.rr_no || "N/A",
                    installationDate: item.updated_at || null,
                    taluk: item.taluk || "N/A",
                    village: item.village || "N/A",
                }));
            };

            // Fetch all queries in parallel
            const results = await Promise.all(queries.map(fetchQuery));

            const mergedData = results.flat();

            setRowData(mergedData);
            setFilteredData(mergedData);
        } catch (err) {
            console.error("Data fetch failed:", err);
        }
    };


    // const handleFilter = () => {
    //     if (!startDate || !endDate) return;

    //     const start = moment(startDate);
    //     const end = moment(endDate).endOf("day");

    //     const filtered = rowData.filter(item => {
    //         const date = moment(item.installationDate);
    //         return date.isValid() && date.isBetween(start, end, null, "[]");
    //     });

    //     setFilteredData(filtered);
    // };
    const handleFilter = () => {
        if (!startDate && !endDate) {
            setFilteredData(rowData);
            return;
        }

        const start = startDate ? dayjs(startDate) : null;
        const end = endDate ? dayjs(endDate).endOf('day') : null;

        const filtered = rowData.filter(item => {
            const date = dayjs(item.installationDate);
            if (!date.isValid()) return false;

            if (start && end) {
                return date.isBetween(start, end, null, '[]');
            } else if (start) {
                return date.isSameOrAfter(start);
            } else if (end) {
                return date.isSameOrBefore(end);
            }
            return true;
        });

        setFilteredData(filtered);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const columnDefs = [
        { headerName: "Type", field: "type", filter: true },
        { headerName: "Meter No", field: "meterno", filter: true },
        { headerName: "Installation Date", field: "installationDate", filter: true },
        { headerName: "rr_no", field: "rr_no", filter: true },
        { headerName: "taluk", field: "taluk", filter: true },
        { headerName: "village", field: "village", filter: true },
    ];
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: { buttons: ["apply", "reset"] },
    }), []);

    const onGridReady = (params) => {
        gridRef.current = params.api;
    };
    const handleCellRightClick = () => {

    };

    return (
        <div className="container mt-4">
            <h4>📅 Installation Status Filter</h4>

            <div className="d-flex gap-3 align-items-end mb-3">
                <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                    <Label>End Date</Label>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div>
                    <Button color="primary" onClick={handleFilter}>Apply Filter</Button>
                </div>
            </div>

            <div className="ag-theme-alpine" style={{ height: 500 }}>
                <AgGridReact rowData={filteredData} columnDefs={columnDefs} animateRows
                    rowSelection="multiple"
                    pagination
                    paginationPageSize={12}
                    paginationAutoPageSize={false}

                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}

                    onCellContextMenu={handleCellRightClick} />
            </div>
        </div>
    );
};

export default InstallStatusTable;
