import React, { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
    to?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

const CustomButton = ({ to, onClick, children }: Props) => {
    if(to) {
        return (
            <Link href={to}>
                <button className="btn btn-accent mr-3 px-6" onClick={onClick}>
                    {children}
                </button>
            </Link>
        );
    } else if(onClick) {
        return (
            <button className="btn btn-secondary mr-3 px-6" onClick={onClick}>
                {children}
            </button>
        );
    } else {
        return (
            <button className="btn btn-disabled mr-3 px-6 pointer-events-none">
                {children}
            </button>
        );
    }
};

export default CustomButton;