
import { Link } from "react-router-dom";

//fetch item in listing

//Check the Wallet for the nfts on the wallet and display , then add a button to list the items.



export default function ItemDisplay() {


  const itemsDisplayed = [1, 2, 3, 4];

  return (
    <section className="grid grid-cols-4 gap-4 mt-[3rem]">


      {itemsDisplayed.map((_item: any, index: number) => {
        return (
          <Link key={index} to="/">
            <article className="relative border rounded-xl border-[#e6e9f0] overflow-hidden flex flex-col">
              <div className="w-[100%]">
                <img src="https://img-cdn.magiceden.dev/autoquality:size:512000:20:80/rs:fill:640:0:0/plain/https://media.cdn.magiceden.dev/launchpad/footies/ee09500b-06d2-4b19-a90a-578b3605ccc2" alt="nft1-icon" />
              </div>
              <div className="w-[100%] p-2 py-3">
                <p className="text-[#fdefd8] text-[20px] font-bold">Footies</p>
              </div>
              <div className="p-2 w-[100%]">
                <button onClick={() => { }} className="p-3 rounded-xl w-[10/12] text-[1.5rem] font-semibold bg-[#e53d75] btn btn-secondary">
                  View
                </button>
              </div>
            </article>
          </Link>
        )
      })}
    </section>
  );
}
