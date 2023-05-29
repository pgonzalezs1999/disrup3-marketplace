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
  const {nftAddress, tokenId, timestamp, listingId} = req.body

  try {
   // checkear que exista el buyer, checkear que exista la coleccion, y el nft 
   const nft = await prisma.nft.findUnique({where: {nftAddress_tokenId: {
    nftAddress,
    tokenId
   }}})

   
    if(!await prisma.listing.findUnique({where: {
      nftAddress_tokenId_listingId: {
        listingId,
        nftAddress, 
        tokenId
      }
    }})) return res.status(400).json({message: "listing does not exist"})

    // cambiar estado del listing
    await prisma.listing.update({
      where: {
        listingId: listingId
      },
      data: {
        isActive: false
      }
    })

    await prisma.sale.create({
        data: {
            nftId: nft?.id,
            ...req.body
        }
    })
    
    return res.status(200).json({message: "ok"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "algo fue mal"})

  }

}
