import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const CartButton = () => {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
    >
      <ShoppingBag size={17} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-secondary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
