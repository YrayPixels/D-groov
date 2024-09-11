
import { useState } from "react";
import NftDetails from "./NftDetails";

export default function PersonalItemDisplay({ userNfts, setShowPersonalNFTs }: any) {

  const [showItem, setShowItem] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any>(null);

  return (
    <div className="bg-black/50 left-0 h-screen overflow-scroll w-screen top-0 fixed">
      <div className="w-screen flex flex-row justify-center z-50 items-center py-3">
        <div className="font-bold bg-[#e53d75] p-2 rounded-lg  right-[50%] text-[20px] text-red-200 cursor-pointer" onClick={() => setShowPersonalNFTs(false)}>Close</div>
      </div>

      {userNfts.length > 0 ?
        <section className="absolute m-auto  top-0 h-fit overflow-scroll  left-0  p-20 pt-10 mt-20 grid grid-cols-5 gap-4 mt-[3rem]">

          {userNfts.map((nft: any, index: number) => {
            return (
              <article key={index} onClick={() => {
                setSelectedNft(nft)
                setShowItem(true);
              }} className="relative bg-black/80 rounded-xl border-[#e6e9f0] overflow-hidden flex flex-col">
                <div className="w-[100%] overflow-hidden h-[100px]" style={{ objectFit: 'cover' }}>
                  <img className="w-[100%] h-[100%]" src={nft.image_uri} style={{ objectFit: 'cover' }} alt="nft1-icon" />
                </div>
                <div className="w-[100%] p-2 py-3 flex flex-row justify-between">
                  <p className="text-[#fdefd8] text-[8px] font-bold">{nft.name}</p>
                </div>
                <div className="p-2 w-[100%] flex justify-center items-center">
                  <button onClick={() => {
                    setSelectedNft(nft)
                    setShowItem(true);
                  }} className="p-2 text-[8px] rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
                    View
                  </button>
                </div>
              </article>
            )
          })
          }
        </section>
        :
        <div className="text-center w-[700px] h-screen  flex flex-row justify-center items-center">
          <p className="text-[#fdefd8] w-[100%] bg-black  text-[20px] font-bold">No cNFT's found in your wallet!</p>
        </div>
      }



      {showItem &&
        <div className="absolute h-fit w-screen top-0 left-0 bg-black/50 p-20 flex flex-row justify-center items-center">
          <div className="h-[50%] w-[100%] relative -top-[20%] p-3 px-5 bg-black rounded-xl">
            <div className="w-[100%] flex flex-col items-end">
              <p className="text-[14px] bg-red-500 rounded-xl p-2 cursor-pointer" onClick={() => setShowItem(false)}>x</p>
            </div>
            <NftDetails setShowItem={setShowItem} nft={selectedNft} />
          </div>

        </div>
      }
    </div>

  );
}
