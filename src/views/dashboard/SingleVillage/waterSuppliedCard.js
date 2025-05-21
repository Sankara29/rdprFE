// import React from 'react';

// const WaterSuppliedCard = ({ water = 1234, population }) => {
//     return (
//         <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: '#e3f7f3',
//             borderRadius: '12px',
//             padding: '0px 20px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             width: '250px',
//             fontFamily: 'Arial, sans-serif'
//         }}>
//             <div style={{ marginRight: '15px' }}>
//                 <svg
//                     width="25"
//                     height="25"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#00796b"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path d="M12 2C12 2 7 8.5 7 12a5 5 0 0 0 10 0c0-3.5-5-10-5-10z" />
//                     <path d="M12 17a3 3 0 0 1-3-3" />
//                 </svg>
//             </div>
//             <div>
//                 <div style={{
//                     fontSize: '15px',
//                     // color: '#00796b'
//                 }}>
//                     Per Day Water Supplied
//                 </div>
//                 <div style={{
//                     fontSize: '18px',
//                     fontWeight: 'bold',
//                     color: '#004d40'
//                 }}>
//                     {Number((water / 30) / population).toFixed(2).toLocaleString()} m³
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WaterSuppliedCard;
import React from 'react';

const WaterSuppliedCard = ({ water = 1234, population = 1, days = 30 }) => {
    const perDayPerPerson = ((water / days) / population).toFixed(2);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f0f4f8',
            borderRadius: '12px',
            padding: '0px 20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ marginRight: '15px' }}>
                <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2C12 2 7 8.5 7 12a5 5 0 0 0 10 0c0-3.5-5-10-5-10z" />
                    <path d="M12 17a3 3 0 0 1-3-3" />
                </svg>
            </div>
            <div>
                <div style={{
                    fontSize: '15px',
                    // color: '#6a1b9a' // purple label
                    color: '#666'
                }}>
                    Supplied/capita (Month)
                </div>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#222'
                    // color: '#4a148c' // darker purple
                }}>
                    {perDayPerPerson.toLocaleString()} ltrs/month
                </div>
            </div>
        </div>
    );
};

export default WaterSuppliedCard;
