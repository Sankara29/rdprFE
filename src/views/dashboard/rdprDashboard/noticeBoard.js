// ** Custom Components
import Timeline from '@components/timeline'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { useState, useEffect, useRef, useMemo } from 'react';
// import { ro } from 'date-fns/locale';
import API_URL from '../../../config';

// ** Data


const UserTimeline = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
      fetchx(API_URL + "/getNoticeboard")
      // fetchx("http://172.104.244.42:14012/v9/getNoticeboard")
          .then((result) => result.json())
          .then((rowData) => {
            console.log(rowData)
            if (rowData.statusCode === 200 && Array.isArray(rowData.data)) {
              console.log(rowData.data)
              setData(rowData.data);
              const transformedData = rowData.data.map(item => ({
                title: item.note, // Assuming datetime is formatted as needed
                content: item.datetime,
                // meta: '09:30am' // Example meta data, adjust as needed
              }));
              setData(transformedData); 
            } else {
              setData([]); // Set to an empty array if data is not an array or status code is not 200
            }
              // setRowData(rowData);
              // console.log(rowData)
          });
  }, []);

  console.log(data)
  const colors = ['success', 'warning', 'danger']

  return (
    <Card className='card-user-timeline' style={{height:'450px'}}>
      <CardHeader>
        <div className='d-flex align-items-center'>
          <CardTitle tag='h4'>Notice Board</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
      {data.length > 0 ? (
          <Timeline
            className='ms-50 mb-0'
            style={{ height: '700px' }}
            data={data.map((item, index) => ({
              ...item,
              color: colors[index % colors.length],
            }))}
            
          />
        ) : (
          <p>No notices available</p>
        )}

{/* <ul>
        {data.map((item, index) => (
          <li key={index}>
            <p>{item.datetime}</p>
            <p>{item.note}</p>
          </li>
        ))}
      </ul> */}

      </CardBody>
    </Card>
  )
}

export default UserTimeline
