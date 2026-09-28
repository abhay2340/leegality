import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface Category {
  name: string;
  label: string;
  count: string;
  className: string;
  image: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.name}`}
      className={`category-showcase-card ${category.className}`}
    >
      <div className="category-circle-bg">
        <img src={category.image} alt={category.label} />
      </div>
      <div className="category-card-footer">
        <div className="category-card-info">
          <span className="category-card-name">{category.label}</span>
          <span className="category-card-count">{category.count}</span>
        </div>
        <ArrowRight className="category-card-arrow" size={18} />
      </div>
    </Link>
  );
}
