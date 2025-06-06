import { Card, CardBody, CardText, Row, Col, Table } from 'reactstrap'
import { format } from "date-fns";
import { useEffect, useState } from 'react';
import React from 'react';
import API_URL from "../../../../config";

import logo from '@src/assets/images/logo/oterra.jpg';
const PreviewBill = ({ data, print }) => {
    // console.log(print)
    // console.log(data)
    // console.log(data.hasOwnProperty('Discount'))
  
    if (typeof (data) == 'undefined') {
      console.log('Hello')
    }
    const [showtable, setshowtable] = useState(false)
    useEffect(() => {
      // if(print==true){
      // setTimeout(() => window.print(), 500)
      // }
    }, [])
    if (data != '') {
      // setshowtable(true)
      // console.log(data)
    }
    function CartTable() {
    //   console.log(data['items'])
      return (
        <table >
          <thead >
            <tr>
              <th style={{ margin: '6px 0', paddingLeft: '10px' }} >Item Name</th>
              <th style={{ margin: '6px 0', paddingLeft: '10px' }} >Qty</th>
              <th style={{ margin: '6px 0', paddingLeft: '10px' }} >Price</th>
  
            </tr>
          </thead>
          <tbody>
            {data['items'].map((row, index) => (
              <tr key={index}>
                <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemID" + index}>{row.itemName}</td>
                <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"itemName" + index}>{row.qty}</td>
                <td style={{ margin: '6px 0', paddingLeft: '10px' }} id={"qty" + index}>{console.log(row.Price)}</td>
  
              </tr>
  
            ))}
          </tbody>
        </table>
      )
    }
  
  
  
    return typeof (data) != 'undefined' ? (
      <Card className='invoice-preview-card'>
        <CardBody className='invoice-padding pb-0'>
          {/* Header */}
          <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
            <div>
              <div className='logo-wrapper'>
  
                {/* <svg viewBox='0 0 139 95' version='1.1' height='24'>
                  <defs>
                    <linearGradient id='invoice-linearGradient-1' x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%'>
                      <stop stopColor='#000000' offset='0%'></stop>
                      <stop stopColor='#FFFFFF' offset='100%'></stop>
                    </linearGradient>
                    <linearGradient
                      id='invoice-linearGradient-2'
                      x1='64.0437835%'
                      y1='46.3276743%'
                      x2='37.373316%'
                      y2='100%'
                    >
                      <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                      <stop stopColor='#FFFFFF' offset='100%'></stop>
                    </linearGradient>
                  </defs>
                  <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    <g transform='translate(-400.000000, -178.000000)'>
                      <g transform='translate(400.000000, 178.000000)'>
                        <path
                          className='text-primary'
                          d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                          style={{ fill: 'currentColor' }}
                        ></path>
                        <path
                          d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                          fill='url(#invoice-linearGradient-1)'
                          opacity='0.2'
                        ></path>
                        <polygon
                          fill='#000000'
                          opacity='0.049999997'
                          points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                        ></polygon>
                        <polygon
                          fill='#000000'
                          opacity='0.099999994'
                          points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                        ></polygon>
                        <polygon
                          fill='url(#invoice-linearGradient-2)'
                          opacity='0.099999994'
                          points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                        ></polygon>
                      </g>
                    </g>
                  </g>
                </svg> */}
                <img src={logo} alt="Logo" />
                {/* <h3 className='text-primary invoice-logo'>Vuexy</h3> */}
              </div>
              <h6 className='mb-25'>Guest Name : {data['guestName']}</h6>
              <h6 className='mb-25'>Room Number:506 </h6>
              <h6 className='mb-0'>Pax : {data['pax']} </h6>
            </div>
            <div className='mt-md-1 mt-3'>
              <h4>Outlet Name: <span>{localStorage.getItem('RestaurantSelected')}</span></h4>
              <h4>Bill Number:{data['billNoDisplay']}</h4>
              {/* <strong><p className='invoice-date-title'> {`Date: ${format(new Date(data['billDateTime']), 'dd-MMM-yy')}  Time: ${format(new Date(data['billDateTime']), 'HH:mm')}`}</p> </strong> */}
              <h6 className='invoice-number'>FSSAI No: 10018043002066</h6>
              <h6>Table Number:{localStorage.getItem('tableNumber')}</h6>
              <h6>User : {data['stewardName']}</h6>
  
            </div>
          </div>
          {/* /Header */}
        </CardBody>
  
        {/* <CartTable/> */}
        {/* <hr className='invoice-spacing' /> */}
  
        {/* Address and Contact */}
        {/* <CardBody className='invoice-padding pt-0'>
          <Row className='invoice-spacing'>
            <Col className='p-0' xl='8'>
              <h6 className='mb-2'>Invoice To:</h6>
              <h6 className='mb-25'>{data.invoice.client.name}</h6>
              <CardText className='mb-25'>{data.invoice.client.company}</CardText>
              <CardText className='mb-25'>{data.invoice.client.address}</CardText>
              <CardText className='mb-25'>{data.invoice.client.contact}</CardText>
              <CardText className='mb-0'>{data.invoice.client.companyEmail}</CardText>
            </Col>
            <Col className='p-0 mt-xl-0 mt-2' xl='4'>
              <h6 className='mb-2'>Payment Details:</h6>
              <table>
                <tbody>
                  <tr>
                    <td className='pe-1'>Total Due:</td>
                    <td>
                      <span className='fw-bold'>{data.paymentDetails.totalDue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className='pe-1'>Bank name:</td>
                    <td>{data.paymentDetails.bankName}</td>
                  </tr>
                  <tr>
                    <td className='pe-1'>Country:</td>
                    <td>{data.paymentDetails.country}</td>
                  </tr>
                  <tr>
                    <td className='pe-1'>IBAN:</td>
                    <td>{data.paymentDetails.iban}</td>
                  </tr>
                  <tr>
                    <td className='pe-1'>SWIFT code:</td>
                    <td>{data.paymentDetails.swiftCode}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </CardBody> */}
        {/* /Address and Contact */}
  
        {/* Invoice Description */}
        <Table responsive>
          <thead>
            <tr>
              <th className='py-1'>Item Name</th>
              <th className='py-1'>Quantity</th>
              <th className='py-1'>Price</th>
            </tr>
          </thead>
          <tbody>
            {data['items'].map((row, index) => (
                
              <tr className='border-bottom'>
                <td className='py-1'>
                  <p className='card-text fw-bold mb-25' id={"itemID" + index}> {row.itemName}</p>
                </td>
                <td className='py-1'>
                  <span className='fw-bold'>{row.qty}</span>
                </td>
                <td className='py-1'>
                  <span className='fw-bold'>{row.Price}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* /Invoice Description */}
  
        {/* Total & Sales Person */}
        <CardBody className='invoice-padding pb-0'>
          <Row className='invoice-sales-total-wrapper'>
            <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
              {/* <CardText className='mb-0'>
                <span className='fw-bold'>Salesperson:</span> <span className='ms-75'>Alfie Solomons</span>
              </CardText> */}
            </Col>
            <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
              <div className='invoice-total-wrapper'>
                <div className='invoice-total-item'>
                  {/* <p className='invoice-total-title'>Subtotal:</p> */}
                  {/* <p className='invoice-total-amount'>{data.subTotal}</p> */}
                  {/* <p className='invoice-total-amount'>{parseFloat(data.Balance).toFixed(2)}</p> */}
                </div>
                {/* {data.hasOwnProperty('Discount') && */}
                {data.DiscountAmt.Food != 0 &&
                  <>
                    {data.classDiscDisplay.map((item, index) => (
                      <div key={index} className='invoice-total-item'>
                        <p className='invoice-total-title'>{item.item}:</p>
                        <p className='invoice-total-title'>{item.value}</p>
                      </div>
                    ))}
                  </>
                }
                {/* } */}
                {/* {data.hasOwnProperty('Discount') && */}
                {data.DiscountAmt.Liquor !== 0 && (
                  <>
                    {data.classDiscDisplay.map((item, index) => (
                      <div key={index} className='invoice-total-item'>
                        <p className='invoice-total-title'>{item.item}:</p>
                        <p className='invoice-total-title'>{item.value}</p>
                      </div>
                    ))}
                  </>
                )}
                {/* } */}
                {/* {data.hasOwnProperty('Discount') && */}
                {data.DiscountAmt.SoftDrinks != 0 &&
                  <>
                    {data.classDiscDisplay.map((item, index) => (
                      <div key={index} className='invoice-total-item'>
                        <p className='invoice-total-title'>{item.item}:</p>
                        <p className='invoice-total-title'>{item.value}</p>
                      </div>
                    ))}
                  </>
                }
                {/* } */}
                {/* {data.hasOwnProperty('Discount') && */}
                {data.DiscountAmt.Smokes != 0 &&
                  <>
                    {data.classDiscDisplay.map((item, index) => (
                      <div key={index} className='invoice-total-item'>
                        <p className='invoice-total-title'>{item.item}:</p>
                        <p className='invoice-total-title'>{item.value}</p>
                      </div>
                    ))}
                  </>
                }
                {/* } */}
                {/* {data.hasOwnProperty('Discount') && */}
                {data.DiscountAmt.Others != 0 &&
                  <>
                    {data.classDiscDisplay.map((item, index) => (
                      <div key={index} className='invoice-total-item'>
                        <p className='invoice-total-title'>{item.item}:</p>
                        <p className='invoice-total-title'>{item.value}</p>
                      </div>
                    ))}
                  </>
                }
                {/* } */}
                {data.tax.CGST9 != 0 &&
  
                  <div className='invoice-total-item'>
                    {/* <p className='invoice-total-title'>CGST 9%:</p> */}
                    {/* <p className='invoice-total-amount'>{parseFloat(data.tax.CGST9).toFixed(2)}</p> */}
  
                    {/* <p className='invoice-total-amount'>{(parseFloat(data.tax.CGST9))}</p> */}
                  </div>
                }
                {data.tax.SGST9 != 0 &&
                  <div className='invoice-total-item'>
                    {/* <p className='invoice-total-title'>SGST 9%:</p> */}
                    {/* <p className='invoice-total-amount'>{(parseFloat(data.tax.SGST9)).toFixed(2)}</p> */}
                  </div>
                }
                {data.tax.CGST14 != 0 &&
  
                  <div className='invoice-total-item'>
                    <p className='invoice-total-title'>CGST 14%:</p>
                    <p className='invoice-total-amount'>{(parseFloat(data.tax.CGST14)).toFixed(2)}</p>
                  </div>
                }
                {data.tax.SGST14 != 0 &&
                  <div className='invoice-total-item'>
                    <p className='invoice-total-title'>SGST 14%:</p>
                    <p className='invoice-total-amount'>{(parseFloat(data.tax.SGST14)).toFixed(2)}</p>
                  </div>
                }
                {data.Round != 0 && <div className='invoice-total-item'>
                  <p className='invoice-total-title'>Round off:</p>
                  <p className='invoice-total-amount'>{(data.roundOff).toFixed(2)}</p>
                </div>
                }
                <hr className='my-50' />
                <div className='invoice-total-item'>
                  {/* <p className='invoice-total-title'>TOTAL:</p> */}
                  {/* <p className='invoice-total-amount'>{(parseFloat(data.total)).toFixed(2)}</p> */}
  
                  {/* <p className='invoice-total-amount'>{data.total}</p> */}
                </div>
              </div>
            </Col>
          </Row>
        
        </CardBody>
        {/* /Total & Sales Person */}
  
        <hr className='invoice-spacing' />
  
        {/* Invoice Note */}
        <CardBody className='invoice-padding pt-0'>
          <Row>
            <Col sm='12'>
              <span>
                <strong><p>GSTIN No. 29AABCV0552G1ZF</p></strong>
                <p>CIN: U72200KA1999PLC025275</p>
                <p>THE OTERRA</p>
                <p>A unit of Velankani Information Systems Limited</p>
                <p>43, Electronic City,Phase 1,Hosur Road, Bangalore 560100 India</p>
                <p>T: +91 80 3003 0303 F: +91 80 3985 4519 W: www.theoterra.com</p>
              </span>
            </Col>
          </Row>
        </CardBody>
        {/* /Invoice Note */}
      </Card>
    ) : null
  }
  
  export default PreviewBill