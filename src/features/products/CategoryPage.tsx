import BestAudioGear from "@/components/ui/BestAudioGear";
import CategoryList from "@/components/ui/CategoryList";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Product } from "@/server/db/schema";

function CategoryPage({ products }: { products: Product[] }) {
  return (
    <>
      <Container extraClasses="flex flex-col gap-[12rem] md:gap-[12rem] lg:gap-[16rem]">
        {[...products]
          .sort((a, b) => (a.new === b.new ? 0 : a.new ? -1 : 1))
          .map((product, index) => {
            const deskImg = product.categoryDesktopImage.replace(
              "./assets",
              "/assets",
            );
            const tabImg = product.categoryTabletImage.replace(
              "./assets",
              "/assets",
            );
            const mobImg = product.categoryMobileImage.replace(
              "./assets",
              "/assets",
            );
            const isEven = index % 2 === 0;

            return (
              <div
                key={product.id}
                className={`flex flex-col items-center lg:flex-row gap-[3.2rem] md:gap-[5.2rem] lg:gap-[12.5rem] lg:justify-between ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full lg:w-1/2 flex justify-center bg-[#F1F1F1] rounded-lg">
                  <picture>
                    <source media="(min-width: 1024px)" srcSet={deskImg} />
                    <source media="(min-width: 768px)" srcSet={tabImg} />
                    <img
                      src={mobImg}
                      alt={product.name}
                      className="w-full h-auto object-cover rounded-lg mix-blend-multiply"
                    />
                  </picture>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center lg:items-start lg:text-left gap-[2.4rem] md:gap-[3.2rem] lg:gap-[4rem]">
                  {product.new && (
                    <span className="text-accent tracking-[1rem] text-[1.4rem] font-normal uppercase">
                      New Product
                    </span>
                  )}
                  <h2 className="text-[2.8rem] md:text-[4rem] font-bold uppercase leading-tight tracking-[0.1rem] md:tracking-[0.15rem] max-w-[300px] md:max-w-[400px]">
                    {product.name}
                  </h2>
                  <p className="text-[1.5rem] leading-[2.5rem] font-medium text-black/50 md:max-w-[57.2rem] lg:max-w-[44.5rem]">
                    {product.description}
                  </p>
                  <Button
                    variant="primary"
                    href={`/${product.category}/${product.slug}`}
                  >
                    See Product
                  </Button>
                </div>
              </div>
            );
          })}
      </Container>
      <CategoryList />
      <BestAudioGear />
    </>
  );
}

export default CategoryPage;
