import Image from "next/image";

function CartItems({ items }) {
  return (
    <div className="flex flex-col gap-[2.4rem] mb-[3.2rem]">
      {items?.map((item) => {
        const formatProductName = (name: string) => {
          let formatted = name
            .replace(/(Headphones|Earphones|Speaker|Wireless)/gi, "")
            .trim();
          formatted = formatted.replace(/Mark One/gi, "MK I");
          formatted = formatted.replace(/Mark Two/gi, "MK II");
          return formatted;
        };

        return (
          <div key={item.id} className="flex items-center gap-[1.6rem]">
            <div className="w-[6.4rem] h-[6.4rem] rounded-[0.8rem] bg-[#f1f1f1] overflow-hidden flex items-center justify-center">
              <Image
                src={`/assets/cart/image-${item.product.slug}.jpg`}
                alt={item.product.name}
                width={64}
                height={64}
                className="w-[4.2rem] h-[4.2rem] object-contain flex-shrink-0"
                unoptimized
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[1.5rem] font-bold leading-[2.5rem]">
                {formatProductName(item.product.name)}
              </span>
              <span className="text-[1.4rem] font-bold opacity-50 leading-[2.5rem]">
                $ {item.product.price.toLocaleString()}
              </span>
            </div>
            <span className="text-[1.5rem] font-bold text-black opacity-50">
              x{item.quantity}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default CartItems;
