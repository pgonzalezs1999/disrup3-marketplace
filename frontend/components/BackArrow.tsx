import React, { FC } from 'react';
import { useRouter } from 'next/router';

interface Props {
  className?: string;
}

const BackArrow: FC<Props> = ({ className }) => {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <button onClick={goBack} className={`w-[30px] mr-4 ${className}`}>
      <img src="/back-arrow.png" alt="Click to go to previous page"/>
    </button>
  );
};

export default BackArrow;