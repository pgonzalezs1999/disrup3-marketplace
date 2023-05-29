import MainLayout from "@/components/layouts/MainLayout";
import React from "react";
import Link from "next/link";
import contractData from "../constants/constant.json";
import { Collection } from '@/types';

type PageProps = {
  collections: Collection[];
  listings: Listing[];
};

const explore: NextPage<PageProps> = (ctx) => {
  const { collections, listings } = ctx;
  const { nftAddress, tokenId } = listings[0] ?? "";
  const { config } = usePrepareContractWrite({
    address: contractData[31337].address as `0x${string}`,
    abi: contractData[31337].abi as any,
    functionName: "buyItem",
    args: [nftAddress, tokenId],
    overrides: {
      value: ethers.utils.parseEther("0.001"),
    },
  });
  const { write } = useContractWrite(config);

  return (
    <MainLayout>
      <div className="m-5">
        <h2 className="text-4xl font-bold text-primary text-center mb-2">
          Explora las mejores colecciones NFT
        </h2>
        <p className="text-center text-xl opacity-80">
          Browse between the collections listed in our marketplace
        </p>
      </div>
      <div className="flex flex-wrap gap-5 m-auto w-[80%] justify-center mt-14 mb-10 explore-container">
        {collections.map((collection, key) => (
          <Link href={`/collection/${collection.address}`}>
            <div
              key={key}
              className="card w-[150px] md:w-[240px] bg-base shadow-xl cursor-pointer hover:scale-105 transition-all ease-linear"
            >
              <figure>
                <img src={collection.profileImage} alt="Shoes" />
              </figure>
              <div className="card-body nft-card-color">
                <h3 className="text-accent">{collection.name}</h3>
                <p className="text-base opacity-80">{collection.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="divider"></div>

      <div>
        <h2 className="text-accent text-4xl text-center">
          Ultimos Items listados en el marketplace
        </h2>
        <div className="flex flex-wrap gap-5 m-auto w-[80%] justify-center mt-14 mb-10 explore-container">
          {listings.map((listing) => (
            <div className="card w-[150px] md:w-[240px] bg-base shadow-xl cursor-pointer hover:scale-105 transition-all ease-linear">
              <p>{shortenAddress(listing.nftAddress)}</p>
              <p>{shortenAddress(listing.seller)}</p>
              <p>{listing.tokenId}</p>
              <p>{Number(listing.price)}</p>
              <p onClick={() => write?.()}>Comprar NFT</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default explore;

import { GetServerSideProps, NextPage } from "next";
import { Listing, PrismaClient } from "@prisma/client";
import { shortenAddress } from "@/utils/address";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { ethers, utils } from "ethers";
const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const collections = await prisma.collection.findMany({ take: 10 });
  const listings = await prisma.listing.findMany({ take: 10 });
  return {
    props: {
      collections,
      listings,
    },
  };
};