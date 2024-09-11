import CustomInput from "./customInput/customInput";

export default function NFTMint() {

    // const connection = new Connection(clusterApiUrl('mainnet-beta'));
    // 
    // const anchorWallet = useAnchorWallet();
    // useEffect(() => {
    //     const anchorProvider = anchorWallet && new AnchorProvider(connection, anchorWallet, {});
    //     if (anchorProvider) {
    //         setProvider(anchorProvider);
    //     }
    // }, [anchorWallet, connection])



    // const anchorProvider = anchorWallet && new AnchorProvider(connection, anchorWallet, {});
    // if (!anchorProvider) {
    //     return;
    // }
    // const programId = new PublicKey("H6PPjzSYdCTwCN2KEU6iumCDzUZsTS5fxQh6zFerEfQN");
    // const program = new Program<MarketplaceIDL>(IDL, programId, anchorProvider);

    // console.log(program);
    return (
        <section className='h-screen absolute top-0 left-0 z-50 bg-black w-full flex flex-col justify-center items-center'>

            <div className="border h-[50%] rounded-xl w-[50%]">

                <CustomInput type="text"
                    placeholder="enter"
                />

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
