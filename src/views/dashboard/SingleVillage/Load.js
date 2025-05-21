import { useEffect, useState, useMemo, useRef } from "react";
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import moment from "moment";
import { Card, CardHeader } from "reactstrap";


const Load = ({ node_id }) => {
    const [load, setLoad] = useState([]);


    useEffect(() => {
        if (node_id) {
            console.log(node_id, '%%%%%%%%%%%%%%%%%%')
            const fetchData = async (node_id) => {
                try {
                    const load = await fetch(`https://testpms.ms-tech.in/v15/getLoad?node_id=${node_id}`)
                        ;
                    const res = await load.json();

                    console.log(res)
                    if (Array.isArray(res.data)) {
                        setLoad(res.data);
                    }

                } catch (err) {
                    console.error('Data fetch error:', err);
                }
            };
            fetchData(node_id);
        }
    }, [node_id])
    const CustomHeader = (props) => {
        return (
            <span dangerouslySetInnerHTML={{ __html: props.displayName }} />
        );
    };
    const columnDefsLoad = useMemo(() => [
        {
            headerName: 'Capture Date',
            field: 'captureddatetime',
            maxWidth: 150
            , valueFormatter: (params) => {
                return params.value ? moment(params.value).format('MMM-DD-YYYY HH:mm') : '';
            }
        },
        {
            headerName: 'Block Date',
            field: 'blockdatetime',
            maxWidth: 150,
            valueFormatter: (params) =>
                params.data.blockdatetime
                    ? moment(params.data.blockdatetime).format('MMM-DD-YYYY HH:mm')  // Format date and time
                    : 'N/A'  // Fallback in case of missing value
        },
        {
            headerName: 'Kwh', field: 'blockwhimp', maxWidth: 85, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },
        {
            headerName: 'Vavgᵣ', // proper Unicode subscript r
            field: 'Ravgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Vavgᵧ', // closest to subscript y (actually subscript gamma)
            field: 'Yavgvoltage',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Vavg<sub>B</sub>', // closest to subscript b (actually subscript beta)
            field: 'Bavgvoltage',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavgᵣ',
            field: 'Ravgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavgᵧ',
            field: 'Yavgcurrent',
            maxWidth: 95,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        },
        {
            headerName: 'Iavg<sub>B</sub>',
            field: 'Bavgcurrent',
            maxWidth: 95,
            headerComponentFramework: CustomHeader,
            valueFormatter: (params) => Number(params.value)?.toFixed(2) || ''
        }
        ,


        {
            headerName: 'vah', field: 'blockvahimp', maxWidth: 155, valueFormatter: (params) => {
                return params.value ? new Intl.NumberFormat('en-US').format((Number(params.value) / 1000)?.toFixed(2)) : '';
            }
        },

    ], []);
    const loadRef = useRef();
    const onGridReadyLoad = (params) => {
        loadRef.current = params.api;
    };
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }), []);
    return (
        <>
            <Card style={{ width: '100%', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '10px', fontFamily: 'monospace' }}>
                <CardHeader style={{ fontWeight: 'bold', fontSize: '20px', borderBottom: '1px solid #333' }}>
                    Load
                </CardHeader>
                {load.length > 0 ? (

                    <div className="ag-theme-alpine" style={{ height: '550px', width: '100%' }}>
                        <AgGridReact
                            ref={loadRef}
                            rowData={load}
                            columnDefs={columnDefsLoad}
                            animateRows={true}
                            rowSelection="multiple"
                            pagination={true}
                            paginationPageSize={50}
                            paginationAutoPageSize={false}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReadyLoad}
                        />
                    </div>
                ) : (<div className="ag-theme-alpine" style={{ height: '14px', width: '70%' }}>
                    <p>No Data Found</p>
                </div>)}
            </Card>
        </>
    )

}
export default Load;