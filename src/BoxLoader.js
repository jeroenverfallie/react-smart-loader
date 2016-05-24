import React from 'react';

const BoxLoader = (props) => {
    return (
        <div className={'box-loader ' + props.animation}>
            <div className="box" />
            <p>{props.message}</p>
        </div>
    );
};

export default BoxLoader;
