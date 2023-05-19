import React, { FC } from 'react';

interface Props {
  id?: number;
  name?: string;
  imgUrl?: string;
}

const NftCard: FC<Props> = ({ id, name, imgUrl }) => {

  return (
    /*<button onClick={goBack} className={`w-[30px] mr-4 ${className}`}>
      <img src="/back-arrow.png" alt="Click to go to previous page"/>
    </button>*/
    <div className="card shadow-xl">
    <img
      className="w-[100%] rounded-t-lg"
      src={imgUrl || "https://i.seadn.io/gae/4NlKTvXyJuJNs5kUaHIGiaPdMTxIRI4ewh8tx72XMgCrDBZ91V8v75j6EAS9xBUCCf2XQxJ8AmxrsCHnqGqVIN1g4JgzWoMwX6qf9A"}
      alt="NFT image"/>
    <div className="card-body">
      <p className="">#{id}</p>
      <p className="">{name}</p>
    </div>                
</div>
  );
};

export default NftCard;