import Navigation from "../components/Navigation";
import NftDetails from "../components/NftDetails";
import TopNavigation from "../components/TopNavigation";
import { GoShareAndroid } from "react-icons/go";

export default function ItemInfos() {
  return (
    <>
      <div className="p-12 min-h-screen">
        <TopNavigation
          title="Detail Product"
          icon={<GoShareAndroid className="text-[2.2rem]" />}
        />
        <NftDetails />
      </div>
      <Navigation type='detail' />
    </>
  );
}
