import MainLayout from '@/components/layouts/MainLayout';
import React, { FC, useState, ChangeEvent } from 'react';
import Modal from "react-modal";
import { NextPage } from 'next';
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { Collection, NFTData } from '@/types';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent",
  },
};

const collectionPage: NextPage<{
  collection: Collection;
  isEditable: boolean;
  collectionNfts: NFTData[];
}> = ({ isEditable, collection, collectionNfts }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <MainLayout> 
      <section>
        <div
          style={{
            backgroundImage: `url(${collection.bgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="h-[300px] w-full relative overflow-visible bg-cover bg-center"
        >
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-50px] w-[100px] h-[100px] bg-contain rounded-full"
              style={{
                backgroundImage: `url(${collection.profileImage})`,
              }}
            >
          </div>
        </div>
          <div className="flex flex-col items-center mt-[75px] text-center">
            <h1 className="mt-5 text-5xl mb-5">{collection.name}</h1>
            <p>Collection address: {collection.address}</p>
              <p>Floor price: {collection.floorPrice} ETH</p>
            <a href={collection.website} target="blank">Website</a>
            {isEditable && (
              <CustomButton onClick={() => setModalOpen(!modalOpen)}>
                Edit collection
              </CustomButton>
            )}
            <CustomButton onClick={() => setModalOpen(!modalOpen)}>
                "Edit collection" testing
              </CustomButton>
          </div>
      </section>
      <div className="divider mt-[14vh]"></div>
      <section className=" mx-10 flex items-center justify-center gap-5 flex-wrap mt-10">
        {collectionNfts.map((nft, index) => (
          <NftCard
            key={index}
            id={Number(nft.id.tokenId)}
            imgUrl={nft.media[0].gateway}
            className="w-[20vw] min-w-[150px] max-w-[300px]"
          />
        ))}
      </section>
      <Modal
        isOpen={modalOpen}
        style={customStyles}
        onRequestClose={() => setModalOpen(!modalOpen)}
      >
        <EditCollectionForm closeModal={setModalOpen} />
      </Modal>
    </MainLayout>
  );
};

export default collectionPage

import { GetServerSideProps } from "next";
import { withSessionSsr } from "@/utils/ironSession";
import axios from "axios";
import CustomButton from '@/components/CustomButton';
import NftCard from '@/components/NftCard';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (ctx) => {
    const prisma = new PrismaClient();
    const collectionAddress = ctx.query.collection;
    const collectionData = await prisma.collection.findUnique({
      where: {
        address: (collectionAddress as string) || "",
      },
    });
    if(!collectionData) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    
    const { data } = await axios.get(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getNFTsForCollection?contractAddress=${collectionData.address}&withMetadata=true`
    );
    
    return {
      props: {
        collection: collectionData,
        isEditable: ctx.req.session.user?.address.toLowerCase() == collectionData.owner.toLowerCase(),
        collectionNfts: data.nfts,
      },
    };
  }
);

interface Props {
  closeModal: (newState: boolean) => void;
}

const EditCollectionForm: FC<Props> = ({ closeModal }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: router.query.collection,
    name: "",
    profileImage: "",
    bgImage: "",
    website: "",
  });

  const updateForm = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const updateCollection = await fetch("/api/collection/editCollection", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      closeModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-w-[80%] w-[700px] max-h-[90vh] overflow-y-scroll bg-primary m-auto my-5 rounded-md p-5">
      <p className="text-2xl">Edit collection info</p>
      <form className="max-w-[80%] m-auto my-5">
        <div className="flex flex-col">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Name"
            value={formData.name}
          ></input>
        </div>
        <div className="flex flex-col">
          <label>Profile image</label>
          <input
            name="profileImage"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Profile image"
            value={formData.profileImage}
          ></input>
        </div>
        <div className="flex flex-col">
          <label>Background image</label>
          <input
            name="bgImage"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Background image"
            value={formData.bgImage}
          ></input>
        </div>
        <div className="flex flex-col">
          <label>Website URL</label>
          <input
            name="website"
            type="text"
            onChange={(e) => updateForm(e)}
            className="input input-primary mb-5"
            placeholder="Website URL"
            value={formData.website}
          ></input>
        </div>
        <CustomButton onClick={handleSubmit}>
          Actualizar
        </CustomButton>
      </form>
    </section>
  );
};