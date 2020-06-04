import React from 'react';


export default function StatTableHeader(props) {
    const { dates } = props;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const todayTimeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    return (
        <tr>
            <th>&nbsp;</th>
            { dates.map(item => <th style={{backgroundColor: item === todayTimeBucket? 'yellow': null }} key={item}>{item}</th>) }
        </tr>
    );
}
