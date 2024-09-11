import { useState } from "react";
import useCanvasWallet from "./CanvasWalletAdapter";

// import { listUserItem } from "../requestsHandler/requestsItems";
import { delegate, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Helius } from "helius-sdk";
import { createNoopSigner, publicKey, publicKeyBytes, signerIdentity, } from "@metaplex-foundation/umi";

import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';
import { RPC } from "../requestsHandler";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { unlistItem } from "../requestsHandler/requestsItems";


const helius = new Helius(import.meta.env.VITE_REACT_HELIUS_API);

export default function UnlistNFT({ setShowItem, nft, }: any) {
  const [loading, setLoading] = useState(false);

  const wallet = useCanvasWallet()

  const umi = createUmi(RPC).use(mplBubblegum())

  umi.use(mplCore())
  umi.use(mplToolbox())
  // umi.use(walletAdapterIdentity(wallet))
  // // Generate a new keypair signer.
  const signer = createNoopSigner(publicKey(wallet.walletAddress));

  // // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))


  const unlistItemFrom = async () => {
    setLoading(true);
    console.log(nft.mint)
    const rpcAsset: any = await helius.rpc.getAsset({ id: nft.mint })
    const rpcAssetProof: any = await helius.rpc.getAssetProof({ id: nft.mint })

    try {
      let umiInstruction = await delegate(umi, {
        leafOwner: signer,
        previousLeafDelegate: publicKey('CRpqwicZAaK5UsvgPFHPqYpJk39XbYAVkc2edkHAWPK1'),
        newLeafDelegate: signer.publicKey,
        merkleTree: rpcAssetProof.tree_id,
        root: publicKeyBytes(rpcAssetProof.root),
        dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
        creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
        nonce: rpcAsset.compression.leaf_id,
        index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
        proof: rpcAssetProof.proof,
      }).getInstructions();

      const transaction = umi.transactions.create({
        version: 0,
        blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
        instructions: umiInstruction,
        payer: signer.publicKey,
      })

      let webTransaction = toWeb3JsTransaction(transaction)
      // umiInstruction.map((trans) => tx.add(trans));
      let txHash = await wallet.signTransaction(webTransaction)


      if (txHash) {
        const response = await unlistItem(nft.mint);
        if (response) {
          console.log('NFT successfully UnListed:', response);
          setLoading(false);
          setShowItem(false)
          wallet.makeRefetch()
        }
      } else {
        console.log('Failed to sign transaction')
        setLoading(false);
      }



    } catch (e: any) {
      console.log(e)
      setLoading(false);
    }


  }



  return (
    <section className="flex flex-row gap-x-8">
      <div>

        <div className="w-[300px] overflow-hidden h-[300px] rounded-xl" style={{ objectFit: 'cover' }}>
          <img className="w-[100%] h-[100%]" src={nft?.image_uri} style={{ objectFit: 'cover' }} alt="nft1-icon" />
        </div>


      </div>
      <div>
        <div className="w-[100%] p-2 py-3 flex flex-row justify-between">
          <p className="text-[#fdefd8] text-[20px] font-bold">{nft?.name}</p>
        </div>

        <p className="text-[20px]">Attributes</p>
        {nft?.attributes_array?.length && nft?.attributes_array?.map((attr: any, index: number) => {
          return (
            <div key={index} className="p-2 w-[100%] flex justify-between items-center uppercase">
              <p>{attr?.trait_type}: {attr?.value}</p>
            </div>
          )
        })}

        <div className="w-[100%] flex flex-col items-start">

          <button disabled={loading} onClick={() => unlistItemFrom()} className="p-3 rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
            {loading ? "Loading..." :
              "Unlist Item"
            }
          </button>
        </div>
      </div>



    </section>
  );
}
