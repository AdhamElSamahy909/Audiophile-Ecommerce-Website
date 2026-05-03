import CategoryCard from "../home/CategoryCard";
import Container from "./Container";

const catgeoryData: { name: string; image: string }[] = [
  {
    name: "headphones",
    image: "/assets/shared/desktop/image-category-thumbnail-headphones.png",
  },
  {
    name: "speakers",
    image: "/assets/shared/desktop/image-category-thumbnail-speakers.png",
  },
  {
    name: "earphones",
    image: "/assets/shared/desktop/image-category-thumbnail-earphones.png",
  },
];

function CategoryList() {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[6.8rem] md:gap-[1rem] lg:gap-[3rem] w-full">
        {catgeoryData.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            image={category.image}
          />
        ))}
      </div>
    </Container>
  );
}

export default CategoryList;
