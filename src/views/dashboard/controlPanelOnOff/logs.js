// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
// // import API_URL2 from '../../../config';
// // Dummy function to simulate fetching logs


// const API_URL2 = 'http://172.104.244.42:14013'



// const fetchLogs = () => {
//   return [
//     {
//       sessionId: 11286,
//       time: '2024-7-8 18:20:05',
//       NSGW800001: '2401:4900:84bd:6443::2',
//       NSGW800003: '2401:4900:84bd:6443::2',
//       tankList: 'NSTN0006',
//       message: 'Automation started' 
//     },
//     {
//       sessionId: 11287,
//       time: '2024-7-8 18:24:59',
//       NSGW800001: '2401:4900:84bd:6443::2',
//       tankList: 'NSTN0006',
//       message: 'Automation started\nTurning ON THE MOTOR\nNSTN0006 is full | closing'
//     }
//   ];
// };

// const LogsCard = () => {
//   const [logs, setLogs] = useState([]);



// //   http://172.104.244.42:14013/AutomationLogger

// // useEffect(() => {
// //     const intervalId = setInterval(() => {
// //       fetch(API_URL2 + "/AutomationLogger")
// //         .then((result) => result.json())
// //         .then((rowData) => {
// //           // Assuming rowData contains an array of log entries
// //           setLogs((prevLogs) => [...rowData, ...prevLogs]);
// //         })
// //         .catch((error) => {
// //           console.error("Error fetching logs:", error);
// //         });
// //     }, 10000);

// //     return () => clearInterval(intervalId);
// //   }, []);


// useEffect(() => {
//     const fetchLogs = () => {
//       fetch(API_URL2 + "/AutomationLogger")
//         .then((result) => result.json())
//         .then((rowData) => {
//           // Assuming rowData contains an array of log entries
//           setLogs((prevLogs) => [...rowData, ...prevLogs]);
//         })
//         .catch((error) => {
//           console.error("Error fetching logs:", error);
//         });
//     };

//     // Fetch logs immediately on component mount
//     fetchLogs();

//     // Fetch logs every 10 seconds
//     const intervalId = setInterval(fetchLogs, 10000);

//     // Clear interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);



//   return (
//     <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '10px' }}>
//       <CardHeader style={{ color: '#284b75', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
//         Logs
//       </CardHeader>
//       <CardBody style={{ maxHeight: '600px', overflowY: 'auto' }}>
//         {logs.map((log, index) => (
//           <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffffff', border: '1px solid #dee2e6', borderRadius: '8px' }}>
//             <CardText>
//               <strong>SESSION_ID:</strong> {log.sessionId}
//             </CardText>
//             <CardText>
//               <strong>TIME:</strong> {log.time}
//             </CardText>
//             <CardText>
//               <strong>NSGW800001:</strong> {log.NSGW800001}
//             </CardText>
//             {log.NSGW800003 && (
//               <CardText>
//                 <strong>NSGW800003:</strong> {log.NSGW800003}
//               </CardText>
//             )}
//             <CardText>
//               <strong>Tanklist:</strong> {log.tankList}
//             </CardText>
//             <CardText>
//               <strong>Message:</strong> <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{log.message}</pre>
//             </CardText>
//           </div>
//         ))}
//       </CardBody>
//     </Card>
//   );
// };

// export default LogsCard;





// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
// // import { API_URL2 } from '../../../config';
// const API_URL2 = 'http://172.104.244.42:14013'

// const LogsCard = () => {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     const fetchLogs = () => {
//       fetch(API_URL2 + "/AutomationLogger")
//         .then((result) => result.text())  // Expect the response to be plain text
//         .then((logText) => {
//           const logEntries = logText.split('SESSION_ID -').map(entry => 'SESSION_ID -' + entry.trim()).filter(entry => entry !== 'SESSION_ID -');
//           setLogs((prevLogs) => [...logEntries, ...prevLogs]);
//         })
//         .catch((error) => {
//           console.error("Error fetching logs:", error);
//         });
//     };

//     fetchLogs();

//     const intervalId = setInterval(fetchLogs, 10000);

//     return () => clearInterval(intervalId);
//   }, []);



//   return (
//     <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
//       <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
//          Logs
//       </CardHeader>
//       <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#1e1e1e' }}>
//         {logs.map((log, index) => (
//           <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#2e2e2e', border: '1px solid #333', borderRadius: '8px' }}>
//             <pre style={{ whiteSpace: 'pre-wrap', color: '#00ff00' }}>{log}</pre>
//           </div>
//         ))}
//       </CardBody>
//     </Card>
//   );
// };

// export default LogsCard;



import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
// import { API_URL2 } from '../../../config';
const API_URL2 = 'http://172.104.244.42:14013';

