import React from 'react';


export default function StatTableHeader(props) {
    const { dates } = props;
    return (
        <tr>
            <th>&nbsp;</th>
            { dates.map(item => <th key={item}>{item}</th>) }
        </tr>
    );
}
