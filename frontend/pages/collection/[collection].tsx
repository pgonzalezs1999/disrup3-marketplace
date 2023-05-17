import MainLayout from '@/components/layouts/MainLayout';
import React, { FC, useState, ChangeEvent } from 'react';
import Modal from "react-modal";
import { NextPage } from 'next';
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

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

type NFTData = {
  id: string;
  tokenId: string;
  media: media[];
};

type media = {
  gateway: string;
};

type Collection = {
  address: string,
  name: string,
  desc: string,
  profileImage: string,
  bgImage: string,
  floorPrice: number,
  website: string,
}

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
            <div className="flex gap-3">
              <p>Items: 0</p>
              <p>Unique owners: 0</p>
              <p>Floor price: {collection.floorPrice} ETH</p>
            </div>
            <a href={collection.website} target="blank">Website</a>
            {isEditable && (
              <button
              onClick={() => setModalOpen(!modalOpen)}
              className="bg-primary m-5 p-3 border-2 border-secondary rounded-xl"
            >
              Edit collection
            </button>
            )}
          </div>
      </section>
      <div className="divider mt-[14vh]"></div>
      <section className=" mx-10 flex items-center justify-center gap-5 flex-wrap mt-10">
        {collectionNfts.map((nft, index) => (
          <div key={index} className="card w-[250px] bg-base-100 shadow-xl">
            <figure>
              <img
                src={nft.media[0].gateway}
                alt={`imagen del nft ${nft.tokenId}`}
              />
            </figure>
            <div className="card-body">
              <p>#{nft.tokenId}</p>
            </div>
          </div>
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

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (ctx) => {
    const prisma = new PrismaClient();
    const collectionAddress = ctx.query.collection;
    console.log("ctx.query =", ctx.query);
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
        isEditable: ctx.req.session.user?.address == collectionData.owner,
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
    console.log(formData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const updateCollection= await fetch("/api/collection/editCollection", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      console.log(updateCollection);
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
        <button onClick={handleSubmit}>Actualizar</button>
      </form>
    </section>
  );
};