import { useState } from "react";
import CustomInput from "./customInput/customInput";
import useCanvasWallet from "./CanvasWalletAdapter";

// import { listUserItem } from "../requestsHandler/requestsItems";
import { delegate, mplBubblegum, transfer } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Helius } from "helius-sdk";
import { createNoopSigner, createSignerFromKeypair, publicKey, publicKeyBytes, signerIdentity, } from "@metaplex-foundation/umi";
import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';
import { RPC } from "../requestsHandler";
import { mplToolbox, } from "@metaplex-foundation/mpl-toolbox";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { checkListedItem, listUserItem } from "../requestsHandler/requestsItems";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


const helius = new Helius(import.meta.env.VITE_REACT_HELIUS_API);

export default function NftDetails({ setShowItem, nft, buy, marketData }: any) {
  const [showInputs, setShowInputs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState('');

  const wallet = useCanvasWallet()

  const umi = createUmi(RPC).use(mplBubblegum())
  umi.use(mplCore())
  umi.use(mplToolbox())
  // // Generate a new keypair signer.
  const signer = createNoopSigner(publicKey(wallet.walletAddress));
  // // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))

  const listItem = async () => {
    setLoading(true);
    const rpcAsset: any = await helius.rpc.getAsset({ id: nft.mint })
    const rpcAssetProof: any = await helius.rpc.getAssetProof({ id: nft.mint })

    if (fee == "") {
      console.log('Fee empty');
      setLoading(false);
      setShowItem(false)
      return;
    }


    //check if listed at this point and then do not allow listing
    let response = await checkListedItem(nft.mint, wallet.walletAddress)
    if (response?.data?.status == "success") {
      console.log('NFT already listed');
      setLoading(false);
      setShowItem(false)
      return;
    }

    try {
      let umiInstruction = await delegate(umi, {
        leafOwner: signer,
        previousLeafDelegate: signer.publicKey,
        newLeafDelegate: publicKey('CRpqwicZAaK5UsvgPFHPqYpJk39XbYAVkc2edkHAWPK1'),
        merkleTree: rpcAssetProof.tree_id,
        root: publicKeyBytes(rpcAssetProof.root),
        dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
        creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
        nonce: rpcAsset.compression.leaf_id,
        index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
        proof: rpcAssetProof.proof,
      })
        // .add(addMemo(umi, { memo: `You are currently Listing this ${nft?.name} to D-groov market place` }))
        .getInstructions();

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
        const response = await listUserItem(fee, signer.publicKey, nft.mint);
        if (response) {
          console.log('NFT successfully listed:', response);
          setLoading(false);
          setShowInputs(false);
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

  const buyItemTransaction = async () => {
    setLoading(true);
    const rpcAsset: any = await helius.rpc.getAsset({ id: nft.mint })
    const rpcAssetProof: any = await helius.rpc.getAssetProof({ id: nft.mint })

    try {

      const transferTx = new Transaction()

      let tradersFee = Number(marketData.fee) / 0.95;
      let myFees = Number(marketData.fee) * 0.005;
      transferTx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.walletAddress),
          toPubkey: new PublicKey(marketData.owner),
          lamports: BigInt(Math.floor(tradersFee * LAMPORTS_PER_SOL)),
        })
      )

      transferTx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.walletAddress),
          toPubkey: new PublicKey("CRpqwicZAaK5UsvgPFHPqYpJk39XbYAVkc2edkHAWPK1"),
          lamports: BigInt(Math.floor(myFees * LAMPORTS_PER_SOL)),
        })
      )

      // umiInstruction.map((trans) => tx.add(trans));
      let txHash = await wallet.signMainTransaction(transferTx);


      if (txHash) {

        const private_key: [] = JSON.parse(import.meta.env.VITE_REACT_VERIFY)

        let arr = Uint8Array.from(private_key.splice(0, 32));
        const signerKey = Keypair.fromSeed(arr);

        const newumi = createUmi(RPC).use(mplBubblegum())

        newumi.use(mplCore())
        newumi.use(mplToolbox())
        const myKeypair = newumi.eddsa.createKeypairFromSecretKey(signerKey.secretKey);
        // umi.use(walletAdapterIdentity(wallet))
        // // Generate a new keypair signer.
        const signer = createSignerFromKeypair(newumi, myKeypair);

        // // Tell Umi to use the new signer.
        newumi.use(signerIdentity(signer))

        let umiInstruction = await transfer(newumi, {
          merkleTree: rpcAssetProof.tree_id,
          root: publicKeyBytes(rpcAssetProof.root),
          dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
          creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
          nonce: rpcAsset.compression.leaf_id,
          index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
          proof: rpcAssetProof.proof,
          leafOwner: publicKey(marketData.owner),
          leafDelegate: publicKey('CRpqwicZAaK5UsvgPFHPqYpJk39XbYAVkc2edkHAWPK1'),
          newLeafOwner: publicKey(wallet.walletAddress),
        }).sendAndConfirm(newumi);

        if (umiInstruction.result) {
          console.log('NFT successfully listed:');
          setLoading(false);
          setShowInputs(false);
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

          {showInputs &&
            <div className="">

              <CustomInput type="number"
                className="mb-3"
                name="fee"
                label="Fee for Transactions"
                placeholder="enter transaction fee"
                onChange={(e: any) => setFee(e.target.value)}
              />


            </div>
          }
          {buy ?
            <button disabled={loading} onClick={() => buyItemTransaction()} className="p-3 rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
              {loading ? "Loading..." : <>
                Buy {marketData?.fee}
              </>
              }
            </button>
            :
            <button disabled={loading} onClick={() => showInputs ? listItem() : setShowInputs(true)
            } className="p-3 rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
              {loading ? "Loading..." : <>
                {showInputs ? "Proceed" : "List Item"}
              </>
              }
            </button>

          }
        </div>
      </div>



    </section>
  );
}
