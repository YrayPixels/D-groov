import NFTMint from "./NftMint";
import { useEffect, useState } from "react";
import useCanvasWallet from "./CanvasWalletAdapter";
import CreateMarketPlace from "./CreateMarketPlace";
import ItemDisplay from "./ItemDisplay";
import { Link } from "react-router-dom";
import { Helius } from "helius-sdk";

export default function Main() {
  const [startMint, _setStartMint] = useState(false)
  const [showMarketPlace, setShowMarketPlace] = useState(false)
  const [nftItem, _setNftItems] = useState<any>([]);
  const [notify, setNotify] = useState({
    message: '',
    type: ''
  })

  const walletAddress = localStorage.getItem('walletAddress') || useCanvasWallet().walletAddress;

  const shyft = useCanvasWallet().marketSDK;

  const [_userNfts, setUserNfts] = useState<any>([]);


  useEffect(() => {
    if (!walletAddress) {
      setNotify({
        message: 'Please connect your wallet to use application',
        type: 'error',
      })
      setTimeout(() => {
        setNotify({
          message: '',
          type: ''
        })
      }, 2000)
      return;
    }
    (async () => {

      const helius = new Helius(import.meta.env.VITE_REACT_HELIUS_API);
      const response = await helius.rpc.getAssetsByOwner({
        ownerAddress: walletAddress,
        page: 1,
      });

      console.log(response)


      const nfts = await shyft.nft.compressed.readAll({
        walletAddress: walletAddress
      })
      setUserNfts(nfts);

    })()
  }, [walletAddress]);

  return (

    <main className="pt-[3rem] pb-[5rem] text-white">
      <div className="flex flex-row justify-center items-center">

        {notify.type !== '' &&
          <div className={`${notify.type == "success" ? 'bg-green-500' : "bg-red-500"} w-[400px] shadow rounded-lg  p-3 absolute top-20`}>
            <p className='text-center'>{notify.message}</p>
          </div>
        }
      </div>

      <div className="mb-3 flex flex-col justify-center leading-tight items-center space-y-1">
        <p className="text-[20px] camar-text text-[#fdefd8]">welcome to</p>
        <h2 className="text-[100px] text-[#fdefd8] text-center font-extrabold camar-text">D-Grovv</h2>
        <p className="text-[18px] text-[#fdefd8]   text-center camar-text w-6/12">
          Sell and Buy your NFT's right here on DSCVR, using the D-Groovv instant market place.
        </p>

        <div className="flex flex-row  p-2 justify-center gap-x-2">

          <Link to="/market-place" className="p-3  shadow text-white rounded-xl text-[1.5rem] font-semibold hover:bg-[#e53d75]/90 bg-[#e53d75]">
            Enter Market Place
          </Link>
        </div>

        <div className="text-black text-center py-10 bg-white mt-10 ">
          <p className="">Market place is currently on mainnet, all transactions are real! trade wisely.</p>
          <p className="">How does it work, on listing you assign delegation to our contract address which handles sale for you!, we take 5% for all successfull sale,listing and unlisting is free and you'll only need to pay transaction fees.</p>
        </div>
      </div>


      {startMint &&
        <NFTMint />
      }

      {showMarketPlace &&
        <CreateMarketPlace setShowMarketPlace={setShowMarketPlace} shyft={shyft} />
      }


      {nftItem.length > 0 ?
        <ItemDisplay />
        :
        <></>
      }

    </main>
  );
}
