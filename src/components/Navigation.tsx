import { RiHome7Fill } from "react-icons/ri";
import { FaRegFileLines, FaRegHeart } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { CgShoppingBag } from "react-icons/cg";

type NavigationProps = {
  type: string;
};

export default function Navigation({ type }: NavigationProps) {  
  if (type === "home") {
    return (
      <section className="px-12 py-5 w-full bottom-0 top-border-shadow bg-white fixed z-[10000]">
        <div className="flex items-center w-full justify-between">
          <article className="flex flex-col items-center">
            <RiHome7Fill className="text-orange-600 text-[3.2rem]" />
            <p>Home</p>
          </article>
          <article className="flex flex-col items-center">
            <FaRegHeart className="text-[#a4a8b5] text-[3.2rem]" />
            <p>Wishlist</p>
          </article>
          <article className="flex flex-col items-center">
            <FaRegFileLines className="text-[#a4a8b5] text-[3.2rem]" />
            <p>Transaction</p>
          </article>
          <article className="flex flex-col items-center">
            <FaRegUser className="text-[#a4a8b5] text-[3.2rem]" />
            <p>Profile</p>
          </article>
        </div>
      </section>
    );
  }

  if (type === "detail") {
    return (
      <section className="px-12 py-5 w-full bottom-0 top-border-shadow bg-white fixed z-[10000] flex justify-between">
        <div className="flex gap-3 border-2 border-orange text-orange py-[1rem] rounded-2xl basis-[48%] justify-center">
          <CgShoppingBag className="text-[2rem]" />
          <p className="text-[1.6rem] font-semibold">Add to Cart</p>
        </div>
        <div className="flex bg-orange text-white py-[1rem] rounded-2xl basis-[48%] justify-center">
          <p className="text-[1.6rem]">Checkout</p>
        </div>
      </section>
    );
  }

  return null;
}
