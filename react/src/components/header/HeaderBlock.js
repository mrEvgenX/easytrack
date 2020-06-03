import React from 'react';
import './HeaderBlock.css';


export default function HeaderBlock(props) {
    const { children } = props;
    return (
        <div className="HeaderBlock">
            <h1>Easy Track</h1>
            { children }
        </div>
    );
}
