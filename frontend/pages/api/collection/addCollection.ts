import { withSessionRoute } from "@/utils/ironSession";
import { PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from  "next"

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch(req.method) {
        case "PATCH":
        const userAddress = req.session.user?.address;
        const { formData } = req.body;
         // comprobamos que el usuario esta autenticado 
         if(!userAddress) {
            return res.status(400).json({
                message: "No estas autorizado"
            })
         }
  
         const newCollectionData = await prisma.collection.create({
            data: {
                address: formData.address,
                name: formData.name,
                owner: userAddress,
            }
         })
         return res.status(200).json({
            collection: newCollectionData,
            message: "collection updated"
        })
        default: 
            return res.status(400).json({
                message: "ONLY METHOD PATCH ALLOWED"
            })
    }
}

export default withSessionRoute(handler);