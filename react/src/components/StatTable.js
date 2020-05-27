import React from 'react';


export default function StatTable(props) {
    const { children: [header, ...rows] } = props; 
    return (
        <table border="1">
            <thead>
                { header }
            </thead>
            <tbody>
                { rows }
            </tbody>
        </table>
    );
}
