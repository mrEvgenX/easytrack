import React from 'react';
import './StatTableRow.css';


export default function StatTableRow(props) {
    const { name, checks } = props;
    return (
        <>
            <tr>
                <td>{ name }</td>
                { checks.map(checkItem => <td key={ checkItem.date }>
                    <div className={"CheckCell " + (checkItem.checked ? 'CheckedCell': "")}>&nbsp;</div>
                </td>) }
            </tr>
        </>
    );
}
