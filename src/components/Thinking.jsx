import React from 'react';

const Thinking = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
            </div>
        </div>
    );
};

export default Thinking;
