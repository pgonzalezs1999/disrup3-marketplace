import "iron-session";
import { SiweMessage } from 'siwe';

declare module "iron-session" {
    interface IronSessionData {
        nonce?: string;
        siwe?: SiweMessage;
        user?: {
            address: string;
            role: string;
        }
    }
}

interface Collection {
    address: string,
    name: string,
    desc: string,
    profileImage: string,
    bgImage: string,
    floorPrice: number,
    website: string,
};

interface NFTData {
    title: string;
    id: {
        tokenId: number;
    }
    media: media[];
};

interface media {
    gateway: string;
};