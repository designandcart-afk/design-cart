'use client';
import { useState } from "react";
import CenterModal from "./CenterModal";

type ProductT = { id: string; title: string; imageUrl: string; price: number };

export default function AreaModal({
  open,
  onClose,
  area,
  products,
  projectAddress,
}: {
  open: boolean;
  onClose: () => void;
  area: string;
  products: ProductT[];
  projectAddress: string;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <CenterModal open={open} onClose={onClose} hideClose maxWidth="max-w-5xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur rounded-t-3xl px-6 pt-6 pb-4 border-b border-black/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#2e2e2e]">Product Details</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-sm font-medium text-[#d96857] hover:text-[#c85745] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div 
                key={p.id} 
                className="bg-white border border-black/8 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#d96857]/20 transition-all group"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-black/5 mb-3 bg-[#f7f7f6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                    onClick={() => setLightbox(p.imageUrl)}
                  />
                </div>
                <h4 className="text-sm font-semibold text-[#2e2e2e] line-clamp-2 mb-2">{p.title}</h4>
                <p className="text-lg font-bold text-[#d96857] mb-3">
                  ₹{p.price.toLocaleString('en-IN')}
                </p>
                <button
                  className="w-full bg-[#d96857] hover:bg-[#c85745] text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                  onClick={() => {
                    try {
                      window.dispatchEvent(new CustomEvent("cart:add", { detail: { productId: p.id } }));
                    } catch {}
                    alert(`Added "${p.title}" to cart`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#2e2e2e]/60">No products linked to this area yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Product Preview"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            <span className="text-white text-2xl leading-none">×</span>
          </button>
        </div>
      )}
    </CenterModal>
  );
}
