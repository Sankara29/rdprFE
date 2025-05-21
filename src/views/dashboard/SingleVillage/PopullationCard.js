import React from 'react';

const PopulationCard = ({ population = 3452 }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f0f4f8',
            borderRadius: '12px',
            padding: '0px 20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '220px',
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </div>
            <div>
                <div style={{
                    fontSize: '15px',
                    color: '#666'
                }}>
                    Population
                </div>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#222'
                }}>
                    {population?.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default PopulationCard;
