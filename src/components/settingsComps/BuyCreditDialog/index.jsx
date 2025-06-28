import { handleBuyCreditAPI } from "@/apiCalls/subscribe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBuyCreditDialog } from "@/store/useBuyCreditDialog";
import clsx from "clsx";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const creditOptions = [
  {
    label: "$25",
    price: 2500,
    input_tokens: 37500,
    output_tokens: 7500,
    cached_tokens: 15000,
  },
  {
    label: "$50",
    price: 5000,
    input_tokens: 75500,
    output_tokens: 15000,
    cached_tokens: 30000,
    recommended: true,
  },
  {
    label: "$75",
    price: 7500,
    input_tokens: 112500,
    output_tokens: 22500,
    cached_tokens: 45000,
  },
  {
    label: "$100",
    price: 10000,
    input_tokens: 150000,
    output_tokens: 30500,
    cached_tokens: 60000,
  },
];



export function BuyCreditDialog() {
  const { open, setOpen } = useBuyCreditDialog();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleBuy = async () => {
    if (!selected) return;

    setLoading(true);
    const creditBuyResponse = await handleBuyCreditAPI(selected, setLoading)

    if (creditBuyResponse?.error) {
      toast.error("Checkout error: ", {
        description: creditBuyResponse?.error || "Something went wrong.",
        style: { border: "none", color: "red" },
      });
      return
    }

  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v)
      setSelected(null)
    }}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Buy AI Credits</DialogTitle>
          <DialogDescription className="text-sm">
            1 credit = 1,000 tokens. Select a package below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {creditOptions.map((option) => {
            const isSelected = selected?.label === option.label;
            return (
              <div
                key={option.label}
                onClick={() => setSelected(option)}
                className={clsx(
                  "relative group cursor-pointer p-4 rounded-xl border transition hover:shadow-md",
                  isSelected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg text-[#000] font-semibold">{option.label}</p>
                    {/* <p className="text-sm text-muted-foreground">${option.price / 100}</p> */}
                    <p className="text-xs text-gray-500 mt-1">
                      {option.input_tokens.toLocaleString()} input · {option.output_tokens.toLocaleString()} output · {option.cached_tokens.toLocaleString()} cached
                    </p>
                  </div>
                  {isSelected && <Check className="text-indigo-600" size={20} />}
                </div>

                {option.recommended && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Sparkles size={12} />
                    Best Value
                  </div>
                )}
              </div>
            );
          })}

        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleBuy}
            disabled={!selected || loading}
            className="w-full cursor-pointer"
          >
            {loading
              ? "Redirecting..."
              : `Buy ${selected?.label || ""} Package`}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