const LogsCard = () => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const fetchLogs = () => {
      fetch(API_URL2 + "/AutomationLogger")
        .then((result) => result.text())  // Expect the response to be plain text
        .then((logText) => {
          const logEntries = logText.split('SESSION_ID -').map(entry => 'SESSION_ID -' + entry.trim()).filter(entry => entry !== 'SESSION_ID -');
          // setLogs((prevLogs) => [...logEntries, ...prevLogs]);
          setLogs( [...logEntries]);
        })
        .catch((error) => {
          console.error("Error fetching logs:", error);
        });
    };
    fetchLogs();

    const intervalId = setInterval(fetchLogs, 10000);

    return () => clearInterval(intervalId);

  }, []);



  console.log(logs)
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div>
    {/* <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#000000', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
      <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        Logs
      </CardHeader>
      <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#000000' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#00ff00' }}>
              {log.split('\n').map((line, lineIndex) => (
                <span key={lineIndex} style={{ color: line.includes(':') ? '#ff4500' : '#00ff00' }}>{line}</span>
              ))}
            </pre>
          </div>
        ))}
        <div ref={logsEndRef} />
      </CardBody>
    </Card>

    <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#000000', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
      <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        Logs
      </CardHeader>
      <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#000000' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
            {log.split('\n').map((line, lineIndex) => (
              <pre key={lineIndex} style={{ whiteSpace: 'pre-wrap', color: line.includes(':') ? '#ff4500' : '#00ff00' }}>
                {line}
              </pre>
            ))}
          </div>
        ))}
        <div ref={logsEndRef} />
      </CardBody>
    </Card> */}

        <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#000000', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
        <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333', backgroundColor: '#000000' }}>
          Logs
        </CardHeader>
        <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#000000' }}>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
              {log.split('\n').map((line, lineIndex) => (
                // <pre key={lineIndex} style={{ whiteSpace: 'pre-wrap', color: line.includes(':') ? '#ff4500' : '#00ff00',background:'#000000' }}>
                <pre key={lineIndex} style={{ whiteSpace: 'pre-wrap', color: '#00ff00',background:'#000000' }}>
                  {line}
                </pre>
              ))}
            </div>
          ))}
          <div ref={logsEndRef} />
        </CardBody>
      </Card>
      </div>
    // <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#000000', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
    //   <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333', backgroundColor: '#000000' }}>
    //     Logs
    //   </CardHeader>
    //   <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#000000', padding: '15px', border: '1px solid #333', borderRadius: '8px' }}>
    //     {/* Group logs by SESSION_ID */}
    //     {Object.values(
    //       logs.reduce((acc, log, index) => {
    //         const sessionIdMatch = log.match(/SESSION_ID - (\d+)/);
    //         if (sessionIdMatch) {
    //           const sessionId = sessionIdMatch[1];
    //           acc[sessionId] = acc[sessionId] || [];
    //           acc[sessionId].push(
    //             <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
    //               {log.split('\n').map((line, lineIndex) => (
    //                 <pre key={lineIndex} style={{ whiteSpace: 'pre-wrap', color: '#00ff00', background: '#000000' }}>{line}</pre>
    //               ))}
    //             </div>
    //           );
    //         }
    //         return acc;
    //       }, {})
    //     ).map((sessionLogs, sessionId) => (
    //       <div key={sessionId}>
    //         <h4 style={{ color: '#00ff00', marginBottom: '10px' }}>SESSION_ID - {sessionId}</h4>
    //         {sessionLogs}
    //       </div>
    //     ))}
    //     <div ref={logsEndRef} />
    //   </CardBody>
    // </Card>


    //     <Card style={{ width: '100%', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#000000', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontFamily: 'monospace' }}>
    //     <CardHeader style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', borderBottom: '1px solid #333', backgroundColor: '#000000' }}>
    //       Logs
    //     </CardHeader>
    //     <CardBody style={{ maxHeight: '600px', overflowY: 'auto', backgroundColor: '#000000', padding: '15px', border: '1px solid #333', borderRadius: '8px' }}>
    //       {/* {logs.map((log, index) => (
    //                 <pre key={index} style={{ whiteSpace: 'pre-wrap', color: log.includes('-') ? '#ff4500' : '#00ff00',background:'#000000' }}>
    //     {log}
    //         </pre>
    //       ))} */}
    //          {logs.map((log, index) => (
    //         <pre key={index} style={{ whiteSpace: 'pre-wrap', color: log.startsWith('SESSION_ID') || log.startsWith('TIME') || log.startsWith('NSGW') ? '#ff4500' : '#00ff00', backgroundColor: '#000000' }}>
    //           {log}
    //         </pre>
    //       ))}
    //       <div ref={logsEndRef} />
    //     </CardBody>
    //   </Card>


  );
};

export default LogsCard;
