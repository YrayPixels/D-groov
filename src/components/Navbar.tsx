import Logo from "./Logo";
import Notifications from "./Notifications";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between">
      <Logo />
      {/* <div className="text-white text-[14px] font-bold flex justify-between items-center gap-x-4">
        <Link className="hover:underline" to="/market-place">
          Market-Place
        </Link>
        <Link className="hover:underline" to="/my-nfts">
          My NFT's
        </Link>
      </div> */}
      <Notifications />
    </div>
  );
}
