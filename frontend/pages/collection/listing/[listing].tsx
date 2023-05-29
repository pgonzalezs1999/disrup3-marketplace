import MainLayout from "@/components/layouts/MainLayout";
import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

type listing = {
  name: string;
  description: string;
  image: string;
  price: number;
  collection: string;
};

type PageProps = {
  listing: listing;
};

const listingPage: NextPage<PageProps> = (ctx) => {
  const { listing } = ctx;
  const router = useRouter();

  return (
    <MainLayout>
      <div className="m-5">
        <h2 className="text-4xl font-bold text-primary text-center mb-2">
          {listing.name}
        </h2>
      </div>

      <div className="flex flex-col justify-center items-center listing-container">
        <div className="card w-[20%] bg-base bg-opacity-10 shadow-xl">
          <img className="" src={listing.image} alt="mrcryptoBase" />

          <div className="card-body nft-card-color">
            <h3 className="text-accent">{listing.name}</h3>
            <p className="text-base opacity-80">{listing.description}</p>
            {listing && listing.price > 0 ? (
              <>
                <p className=" opacity-80">
                  Price:
                  <span className="text-primary ml-2">{listing.price} ETH</span>
                </p>
                <button className="btn btn-secondary w-[80px] h-[10px] mx-auto mt-2">
                  BUY
                </button>
              </>
            ) : (
              <>
                <p className=" opacity-80">
                  <span className="text-primary">NFT NOT LISTED</span>
                </p>
              </>
            )}
          </div>
        </div>
        <button className="mt-10 btn btn-accent" onClick={() => router.back()}>
          See more of {listing.collection}
        </button>
      </div>
    </MainLayout>
  );
};

export default listingPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.listing;

  const listing = await (
    await fetch("http://localhost:3000/api/collection/getNft?id=" + Number(id))
  ).json();
  console.log(listing);
  return {
    props: {
      listing,
    },
  };
};
