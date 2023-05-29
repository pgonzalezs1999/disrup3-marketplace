// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(!(req.method === "POST")) return res.status(400).json({message: "unauthorized"})

  // EJECUTAR LOGICA DE PERSISTIR UN LISTING 
  const {nftAddress, seller, tokenId, timestamp, listingId} = req.body

  // si no existe nft crearlo en bd, si no existe el usuario crearlo 

  try {

    await checkUserExistAndCreate(seller);
    const nftid = await checkNftExistAndCreate(nftAddress, tokenId);    
    await checkCollectionExistAndCreate(nftAddress);     

    if(await prisma.listing.findUnique({where: {
      nftAddress_tokenId_listingId: {
        nftAddress,
        tokenId,
        listingId
      }
    }})) return res.status(400).json({message: "item already listed"})

    await prisma.listing.create({
        data: {            
          isActive: true,
          nftId: nftid,
          ...req.body
          
        }
    })

    return res.status(200).json({message: "ok"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: JSON.stringify(error)})

  }

}

const checkUserExistAndCreate = async (useAddress: string) => {
  if(! await prisma.user.findUnique({where: {address: useAddress}})) {
    await prisma.user.create({
        data: {
            address: useAddress
        }
    })
  }
}

const checkNftExistAndCreate = async (nftAddress: string, tokenId: number) => {
  const nft = await prisma.nft.findUnique({where: {nftAddress_tokenId: {nftAddress, tokenId}}});

  if(!nft) {
    const {id} = await prisma.nft.create({
        data: {
            nftAddress,
            tokenId
        }
    })

    return id;
  }

  return nft.id
}

const checkCollectionExistAndCreate = async (nftAddress: string) => {
  if(! await prisma.collection.findUnique({where: {address: nftAddress}})) {
    await prisma.collection.create({
        data: {
            address: nftAddress
        }
    })
}
}