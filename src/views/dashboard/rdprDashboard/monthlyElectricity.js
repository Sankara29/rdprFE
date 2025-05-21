// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useState, useEffect, useRef, useMemo } from 'react';
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config';
const Overview = () => {
    const gridRef = useRef();
    let [rowData, setRowData] = useState();

    useEffect(() => {
        fetchx(API_URL + "/getMonthlyComsumption")
        // fetchx("http://172.104.244.42:14012/v9/getMonthlyComsumption")
            .then((result) => result.json())
            .then((rowData) => {
                setRowData(rowData["data"]);
                // setRowData(rowData);
                // console.log(rowData)
            });
    }, []);


 

    function formatValue(value) {
      if (value === null || value === undefined || value === '') {
          return '0.00'; // or any placeholder you prefer
      }
      return parseFloat(value).toFixed(2);
  }

      


    const [columnDefs, setColumnDefs] = useState([

        { headerName: 'Month', field: 'month', maxWidth: 94,
            valueFormatter: (params) => {
                // Convert month number to abbreviated month name
                const monthNames = [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                return monthNames[params.value - 1] || ''; // Subtract 1 to match array index
              }
         },
        { headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 190, valueFormatter: params => formatValue(params.value) },


    ]);



    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        filterParams: {
            buttons: ["apply", "reset"],
        },
    }));


  return (
    <div className="p-0">
  
     
            <Card style={{width:'300px'}}>
              <CardBody>
                <CardTitle style={{color:'#001737',fontWeight:'bold',fontSize:'12px'}}>Monthly Electricity Consumed(All District)</CardTitle>

                <div className="ag-theme-alpine" style={{  height: '300px', width: '100%' }}>
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
                            pagination="false"
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
