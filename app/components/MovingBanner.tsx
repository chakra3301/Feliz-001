export function MovingBanner() {
  return (
    <div className="py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 overflow-hidden text-neutral-900">
      <div className="animate-marquee flex gap-16 whitespace-nowrap">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="text-sm tracking-[0.3em] uppercase font-medium flex items-center gap-16">
            <span>Free Shipping Over $150</span>
            <span className="w-2 h-2 bg-white/40 rounded-full" />
            <span>Super Swag</span>
            <span className="w-2 h-2 bg-white/40 rounded-full" />
            <span>Made to Order</span>
            <span className="w-2 h-2 bg-white/40 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
}

