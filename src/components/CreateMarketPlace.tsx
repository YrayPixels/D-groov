import { ShyftSdk } from "@shyft-to/js";
import useCanvasWallet from "./CanvasWalletAdapter";
import CustomInput from "./customInput/customInput";
import { useState } from "react";
export default function CreateMarketPlace({ setShowMarketPlace, shyft }: { setShowMarketPlace: (_: boolean) => void, shyft: ShyftSdk }) {

    const wallet = useCanvasWallet();
    const [fee, setFee] = useState('')


    const createMarketPlace = async () => {

        const { encoded_transaction, address } = await shyft?.marketplace.create({
            creatorWallet: wallet.walletAddress,
            transactionFee: Number(fee),
            authorityAddress: wallet.walletAddress,
            feeRecipient: wallet.walletAddress,
        })
        // console.log(encoded_transaction);
        try {
            const result = await wallet.signCodedTx(encoded_transaction)
            console.log(result, address);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <section className='h-screen absolute top-0 left-0 z-50 bg-white/30 w-full flex flex-col justify-center items-center'>

            <div className="bg-black rounded-xl w-[50%] p-5">
                <div className="flex flex-row justify-end w-[100%]">
                    <button onClick={() => setShowMarketPlace(false)}>X</button>
                </div>
                <CustomInput type="number"
                    className="mb-3"
                    label="Fee for Transactions"
                    placeholder="enter transaction fee"
                    onChange={(e: any) => setFee(e.target.value)}
                />

                <button onClick={() => createMarketPlace()} className="object-center w-full py-[1rem] rounded-xl text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
                    Create
                </button>

            </div>

            {/* <article className='flex justify-between'>
                <div className='w-[23%]'>
                    <img src="/stak-logo2.png" alt="cart-item" />
                </div>
                <div className='flex flex-col'>
                    <p className='text-[1.6rem] font-semibold leading-none'>Apple Watch Ultra 2 with Ocean Band</p>
                    <p className='text-[2rem] font-bold'>IDR 15.999.000</p>

                </div>
            </article> */}
        </section>
    )
}
