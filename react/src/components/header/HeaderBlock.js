import React from 'react';


export default function HeaderBlock(props) {
    const { children } = props;
    return (
        <>
            <h1>Easy Track</h1>
            { children }
            <hr/>
        </>
    );
}
