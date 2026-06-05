import Image from "next/image";
import Button from "../ui/Button";

function CategoryCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="relative pt-[9.75rem] group cursor-pointer">
      <div className="absolute top-[9.75rem] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-xl transition-transform duration-300 group-hover:scale-105">
        <Image
          src={image}
          alt={name}
          width={150}
          height={195}
          className="object-contain"
        />
      </div>

      <div className="bg-gray w-full rounded-xl pt-[7.7rem] pb-[3.2rem] px-[2.4rem] flex flex-col items-center gap-[1.6rem] shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        <h2 className="text-[1.5rem] font-bold uppercase tracking-[0.13rem] text-black">
          {name}
        </h2>
        <Button variant="tertiary" href={name.toLowerCase()}>
          Shop
        </Button>
      </div>
    </div>
  );
}

export default CategoryCard;
