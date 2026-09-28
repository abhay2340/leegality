import { CATEGORIES_LIST } from "@/shared/config/categories";
import { CategoryCard } from "./CategoryCard";

export function ShopCategories() {
  return (
    <section className="shop-categories-section">
      <span className="section-subtitle-orange">Shop by Category</span>
      <h2 className="section-main-title">Categories</h2>
      <p className="section-description">
        Explore our wide range of products across popular categories.
      </p>

      <div className="categories-showcase-grid">
        {CATEGORIES_LIST.map((cat) => (
          <CategoryCard category={cat} key={cat.name} />
        ))}
      </div>
    </section>
  );
}
