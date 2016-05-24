import React from 'react';

const BoxLoader = (props) => {
    return (
        <div className={'loader ' + props.animation}>
            <div className="BoxLoading" />
            <p>{props.message}</p>
        </div>
    );
};

export default BoxLoader;
