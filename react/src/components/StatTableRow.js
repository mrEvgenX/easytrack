import React from 'react';


export default function StatTableRow(props) {
    const { name, checks } = props;
    return (
        <>
            <tr>
                <td>{ name }</td>
                { checks.map(checkItem => <td key={ checkItem.date }>{ checkItem.checked ? 'v': '-' }</td>) }
            </tr>
        </>
    );
}
