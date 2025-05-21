// import React from 'react';

// const BatteryCellRenderer = ({ value }) => {
//   const batteryPercentage = Math.max(0, Math.min(100, value)); // Ensure percentage is between 0 and 100

//   const getBatteryColor = () => {
//     if (batteryPercentage > 50) return '#4CAF50'; // Green for high battery
//     if (batteryPercentage > 20) return '#E3B635'; // Yellow for medium battery
//     return '#F44336'; // Red for low battery
//   };

//   const batteryStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     width: '40px',
//     height: '20px',
//     border: '2px solid #000',
//     borderRadius: '4px',
//     position: 'relative',
//     backgroundColor: '#91979E',

//   };

//   const batteryLevelStyle = {
//     height: '100%',
//     width: `${batteryPercentage}%`,
//     backgroundColor: getBatteryColor(),
//     borderRadius: '2px 0 0 2px',
//     transition: 'width 0.3s ease-in-out',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#fff',
//     fontSize: '10px',
//     fontWeight: 'bold',
//   };

//   const batteryTipStyle = {
//     width: '4px',
//     height: '12px',
//     backgroundColor: '#000',
//     position: 'absolute',
//     top: '2px',
//     right: '-6px',
//     borderRadius: '2px',
//   };

//   return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       <div style={batteryStyle}>
//         <div style={batteryLevelStyle}>
//           {batteryPercentage}%
//         </div>
//         <div style={batteryTipStyle}></div>
//       </div>
//     </div>
//   );
// };

// export default BatteryCellRenderer;



import React from 'react';

const BatteryCellRenderer = ({ value }) => {
  const batteryPercentage = Math.max(0, Math.min(100, value)); // Ensure percentage is between 0 and 100

  const getBatteryColor = () => {
    if (batteryPercentage > 50) return '#4CAF50'; // Green for high battery
    if (batteryPercentage < 40) return '#E71616'; // Yellow for medium battery
    return '#F44336'; // Red for low battery
  };

  const batteryStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '20px',
    border: '2px solid #5B5C5D',
    borderRadius: '4px',
    position: 'relative',
    backgroundColor: '#fff', // Background for the battery container
  };

  const batteryLevelStyle = {
    height: '100%',
    width: `${batteryPercentage}%`,
    backgroundColor: getBatteryColor(),
    borderRadius: '2px 0 0 2px',
    position: 'absolute',
    left: 0,
    top: 0,
    transition: 'width 0.3s ease-in-out',
  };

  const batteryTipStyle = {
    width: '4px',
    height: '12px',
    backgroundColor: '#5B5C5D',
    position: 'absolute',
    top: '2px',
    right: '-6px',
    borderRadius: '2px',
  };

  const percentageStyle = {
    position: 'relative',
    zIndex: 1, // Ensures the text stays on top of the battery level indicator
    color: batteryPercentage < 40 ? '#000' : '#fff', // Text color
    fontSize: '10px',
    fontWeight: 'bold',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={batteryStyle}>
        <div style={batteryLevelStyle}></div>
        <span style={percentageStyle}>{batteryPercentage}%</span>
        <div style={batteryTipStyle}></div>
      </div>
    </div>
  );
};

export default BatteryCellRenderer;
