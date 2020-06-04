import React from 'react';
import './StatTable.css';


export function StatTable(props) {
    const { children: [header, ...rows] } = props;
    return (
        <table>
            <thead>
                {header}
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}


export function StatTableHeader(props) {
    const { children } = props;
    return (
        <tr>
            <th>&nbsp;</th>
            {children}
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
                {children}
            </tr>
        </>
    );
}


export function StatTableRowCell(props) {
    const { itemId, checkItem, editingMode, highlight, addEntriesToAdditionDraft, addEntriesToDeletionDraft } = props;
    const handleClick = e => {
        if (editingMode) {
            if (e.target.dataset.checked === "false") {
                addEntriesToAdditionDraft(itemId, e.target.dataset.date)
            } else {
                addEntriesToDeletionDraft(itemId, e.target.dataset.date)
            }
        }
    }
    let checkedClass = "";
    if (checkItem.added)
        checkedClass = " CellToAdd";
    else if (checkItem.removed)
        checkedClass = " CellToRemove";
    else if (checkItem.checked)
        checkedClass = " CheckedCell";
    return (
        <td className={ highlight ? 'TodayHighlight' : null }>
            <div
                className={
                    "CheckCell" + checkedClass
                    + (editingMode ? " EditableCell" : "")
                }
                data-date={checkItem.date}
                data-checked={checkItem.checked}
                onClick={handleClick}>&nbsp;</div>
        </td>
    );
}