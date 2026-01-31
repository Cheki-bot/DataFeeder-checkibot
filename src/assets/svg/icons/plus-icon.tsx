import React from 'react';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
    >
        <path
            stroke={props.stroke || '#242424'}
            strokeLinecap="round"
            strokeWidth={2}
            d="M12 6v12m6-6H6"
        />
    </svg>
);

export default PlusIcon;
