import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { formatKES, type Product } from "@/lib/library/types";
import { getOrderStatus, normaliseKenyanPhone, startMpesaPurchase } from "@/lib/library/mpesaCheckout";

interface Props {
  product: Product;
  onPaid?: () => void;
  /** Start with the phone field visible (used in the paywall card). */
  expanded?: boolean;
  /** Where to send the reader once payment confirms (e.g. /writing/slug). */
  redirectTo?: string;
}

type Stage = "idle" | "form" | "sending" | "waiting" | "paid";

const MpesaPayBox = ({ product, onPaid, expanded = false, redirectTo }: Props) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>(expanded ? "form" : "idle");
  const [phone, setPhone] = useState("");
  const lock = useRef(false);
  const poll = useRef<number | null>(null);
  const price = formatKES(product.price_kes);

  useEffect(() => () => { if (poll.current) window.clearInterval(poll.current); }, []);

  const waitForPayment = (orderId: string, token: string) => {
    let tries = 0;
    poll.current = window.setInterval(async () => {
      tries += 1;
      const status = await getOrderStatus(orderId, token);
      if (status === "paid") {
        window.clearInterval(poll.current!);
        setStage("paid");
        toast.success("Payment confirmed! Opening publication…");
        onPaid?.();
        if (redirectTo) window.setTimeout(() => navigate(redirectTo), 1500);
      } else if (status === "failed") {
        window.clearInterval(poll.current!);
        setStage("form");
        lock.current = false;
        toast.error("The M-PESA payment was cancelled or failed. Please try again.");
      } else if (tries >= 40) {
        window.clearInterval(poll.current!);
        setStage("form");
        lock.current = false;
        toast.error("We didn't receive a confirmation yet. If you paid, refresh in a minute.");
      }
    }, 3000);
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    if (!normaliseKenyanPhone(phone)) {
      toast.error("Enter a valid Safaricom number (07… or 254…).");
      return;
    }
    lock.current = true;
    setStage("sending");
    try {
      const { orderId, token, message } = await startMpesaPurchase(product, phone);
      toast.success(message || "Check your phone and enter your M-PESA PIN.");
      setStage("waiting");
      waitForPayment(orderId, token);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setStage("form");
      lock.current = false;
    }
  };

  if (stage === "idle") {
    return (
      <button
        onClick={() => setStage("form")}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Smartphone size={16} /> {price}
      </button>
    );
  }

  if (stage === "paid") {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckCircle2 size={16} className="text-secondary" /> Payment confirmed! Opening publication…
      </p>
    );
  }

  return (
    <form onSubmit={pay} className="w-full max-w-sm space-y-3">
      <label htmlFor={`mpesa-${product.id}`} className="block text-sm text-foreground">
        Safaricom phone number
      </label>
      <input
        id={`mpesa-${product.id}`}
        inputMode="tel"
        autoComplete="tel"
        placeholder="07xx xxx xxx or 2547xx xxx xxx"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={stage !== "form"}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <button
        type="submit"
        disabled={stage !== "form"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {stage === "form" ? <Smartphone size={16} /> : <Loader2 size={16} className="animate-spin" />}
        {stage === "form" && `Pay ${price} with M-PESA`}
        {stage === "sending" && "Sending prompt…"}
        {stage === "waiting" && "Enter your PIN on your phone…"}
      </button>
      <p className="text-xs text-muted-foreground">
        You'll get an M-PESA PIN prompt on this number. Keep this page open.
      </p>
    </form>
  );
};

export default MpesaPayBox;
