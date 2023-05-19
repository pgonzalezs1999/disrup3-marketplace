import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import Link from "next/link";
import { Collection } from '@/types';

type PageProps = {    
    collections: Collection[];
    user: {
        address: string,
        userName: string,
    };
}

const explore: NextPage<PageProps> = (ctx) => {
const { collections, user } = ctx;
  return (
    <MainLayout>
        <div className="m-5">
            <h2 className='text-4xl font-bold text-primary text-center mb-2'>Explore the best NFT collections</h2>
            <p className='text-center text-xl opacity-80'>Browse between listed collections in our marketplace</p>
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
  );
};

export default explore

import { GetServerSideProps, NextPage } from 'next';
import { PrismaClient } from "@prisma/client";
import { withSessionSsr } from '@/utils/ironSession';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async (ctx) => {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: {
              address: (ctx.query.user as string) || "",
            },
        });
        const collectionsData = await prisma.collection.findMany();
        return {
            props: {
                collections: collectionsData,
                user: user,
            },
        };
    }
);