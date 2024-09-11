import { request } from "../request"

export const fetchMagicEdenCollections = async () => {
    let response = await request.get('https://api-mainnet.magiceden.dev/v2/collections');
    return response;
}

//working
export const fetchMarketPlace = async () => {
    let response = await request.get('https://blinks.ytechno.com.ng/api/get-marketplace');
    return response;
}

//working
export const fetchListings = async () => {
    let response = await request.get('https://blinks.ytechno.com.ng/api/get-listings');
    return response;
}

//working
export const fetchUserListings = async (userAddresss: string) => {
    let response = await request.get(`https://blinks.ytechno.com.ng/api/get-user-listings/${userAddresss}`);
    return response;
}


export const getListedItem = async (nft_mint: string) => {
    let response = await request.get(`https://blinks.ytechno.com.ng/api/get-listed-item/${nft_mint}`)
    return response;
}

export const checkListedItem = async (nft_mint: string, owner: string) => {
    let response = await request.get(`https://blinks.ytechno.com.ng/api/check-listed-item/${nft_mint}/${owner}`)
    return response;
}

export const listUserItem = async (price: string, owner: string, asset: string) => {
    let bodyContent = new FormData();
    bodyContent.append("asset_mint", asset);
    bodyContent.append("fee", price.toString());
    bodyContent.append("owner", owner);

    let response = await request.post({ url: 'https://blinks.ytechno.com.ng/api/list-new-item', data: bodyContent })
    return response;
}


export const unlistItem = async (mint: string) => {
    let response = await request.get(`https://blinks.ytechno.com.ng/api/unlist/${mint}`)
    return response;
}


export const updatePurchase = async (tx_hash: string, owner: string, asset_mint: string, id: string) => {
    let bodyContent = new FormData();
    bodyContent.append("asset_mint", asset_mint);
    bodyContent.append("tx_hash", tx_hash);
    bodyContent.append("owner", owner);

    let response = await request.post({ url: `https://blinks.ytechno.com.ng/api/update-transaction/${id}`, data: bodyContent })
    return response;
}