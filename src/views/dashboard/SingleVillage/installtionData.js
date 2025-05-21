// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col, Input } from 'reactstrap';
import { useState, useEffect, useRef, useMemo } from 'react';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config';
import { format } from 'date-fns';

const Overview = ({ village_id, line_id }) => {
    const gridRef = useRef();
    let [rowData, setRowData] = useState();



    useEffect(() => {
        fetchx(API_URL + "/getVillageInstallation?village_id=" + village_id + '&line_id=' + line_id)
        // fetchx("http://172.104.244.42:14012/v9/getVillageInstallation?village_id=" + village_id + '&line_id=' + line_id)
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
        
            });
    }, []);




    // const [columnDefs, setColumnDefs] = useState([
        const columnDefs = useMemo(() => [


            { headerName: 'Asset ID', field: 'node_id', maxWidth: 140 },
            { headerName: 'Asset Type', field: 'asset_type', maxWidth: 122 },

        {
            headerName: 'Installed Date', field: 'installation_datetime', maxWidth: 260,
            cellRenderer: params => {
                const formattedDate = format(new Date(params.value), "MMM d, yyyy HH:mm:ss");
                return formattedDate;
            }
        },
        // { headerName: 'Capacity', field: 'capacity', maxWidth: 108 },
        { headerName: 'Installed By', field: 'added_by', maxWidth: 130 },
     


    ]);


    // CSS for vertical centering
    const customStyles = `
  .vertical-center {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  `;


    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = customStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);




    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        autoHeight: true,
        wrapText: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));







    return (
        <div className="p-0">


            <Card style={{ width: '820px',marginLeft:'-20px',marginTop:'-30px' }}>
                <CardBody>
                    <CardTitle style={{ color: '#ff0000', fontSize: '14px',marginBottom:'5px' }}>Installation Details</CardTitle>

                    <div className="ag-theme-alpine" style={{ height: '400px', width: '100%', borderRadius: '8px solid black', overflow: 'hidden', border: '1px solid #c1c1c1' }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            animateRows={true}
                            //   getRowStyle={getRowStyle}
                            rowSelection="multiple"
                            //   onCellClicked={cellClickedListener}
                            paginationAutoPageSize="true"
                            paginationPageSize="11"
                            pagination="true"
                            defaultColDef={defaultColDef}
                            headerColor="ddw-primary"
                        //   onGridReady={onGridReady}
                        />
                    </div>

                </CardBody>
            </Card>

        </div>
    );
};

export default Overview;
