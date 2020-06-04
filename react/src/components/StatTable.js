import React from 'react';


export default function StatTable(props) {
    const { children: [header, ...rows] } = props; 
    return (
        <table>
            <thead>
                { header }
            </thead>
            <tbody>
                { rows }
            </tbody>
        </table>
    );
}
