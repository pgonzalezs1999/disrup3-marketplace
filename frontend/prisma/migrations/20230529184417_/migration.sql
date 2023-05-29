-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "description" TEXT NOT NULL DEFAULT 'soy un usuario nuevo jaja ',
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png?auto=format&dpr=1&w=1000',
    "bannerImage" TEXT NOT NULL DEFAULT 'https://i.ytimg.com/vi/Lav15rWDXUk/maxresdefault.jpg'
);

-- CreateTable
CREATE TABLE "Collection" (
    "owner" TEXT,
    "address" TEXT NOT NULL PRIMARY KEY,
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png'
);

-- CreateTable
CREATE TABLE "Nft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nftAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "chainId" TEXT
);

-- CreateTable
CREATE TABLE "Listing" (
    "nftAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "paytoken" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "seller" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "listingId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "nftId" INTEGER NOT NULL,

    PRIMARY KEY ("nftAddress", "tokenId", "listingId"),
    CONSTRAINT "Listing_nftAddress_fkey" FOREIGN KEY ("nftAddress") REFERENCES "Collection" ("address") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_seller_fkey" FOREIGN KEY ("seller") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sale" (
    "nftAddress" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "paytoken" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "buyer" TEXT NOT NULL,
    "listingId" INTEGER NOT NULL,
    "nftId" INTEGER NOT NULL,
    "userAddress" TEXT,

    PRIMARY KEY ("nftAddress", "tokenId", "timestamp"),
    CONSTRAINT "Sale_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sale_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE INDEX "Nft_nftAddress_tokenId_idx" ON "Nft"("nftAddress", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Nft_nftAddress_tokenId_key" ON "Nft"("nftAddress", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_listingId_key" ON "Listing"("listingId");
