import CartItems from "../components/CartItems";
import TopNavigation from "../components/TopNavigation";

export default function MyCart() {
  return (
    <div className="p-12 min-h-screen">
      <TopNavigation title="Cart" />
      <CartItems />
    </div>
  );
}
