import React, { useState, useEffect, useRef, useMemo } from 'react'
import classnames from 'classnames'
import { ListGroup, ListGroupItem, Row, Col, TabContent, TabPane, CardText, CardBody, Card, CardHeader } from 'reactstrap'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'
import API_URL from '../../../config';
import {format} from 'date-fns'
const ListGroupNavigation = ({ selectedTaluk }) => {
    const [activeList, setActiveLIst] = useState('1')

    const toggleList = list => {
        if (activeList !== list) {
            setActiveLIst(list)
        }
    }

    const listGroupStyle = {
        display: 'flex',
        flexDirection: 'row',
        height: '24px',
        width: '50px', // Adjust width as needed
        marginTop: '-22px',
        marginLeft: '106px'

    };
    const listGroupItemStyle = {
        // Your base ListGroupItem style
        display: 'flex',
        justifyContent: 'center', // Centering text horizontally
        alignItems: 'center', // Centering text vertically
        borderRadius: 0, // Remove default border-radius
        cursor: 'pointer',
        borderTop: '1px solid rgb(192,204,218)', // Top border styling
        fontSize: '10px',
        fontWeight: 'bold'
    };

    const activeItemStyle = {
        backgroundColor: '#6d00fe',
        color: '#fff',
        fontWeight: 'bold',
    };

    const firstItemStyle = {
        borderTopLeftRadius: '0.25rem', // Adding back border-radius for the first item
    };

    const lastItemStyle = {
        borderBottomRightRadius: '0.25rem', // Adding back border-radius for the last item
    };



    const CustomHeaderComponent = (props) => {
        return (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {props.displayName}
            </div>
        );
    };



    //   Daily
  const gridRef = useRef();
  let [rowData, setRowData] = useState();

  useEffect(() => {
      fetchx(API_URL + `/getTalukWiseData?taluk_id=${1}&data=date`)
    //   fetchx(`http://172.104.244.42:14012/v9/getTalukWiseData?taluk_id=${selectedTaluk.value}&data=date`)
          .then((result) => result.json())
          .then((rowData) => {
            const filteredData = rowData["data"].filter(item => item.date !== null && item.date !== undefined);

              setRowData(filteredData);
              // setRowData(rowData);
              // console.log(rowData)
          });
//   }, [selectedTaluk]);
}, []);



  function formatValue(value) {
    if (value === null || value === undefined || value === '') {
      return '0.00'; // or any placeholder you prefer
    }
    return parseFloat(value).toFixed(2);
  }
    


  const [columnDefs, setColumnDefs] = useState([

      { headerName: 'Date', field: 'date', maxWidth: 100,
        valueFormatter: (params) => format(new Date(params.value), 'MMM d, yyyy'),
        cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' },headerComponentFramework: CustomHeaderComponent
       },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_water_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true, headerStyle: { fontSize: '2px', fontWeight: 'bold' },  valueFormatter: params => formatValue(params.value)  },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true ,  valueFormatter: params => formatValue(params.value) },


  ]);



  const defaultColDef = useMemo(() => ({
      sortable: true,
      filter: true,
      filterParams: {
          buttons: ["apply", "reset"],
      },
  }));

  // Monthly

  const gridRef2 = useRef();
  const [rowData2, setRowData2] = useState();

  useEffect(() => {
      fetchx(API_URL + `/getTalukWiseData?taluk_id=${1}&data=month`)
    //   fetchx(`http://172.104.244.42:14012/v9/getTalukWiseData?taluk_id=${selectedTaluk.value}&data=month`)
          .then((result) => result.json())
          .then((rowData) => {
            const filteredData = rowData["data"].filter(item => item.month !== null && item.month !== undefined);

              setRowData2(filteredData);
              // setRowData(rowData);
              // console.log(rowData)
          });
//   }, [selectedTaluk]);
}, []);



    


  const [columnDefs2, setColumnDefs2] = useState([

    { headerName: 'Date', field: 'month', maxWidth: 100,
        valueFormatter: (params) => {
            // Convert month number to abbreviated month name
            const monthNames = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            return monthNames[params.value - 1] || ''; // Subtract 1 to match array index
          },        cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' },headerComponentFramework: CustomHeaderComponent
       },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_water_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true, headerStyle: { fontSize: '2px', fontWeight: 'bold' },  },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true  },


  ]);



  const defaultColDef2 = useMemo(() => ({
      sortable: true,
      filter: true,
      filterParams: {
          buttons: ["apply", "reset"],
      },
  }));


  // Yearly

  const gridRef3 = useRef();
  const [rowData3, setRowData3] = useState();

  useEffect(() => {
      fetchx(API_URL + `/getTalukWiseData?taluk_id=${1}&data=year`)
    //   fetchx(`http://172.104.244.42:14012/v9/getTalukWiseData?taluk_id=${selectedTaluk.value}&data=year`)
          .then((result) => result.json())
          .then((rowData) => {
            const filteredData = rowData["data"].filter(item => item.year !== null && item.year !== undefined);

              setRowData3(filteredData);
              // setRowData(rowData);
              // console.log(rowData)
          });
//   }, [selectedTaluk]);
}, []);



    


  const [columnDefs3, setColumnDefs3] = useState([

    { headerName: 'Date', field: 'year', maxWidth: 100,
        // valueFormatter: (params) => format(new Date(params.value), 'MMM d, yyyy'),
        cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' },headerComponentFramework: CustomHeaderComponent
       },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_water_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true, headerStyle: { fontSize: '2px', fontWeight: 'bold' },  },
      { headerName: 'ELE CONSUMED(kwh) ', field: 'total_energy_supply_sum', maxWidth: 120,  wrapText: true,
        headerComponentFramework: CustomHeaderComponent, cellStyle: { textAlign: 'center',fontSize: '10px', fontWeight: 'bold' }, filter: true  },


  ]);



  const defaultColDef3 = useMemo(() => ({
      sortable: true,
      filter: true,
      filterParams: {
          buttons: ["apply", "reset"],
      },
  }));




    return (
        <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',width:'360px', marginLeft:'150px' }}>
            <CardBody>
                {/* <CardHeader style={{color:'#284b75',fontWeight:'bold',fontSize:'20px', textAlign:'center'}}>{selectedTaluk.label} Taluk</CardHeader> */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                        {/* {selectedTaluk.label} */}
                         Taluk
                    </CardHeader>
                </div>
                <CardText style={{ flex: '1', marginBottom: 0, color: '#001737', fontWeight: 'bold' }}>
                    {activeList === '1' ? "Daily Stats" : activeList === '2' ? "Monthly Stats" : activeList === '3' ? "Yearly Stats" : "Default Stats"}
                </CardText>

                <ListGroup style={listGroupStyle}>
                    <ListGroupItem
                        className={classnames('cursor-pointer', { active: activeList === '1' })}
                        onClick={() => toggleList('1')}
                        action
                        style={{
                            ...listGroupItemStyle,
                            ...(activeList === '1' ? activeItemStyle : {}),
                            ...firstItemStyle,
                        }}
                    >
                        Date
                    </ListGroupItem>
                    <ListGroupItem
                        className={classnames('cursor-pointer', { active: activeList === '2' })}
                        onClick={() => toggleList('2')}
                        action
                        style={{
                            ...listGroupItemStyle,
                            ...(activeList === '2' ? activeItemStyle : {}),
                        }}
                    >
                        Month
                    </ListGroupItem>
                    <ListGroupItem
                        className={classnames('cursor-pointer', { active: activeList === '3' })}
                        onClick={() => toggleList('3')}
                        action
                        style={{
                            ...listGroupItemStyle,
                            ...(activeList === '3' ? activeItemStyle : {}),
                            ...lastItemStyle,
                        }}
                    >
                        Year
                    </ListGroupItem>
                </ListGroup>


                <CardText style={{ flex: '1', marginBottom: 0, color: '#8392a5', fontSize: '10px', fontWeight: 'bold' }}>
                    {activeList === '1' ? "Measure How Fast You’re Growing Daily" : activeList === '2' ? "Measure How Fast You’re Growing Monthly" : activeList === '3' ? "Measure How Fast You’re Growing Yearly" : "Default Stats"}
                </CardText>

                {/* </Col> */}

                {/* <Col className='mt-1' md='8' sm='12'> */}
                <TabContent activeTab={activeList}>
                    <TabPane tabId='1'>
                        {/* <CardText>
                            Croissant jelly-o halvah chocolate sesame snaps. Brownie caramels candy canes chocolate cake marshmallow
                            icing lollipop I love. Gummies macaroon donut caramels biscuit topping danish.
                        </CardText>
                        <CardText>
                            Tiramisu donut bonbon gummi bears. Brownie cake lollipop cheesecake gingerbread brownie. Tart sugar plum
                            cake I love croissant I love apple pie.Gummies I love apple pie sugar plum lemon drops candy canes cake.
                            Pastry I love jelly beans jelly beans brownie bear claw caramels. Pastry I love cake liquorice icing
                            icing. I love carrot cake cupcake jelly-o wafer cookie jujubes cake.
                        </CardText> */}
                        <CardBody>
                            <div className="ag-theme-alpine" style={{ height: '300px',marginLeft:'-30px',marginRight:'-30px' }}>
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
                    </TabPane>
                    <TabPane tabId='2'>
                        {/* <CardText>
                            Jelly beans topping I love chocolate cake. Lemon drops jujubes jelly I love I love marshmallow gummies
                            icing. Liquorice jelly-o lemon drops sugar plum.Bear claw chupa chups soufflé tart carrot cake dessert. I
                            love tiramisu I love marzipan candy canes brownie marshmallow wafer. I love sugar plum cheesecake gummi
                            bears I love pudding halvah gummi bears.
                        </CardText>
                        <CardText>
                            I love donut dragée cupcake. Tootsie roll tart soufflé tart powder sesame snaps lollipop. Jelly beans tart
                            macaroon I love biscuit. I love danish cheesecake sugar plum dragée croissant I love danish.
                        </CardText> */}
                         <CardBody>
                            <div className="ag-theme-alpine" style={{ height: '300px',marginLeft:'-30px',marginRight:'-30px' }}>
                                <AgGridReact
                                    ref={gridRef2}
                                    rowData={rowData2}
                                    columnDefs={columnDefs2}
                                    animateRows={true}
                                    //   getRowStyle={getRowStyle}
                                    rowSelection="multiple"
                                    //   onCellClicked={cellClickedListener}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="11"
                                    pagination="false"
                                    defaultColDef={defaultColDef2}
                                    headerColor="ddw-primary"
                                //   onGridReady={onGridReady}
                                />
                            </div>
                        </CardBody>
                    </TabPane>
                    <TabPane tabId='3'>
                        {/* <CardText>
                            Dragée dessert sweet roll chocolate bar. Gummi bears I love dragée pie I love. Cake pastry I love cookie.
                        </CardText>
                        <CardText>
                            Wafer cheesecake cheesecake. Pastry bonbon chocolate pastry pudding topping sweet roll lollipop. I love
                            macaroon gummi bears cookie topping chocolate bar carrot cake.Sweet roll pastry chocolate cake tiramisu
                            dessert marzipan pudding cake. Cake macaroon danish jelly beans I love chocolate cookie sugar plum. Jelly
                            beans chocolate cake sugar plum carrot cake.
                        </CardText> */}
                         <CardBody>
                            <div className="ag-theme-alpine" style={{ height: '300px',marginLeft:'-30px',marginRight:'-30px' }}>
                                <AgGridReact
                                    ref={gridRef3}
                                    rowData={rowData3}
                                    columnDefs={columnDefs3}
                                    animateRows={true}
                                    //   getRowStyle={getRowStyle}
                                    rowSelection="multiple"
                                    //   onCellClicked={cellClickedListener}
                                    paginationAutoPageSize="true"
                                    paginationPageSize="11"
                                    pagination="false"
                                    defaultColDef={defaultColDef3}
                                    headerColor="ddw-primary"
                                //   onGridReady={onGridReady}
                                />
                            </div>
                        </CardBody>
                    </TabPane>
                 
                </TabContent>
                {/* </Col> */}
                {/* </Row> */}
            </CardBody>
        </Card>
    )
}
export default ListGroupNavigation