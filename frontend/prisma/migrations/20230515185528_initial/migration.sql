-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "description" TEXT NOT NULL DEFAULT 'soy un usuario nuevo jaja ',
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png?auto=format&dpr=1&w=1000',
    "bannerImage" TEXT NOT NULL DEFAULT 'https://i.ytimg.com/vi/Lav15rWDXUk/maxresdefault.jpg'
);

-- CreateTable
CREATE TABLE "Collection" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL DEFAULT 'OWNER',
    "bgImage" TEXT NOT NULL DEFAULT 'USER',
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png?auto=format&dpr=1&w=1000',
    "links" TEXT NOT NULL DEFAULT 'Aqui estaran los links a rrss'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
