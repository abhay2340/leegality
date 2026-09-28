import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.png";
import { appPaths } from "@/app/router/paths";

export function ShopHero() {
  return (
    <section className="shop-hero-section">
      <div className="shop-hero-glow" />
      <div className="shop-hero-content">
        <span className="hero-badge">NEW COLLECTION</span>
        <h1 className="hero-title">
          Elevate Your Style <br />
          Every Day.
        </h1>
        <p className="hero-subtitle">
          Discover the latest trends in fashion, electronics, and home
          essentials - all in one place.
        </p>
        <div className="hero-actions">
          <Link to={appPaths.products} className="hero-btn primary">
            Shop Now <ArrowRight size={16} />
          </Link>
          <a href="#trending" className="hero-btn secondary">
            Explore Deals
          </a>
        </div>
      </div>
      <div className="shop-hero-image-wrapper">
        <img
          src={heroImg}
          alt="New Collection Showcase"
          className="shop-hero-image"
        />
      </div>
    </section>
  );
}
