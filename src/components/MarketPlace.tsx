
import { useEffect, useState } from "react";
import useCanvasWallet from "./CanvasWalletAdapter";
import PersonalItemDisplay from "./PersonalItemDisplay";
import { fetchListings, fetchUserListings, getListedItem, } from "../requestsHandler/requestsItems";
import NftDetails from "./NftDetails";
import UnlistNFT from "./UnlistNFT";

export default function MarketPlace() {
  const [notify, setNotify] = useState({
    message: '',
    type: ''
  })

  const canvas = useCanvasWallet()
  const walletAddress = localStorage.getItem('walletAddress') || canvas.walletAddress;

  const shyft = canvas.marketSDK;

  const [userNfts, setUserNfts] = useState<any>([]);
  const [listings, setListings] = useState<any>([]);
  const [showPersonalNFTs, setShowPersonalNFTs] = useState(false);
  const [activeTabs, setActiveTabs] = useState('marketItems');
  const [showItem, setShowItem] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [startUnlist, setStartUnlist] = useState(false);


  const { update } = useCanvasWallet()


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
  }, [walletAddress]);

  useEffect(() => {
    (async () => {
      if (!walletAddress) {
        let canvasItem = await canvas.connectWallet()
        if (canvasItem) {
          if (activeTabs == "marketItems") {
            fetchMarketListings()
          } else if (activeTabs == "personalItems") {
            fetchPersonalListings()
          }
        }
      } else {
        if (activeTabs == "marketItems") {
          fetchMarketListings()
        } else if (activeTabs == "personalItems") {
          fetchPersonalListings()
        }
      }
    })()
  }, [activeTabs, update, walletAddress])

  const getUserNFTs = async () => {
    if (!walletAddress) {
      let canvasItem = await canvas.connectWallet()
      if (canvasItem) {
        const nfts = await shyft.nft.compressed.readAll({
          walletAddress: walletAddress
        })
        let itemsLoaded =
          await Promise.all(
            nfts.map(async (item) => {
              let response = await getListedItem(item?.mint)
              if (response?.data?.status !== "success") {
                return item;
              }
            })
          )
        itemsLoaded = itemsLoaded.filter(item => item !== undefined);
        setUserNfts(itemsLoaded)

        // setUserNfts(itemsLoaded);
      }
    } else {
      const nfts = await shyft.nft.compressed.readAll({
        walletAddress: walletAddress
      })
      let itemsLoaded =
        await Promise.all(
          nfts.map(async (item) => {
            let response = await getListedItem(item?.mint)
            if (response?.data?.status !== "success") {
              return item;
            }
          })
        )

      itemsLoaded = itemsLoaded.filter(item => item !== undefined);
      setUserNfts(itemsLoaded)
    }


  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMarketListings = async () => {
    setLoading(true);
    const getMarketListings = await fetchListings();

    const items = [];
    for (const item of getMarketListings.data) {
      await delay(500); // Adjust the delay time (500ms in this example)
      const downloaded = await shyft.nft.compressed.read({ mint: item.asset_mint });

      const sentItem = { nftData: downloaded, marketplaceData: item };
      items.push(sentItem);
    }
    setListings(items);

    if (items.length == getMarketListings.data.length) {
      setLoading(false);
    }
  }

  const fetchPersonalListings = async () => {
    setLoading(true);

    const getMarketListings = await fetchUserListings(walletAddress);
    const items = [];
    for (const item of getMarketListings.data) {
      await delay(500); // Adjust the delay time (500ms in this example)
      const downloaded = await shyft.nft.compressed.read({ mint: item.asset_mint });

      const sentItem = { nftData: downloaded, marketplaceData: item };
      items.push(sentItem);
    }
    setListings(items);
    if (items.length == getMarketListings.data.length) {
      setLoading(false);
    }

  }

  return (

    <main className="pt-[3rem] pb-[5rem] text-white">
      <div className="flex flex-row justify-center items-center">

        {notify.type !== '' &&
          <div className={`${notify.type == "success" ? 'bg-green-500' : "bg-red-500"} w-[400px] shadow rounded-lg  p-3 absolute top-20`}>
            <p className='text-center'>{notify.message}</p>
          </div>
        }
      </div>

      <div className="mb-3 flex flex-col  space-y-1">
        <div className="flex flex-row gap-x-3 font-bold text-[12px] divide-x">
          <p onClick={() => setActiveTabs('marketItems')} className={`${activeTabs == "marketItems" && "bg-red-500/50"} px-2 cursor-pointer hover:underline `}>
            Listings
          </p>
          <p onClick={() => setActiveTabs('personalItems')} className={`${activeTabs == "personalItems" && "bg-red-500/50"} px-2 cursor-pointer hover:underline`}>
            My Listings
          </p>
          <p onClick={() => {
            setShowPersonalNFTs(true);
            getUserNFTs();
            console.log('clicked');
          }} className="px-2 cursor-pointer hover:underline">
            List New Items
          </p>
        </div>
        <hr />
        {loading ? <>
          <div className="flex flex-row justify-center items-center h-[350px]">

            <div className="loader"></div>
          </div>

        </> : <>
          {listings.length ?
            <section className="top-0 h-fit overflow-scroll  left-0 p-2 grid grid-cols-4 gap-4 mt-[3rem]">
              {
                listings.map((nft: any, index: number) => {
                  return (
                    <article key={index} onClick={() => {
                      setSelectedNft(nft)
                      activeTabs == 'marketItems' ? setShowItem(true) : setStartUnlist(true);
                    }} className="relative bg-black/80 rounded-xl border-[#e6e9f0] overflow-hidden flex flex-col">
                      <div className="w-[100%] overflow-hidden h-[100px]" style={{ objectFit: 'cover' }}>
                        <img className="w-[100%] h-[100%]" src={nft.nftData.image_uri} style={{ objectFit: 'cover' }} alt="nft1-icon" />
                      </div>
                      <div className="w-[100%] p-2 py-3 flex flex-row justify-between">
                        <p className="text-[#fdefd8] text-[8px] font-bold">{nft.nftData.name}</p>
                      </div>
                      <div className="p-2 w-[100%] flex justify-center items-center">
                        {activeTabs == "marketItems" ?
                          <button onClick={() => {
                            setSelectedNft(nft)
                            setShowItem(true);
                          }} className="p-2 text-[10px] rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
                            Buy {nft.marketplaceData.fee} SOL
                          </button>
                          :
                          <button onClick={() => {
                            setStartUnlist(true)
                          }} className="p-2 text-[10px] rounded-xl w-10/12 text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
                            Unlist Item
                          </button>
                        }
                      </div>
                    </article>
                  )
                })
              }

            </section>
            : <div className="text-[24px] h-[300px] flex flex-col justify-center items-center">
              {activeTabs == "marketItems" ? "No Items in Market Yet" : "You have no listed Item!"}
              <button onClick={() => {
                setShowPersonalNFTs(true);
                getUserNFTs();
              }} className="p-3 shadow text-black rounded-xl text-[1.5rem] font-semibold bg-[#fdefd7] btn btn-secondary">
                List New Items
              </button>
            </div>
          }
        </>
        }
      </div>

      {showPersonalNFTs &&
        <PersonalItemDisplay userNfts={userNfts} setShowPersonalNFTs={setShowPersonalNFTs} />
      }

      {showItem &&
        <div className="absolute  h-fit w-screen top-0 left-0 bg-black/50 p-20 flex flex-row justify-center items-center">
          <div className="h-[50%] w-[100%] relative -top-[20%] p-3 px-5 bg-black rounded-xl">
            <div className="w-[100%] flex flex-col items-end">
              <p className="text-[14px] bg-red-500 rounded-xl p-2 cursor-pointer" onClick={() => setShowItem(false)}>x</p>
            </div>
            <NftDetails setShowItem={setShowItem} nft={selectedNft?.nftData} buy={true} marketData={selectedNft?.marketplaceData} />
          </div>

        </div>
      }

      {startUnlist &&
        <div className="absolute h-fit w-screen top-0 left-0 bg-black/50 p-20 flex flex-row justify-center items-center">
          <div className="h-[50%] w-[100%] relative -top-[20%] p-3 px-5 bg-black rounded-xl">
            <div className="w-[100%] flex flex-col items-end">
              <p className="text-[14px] bg-red-500 rounded-xl p-2 cursor-pointer" onClick={() => setStartUnlist(false)}>x</p>
            </div>

            <UnlistNFT setShowItem={setStartUnlist} nft={selectedNft?.nftData} marketData={selectedNft?.marketplaceData} />
          </div>

        </div>
      }
    </main>
  );
}
