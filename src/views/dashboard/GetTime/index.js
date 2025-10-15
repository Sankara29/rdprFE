
import { useEffect, useState, useMemo, useRef } from "react"
import {
    Row, Col, Input, Label, Badge, Spinner
} from "reactstrap"
import Select from "react-select"
import 'ag-grid-enterprise'
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import API_URL from '../../../config'
import moment from "moment"
import Loader from "../rdprDashboard/Loader"
import dayjs from "dayjs"

const OverView = () => {
    const [energyMeter, setEnergyMeter] = useState([])
    const [commStatusList, setCommStatusList] = useState([])
    const [loading, setLoading] = useState(true)
    const [gridFilteredCount, setGridFilteredCount] = useState(0)


    const [selectedGp, setSelectedGp] = useState(null)
    const [selectedVillage, setSelectedVillage] = useState(null)
    const [searchNodeId, setSearchNodeId] = useState("")
    const [showOldCommOnly, setShowOldCommOnly] = useState(false)

    const gridRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/getInstalledNode`)
                const data = await res.json()
                if (data.statusCode === 200) {
                    const processed = data.data.map(item => ({
                        ...item,
                        captureddatetime: item.captureddatetime?.split(' ')[0]
                    }))
                        .sort((a, b) => new Date(b.captureddatetime) - new Date(a.captureddatetime))
                    setEnergyMeter(processed)
                }
            } catch (err) {
                console.error("Failed to fetch installed nodes:", err)
            }
        }

        fetchData()
        const intervalId = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const fetchCommStatus = async () => {
            if (!energyMeter.length) return
            setLoading(true)

            const statusList = await Promise.all(
                energyMeter.map(async ({ node_id, village, GPName }) => {
                    const gwid = node_id?.trim()
                    console.log(gwid, "IIIIIIIIIII")
                    if (!gwid) return null
                    try {
                        const res = await fetch(`https://testpms.ms-tech.in/v15/gwid-status/${gwid}`)
                        const text = await res.json()
                        return {
                            gwid,
                            village: village?.trim(),
                            gpname: GPName?.trim(),
                            lastComm: extractValue(text, "timestamp_str"),
                            currentVersion: extractValue(text, "cv"),
                            csq: extractValue(text, "csq")
                        }
                    } catch {
                        return { gwid, village, gpname: GPName, error: "Error fetching data" }
                    }
                })
            )

            setCommStatusList(statusList.filter(Boolean))
            setLoading(false)
        }

        fetchCommStatus()
    }, [energyMeter])

    const extractValue = (text, label) => {
        const match = text?.[label]
        return match ? match.trim() : 'N/A'
    }

    const csqColor = csq => {
        const val = parseInt(csq)
        if (isNaN(val)) return "text-secondary"
        if (val < 15) return "text-danger"
        if (val < 25) return "text-warning"
        return "text-success"
    }

    const versionMismatch = (current, required = "9.10") => current && current !== required
    const isOlderThan24Hours = dateStr => {
        const date = new Date(dateStr)
        return !isNaN(date) && (new Date() - date > 86400000)
    }

    const gpOptions = useMemo(() => (
        [...new Set(commStatusList.map(n => n.gpname))].filter(Boolean).map(gp => ({ label: gp, value: gp }))
    ), [commStatusList])

    const villageOptions = useMemo(() => (
        [...new Set(commStatusList
            .filter(n => !selectedGp || n.gpname === selectedGp.value)
            .map(n => n.village))].filter(Boolean).map(v => ({ label: v, value: v }))
    ), [commStatusList, selectedGp])

    const filteredList = useMemo(() => (
        commStatusList.filter(n =>
            (!selectedGp || n.gpname === selectedGp.value) &&
            (!selectedVillage || n.village === selectedVillage.value) &&
            (!showOldCommOnly || isOlderThan24Hours(n.lastComm)) &&
            (!searchNodeId || n.gwid.toLowerCase().includes(searchNodeId.toLowerCase()))
        )
    ), [commStatusList, selectedGp, selectedVillage, showOldCommOnly, searchNodeId])


    const columnDefs = useMemo(() => [
        { headerName: "Node ID", field: "gwid", sortable: true },
        { headerName: "GP", field: "gpname", sortable: true },
        { headerName: "Village", field: "village", sortable: true },

        {
            headerName: "Last Communication",
            field: "lastComm",
            sortable: true,
            cellStyle: params => isOlderThan24Hours(params.value) ? { color: "red" } : {},
            valueFormatter: params => {
                return params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm') : '';
            },
            filter: 'agDateColumnFilter',
            filterParams: {
                suppressAndOrCondition: true,
                browserDatePicker: true,
                comparator: (filterLocalDateAtMidnight, cellValue) => {
                    if (!cellValue) return -1;

                    const cellDate = dayjs(cellValue).startOf('day');
                    const filterDate = dayjs(filterLocalDateAtMidnight).startOf('day');

                    if (!cellDate.isValid() || !filterDate.isValid()) return -1;
                    if (cellDate.isBefore(filterDate)) return -1;
                    if (cellDate.isAfter(filterDate)) return 1;
                    return 0;
                }
            }
        }
        ,

        {
            headerName: "Version",
            field: "currentVersion",
            cellRenderer: ({ value }) => {
                const color = versionMismatch(value) ? "orange" : "green"
                return <span style={{ color }}>{value}</span>
            }
        },
        {
            headerName: "CSQ",
            field: "csq",
            cellRenderer: ({ value }) => {
                const color = csqColor(value)
                return <span className={color}>{value}</span>
            }
        },
        {
            headerName: "Error",
            field: "error",
            hide: true
        }
    ], [])
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        filterParams: { buttons: ['apply', 'reset'] }
    }), [])
    const onGridReady = (params) => {
        gridRef.current = params.api,
            setGridFilteredCount(params.api.getDisplayedRowCount())
    }
    const last48HourCount = useMemo(() => {
        const now = new Date()
        return commStatusList.filter(n => {
            const commDate = new Date(n.lastComm)
            return !isNaN(commDate) && (now - commDate <= 48 * 60 * 60 * 1000)
        }).length
    }, [commStatusList])

    return (
        <div className="p-4">
            <h3 className="mb-3">Node Communication Overview</h3>

            <Row className="align-items-center mb-4 g-3">
                <Col md="3">
                    <Label>Filter by GP</Label>
                    <Select
                        options={gpOptions}
                        value={selectedGp}
                        onChange={val => {
                            setSelectedGp(val)
                            setSelectedVillage(null)
                        }}
                        isClearable
                        placeholder="Select GP..."
                    />
                </Col>

                <Col md="3">
                    <Label>Filter by Village</Label>
                    <Select
                        options={villageOptions}
                        value={selectedVillage}
                        onChange={setSelectedVillage}
                        isClearable
                        placeholder="Select Village..."
                    />
                </Col>

                <Col md="3">
                    <Label>Search Node ID</Label>
                    <Input
                        value={searchNodeId}
                        onChange={e => setSearchNodeId(e.target.value)}
                        placeholder="Enter Node ID..."
                    />
                </Col>

                <Col md="3">

                    <Badge color="info" pill className="fs-5 mt-2">Total: {gridFilteredCount}</Badge>
                    <Badge color="success" pill className="fs-5" style={{ marginLeft: '20px' }}>
                        Last 48h Com: {last48HourCount}
                    </Badge>
                </Col>
            </Row>

            {loading ? (
                <div className="ag-theme-alpine" style={{ height: '14px', width: '100%' }}>
                    <Loader />
                </div>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={filteredList}
                        columnDefs={columnDefs}
                        domLayout="autoHeight"
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        animateRows
                        rowSelection="multiple"
                        pagination
                        paginationPageSize={12}
                        onFilterChanged={() => {
                            if (gridRef.current) {
                                setGridFilteredCount(gridRef.current.getDisplayedRowCount())
                            }
                        }}
                        onSortChanged={() => {
                            if (gridRef.current) {
                                setGridFilteredCount(gridRef.current.getDisplayedRowCount())
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default OverView
