// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(req.method === "GET"))
    return res.status(400).json({ message: "unauthorized" });

  const id = Number(req.query.id);
  if (!id || typeof id != "number")
    return res.status(400).json({ message: "invalid argument" });

  res.status(200).json(nfts.get(id));
}

const nfts = new Map([
  [
    1,
    {
      id: 1,
      name: "Mr. Crypto #1",
      description: "The official RACKS® NFT collection",
      image:
        "https://apinft.racksmafia.com/images/f7570d58ba8cb4d1b4ed9fe792160e866e55b3ca86e040da2b12595743babc4e.png",
      price: 0.12,
      collection: "Mr.Crypto",
    },
  ],
  [
    2,
    {
      id: 2,
      name: "Mr. Crypto #2",
      description: "The official RACKS® NFT collection",
      image:
        "https://apinft.racksmafia.com/images/da59c0f6b08bdd931b3a40fdb6eb43c8198ebc87f811b7960d81dbe58373b5b6.png",
      price: 0,
      collection: "Mr.Crypto",
    },
  ],
  [
    3,
    {
      id: 3,
      name: "Mr. Crypto #3",
      description: "The official RACKS® NFT collection",
      image:
        "https://apinft.racksmafia.com/images/cff1a46c6a56fd2ca4da984a2d5995cc40c850c18c1526c381d54174d8d1e0b6.png",
      price: 0.09,
      collection: "Mr.Crypto",
    },
  ],
  [
    4,
    {
      id: 4,
      name: "Mr. Crypto #4",
      description: "The official RACKS® NFT collection",
      image:
        "https://apinft.racksmafia.com/images/3f4510d80c66c82e1b614f207b6e3ea1fd3b1a58fdd2c3e2876b1439349d74d9.png",
      price: 0,
      collection: "Mr.Crypto",
    },
  ],
  [
    5,
    {
      id: 5,
      name: "Mr. Crypto #5",
      description: "The official RACKS® NFT collection",
      image:
        "https://apinft.racksmafia.com/images/68d9c95cdcab48bbc40009494818d37db733e634e20d772f0486b05814baa83a.png",
      price: 0.136,
      collection: "Mr.Crypto",
    },
  ],
]);
