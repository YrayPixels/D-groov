import MarketPlace from "../components/MarketPlace";
import Navbar from "../components/Navbar";

export default function MarketPlacePage() {
  return (
    <>
      <div className="p-12 min-h-screen">
        <Navbar />
        <MarketPlace />
      </div>
      {/* <Navigation type={'home'} /> */}
    </>
  );
}
