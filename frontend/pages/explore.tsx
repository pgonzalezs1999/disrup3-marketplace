import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import Link from "next/link";

type PageProps = {    
    collections: {
        address: string,
        name: string,
        desc: string,
        profileImage: string,
        floorPrice: number
    }[];
}

const explore: NextPage<PageProps> = (ctx) => {
const { collections } = ctx;

  return (
    <MainLayout>
        <div className="m-5">
            <h2 className='text-4xl font-bold text-primary text-center mb-2'>Explora las mejores colecciones NFT</h2>
            <p className='text-center text-xl opacity-80'>Browse between the collections listed in our marketplace</p>
        </div>
        <div className="m-5 flex gap-3 items-center justify-center">
            <p className="">Missing your collection?</p>
            <Link href="/addCollection" className="btn btn-accent">Import it now</Link>
        </div>

        <div className='flex flex-wrap gap-5 m-auto w-[80%] justify-center mt-14 mb-10'>
            {collections.map(collection => (
                <Link
                    key={collection.name}
                    href={`/collection/${collection.address}`}
                    className='card w-[150px] md:w-[240px] bg-base shadow-xl cursor-pointer hover:scale-105 transition-all ease-linear'
                >
                    <figure>
                        <img src={collection.profileImage} alt="Collection profile picture"/>
                    </figure>
                    <div className='card-body'>
                        <h3 className='text-accent'>{collection.name}</h3>
                        <p className='text-base opacity-80'>{collection.desc}</p>
                        <p className='opacity-80'>Floor price: <span className='text-primary'>{collection.floorPrice} ETH</span></p>
                    </div>
                </Link>
            ))}
        </div>
    </MainLayout>
  )
}

export default explore

import { GetServerSideProps, NextPage } from 'next';
import { PrismaClient } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const prisma = new PrismaClient();
    
    const collectionsData = await prisma.collection.findMany();
    return {
        props: {
        collections: collectionsData,
        },
    };
}