// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useState, useEffect } from 'react';
import { Progress } from 'reactstrap'
import API_URL from '../../../config';

const Overview = () => {
    // const [data, setData] = useState(null);


    useEffect(() => {
        // fetchx(API_URL + "/getAllNodeCount")

        fetchx('https://rdprproject.free.beeceptor.com/getAssetsAndConsumptionInfo')
            .then(result => result.json())
            .then(resp => {
                console.log("resp")
                console.log(resp)
                //   setData(resp)
                // Booker = resp['data']
                //console.log(resp['data'])
                // setData(resp['data']);

            })
    }, []);

    let data = [
        { "district": "District A", "percentage": 20 },
        { "district": "District B", "percentage": 35 },
        { "district": "District C", "percentage": 50 },
        { "district": "District D", "percentage": 45 },
        { "district": "District E", "percentage": 15 }
      ]
      



    return (
        <div className="p-0">


            <Card style={{height:'398px'}}>
                <CardBody>
                    <CardTitle ><p style={{ color: '#001737', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>Highest Water Supplied</p><p style={{ color: '#8094ae', fontWeight: 'bold', fontSize: '10px', }}>Top 5 District</p></CardTitle>


                    {/* <div>
      <Progress value={25} style={{ color: '#f4bd0e',height:'8px' }} className='mt-2' />
      <Progress value={65} style={{ color: '#f4bd0e',height:'8px' }} className='mt-2'  />
      <Progress value={45} style={{ color: '#ff63a5',height:'8px' }} className='mt-2' />
      <Progress value={45} style={{ color: '#ff63a5',height:'8px' }} className='mt-2' />
      <Progress value={45} style={{ color: '#ff63a5',height:'8px' }} className='mt-2' />
    </div> */}

                    {/* {data.map((item, index) => (
        <div key={index}>
          <h5>{item.district}</h5>
          <Progress value={item.percentage} style={{ color: index % 2 === 0 ? '#f4bd0e' : '#ff63a5', height: '8px',width:'500px' }} className='mt-2'>
            
          </Progress>{item.percentage}%
        </div>
      ))} */}


                    {data.map((item, index) => (
                        <div key={index} className="mt-1">
                            <h5>{item.district}</h5>

                            <div className="d-flex align-items-center">

                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <Progress value={item.percentage} style={{ backgroundColor: index % 2 === 0 ? '#f4bd0e' : '#ff63a5', height: '8px', width: '500px' }}>
                                        {/* {item.district} */}
                                    </Progress>
                                </div>
                                <div style={{ width: '60px' }}>
                                    <strong>{item.percentage}%</strong>
                                </div>
                            </div>
                        </div>
                    ))}



                </CardBody>
            </Card>

        </div>
    );
};

export default Overview;
