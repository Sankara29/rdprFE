// Overview.js
import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { useState, useEffect } from 'react';
import API_URL from '../../../config';
const Overview = () => {
  const [data, setData] = useState(null);
  

  useEffect(() => {
        fetchx(API_URL + "/getAllNodeCount")

    // fetchx('http://172.104.244.42:14012/v9/getAllNodeCount')
      .then(result => result.json())
      .then(resp => {
        console.log("resp")
        console.log(resp)
        // setData(resp)
       
        setData(resp['data']);

      })
  }, []);


  // useEffect(() => {
  //   console.log("useEffect called");
    
  //   fetchx('http://172.104.244.42:14012/v9/getAllNodeCount')
  //     .then(result => {
  //       if (!result.ok) {
  //         throw new Error(`HTTP error! Status: ${result.status}`);
  //       }
  //       return result.json();
  //     })
  //     .then(resp => {
  //       console.log("API response received");
  //       console.log(resp);
  //       setData(resp);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching data: ", error);
  //     });
  // }, []);


  // const data = [
  //   { title: 'Total Pump', value: 150 },
  //   { title: 'Total Mini Tank', value: 425 },
  //   { title: 'Total OHT', value: 75 }
  // ];

  return (
    <div className="p-0">
      {/* <p style={{color:'#344563',fontWeight:'bold',fontSize:'26px'}}>Overview</p>
      <p style={{color:'##5e6c84',fontSize:'16px'}}>See insights of RDPR</p> */}
      <Row>
        {data!==null && data.map((item, index) => (

          <Col sm="4" key={index}>
            <Card style={{width:'160px', height:'100px'}}>
              <CardBody>
                <CardTitle style={{color:'#5e6c84',fontWeight:'bold',fontSize:'14px'}}>{item.asset_type}</CardTitle>
                <CardText style={{color:'#344563',fontWeight:'bold',fontSize:'26px'}}>{item.asset_count}</CardText>
                 {/* <CardTitle style={{color:'#5e6c84',fontWeight:'bold',fontSize:'14px'}}>{item.title}</CardTitle>
                 <CardText style={{color:'#344563',fontWeight:'bold',fontSize:'26px'}}>{item.value}</CardText> */}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Overview;

