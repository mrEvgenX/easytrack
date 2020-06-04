import React from 'react';
import './StatTable.css';


export function StatTable(props) {
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


export function StatTableHeader(props) {
    const { children } = props;
    return (
        <tr>
            <th>&nbsp;</th>
            { children }
        </tr>
    );
}


export function StatTableHeaderCell(props) {
    const { date, highlight } = props;
    return (
        <th style={{ backgroundColor: highlight ? 'yellow' : null }} key={date}>{date}</th>
    );
}

export function StatTableRow(props) {
    const { itemName, children } = props;
    return (
        <>
            <tr>
                <td>{itemName}</td>
                { children }
            </tr>
        </>
    );
}


export function StatTableRowCell(props) {
    const { itemId, itemName, checkItem, editingMode } = props;
    const handleClick = e => {
        if (editingMode && e.target.dataset.checked === "false") {
            console.log('click', itemId, itemName, e.target.dataset.date);
        }
    }
    return (
        <td>
            <div
                className={
                    "CheckCell" 
                    + (checkItem.checked ? " CheckedCell" : "")
                    + (editingMode ? " EditableCell" : "")
                }
                data-date={checkItem.date}
                data-checked={checkItem.checked}
                onClick={handleClick}>&nbsp;</div>
        </td>
    );
}