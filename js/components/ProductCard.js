import { formatPrice } from '../utils/formatters.js';
import { cartService } from '../services/CartService.js';

export const renderProductCard = (product) => {
    return `
        <article 
            class="product-card" 
            data-product-id="${product.id}"
        >
            <div class="product-image-container">
                <img 
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    srcset="
                        ${product.image.mobile} 300w,
                        ${product.image.tablet} 600w,
                        ${product.image.desktop} 900w
                    "
                    sizes="
                        (max-width: 480px) 300px,
                        (max-width: 768px) 600px,
                        900px
                    "
                >
            </div>
            
            <div class="product-info">
                <p class="product-category">
                    <i class="ph ph-tag"></i>
                    ${product.category}
                </p>
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">
                    <i class="ph ph-currency-dollar"></i>
                    ${formatPrice(product.price)}
                </p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button 
                        class="add-to-cart-btn"
                        aria-label="Add ${product.name} to cart"
                        onclick="window.addToCart(${product.id})"
                    >
                        <i class="ph ph-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <a 
                        href="/product-details.html?id=${product.id}"
                        class="view-details-btn"
                    >
                        <i class="ph ph-info"></i>
                        Details
                    </a>
                </div>
            </div>
        </article>
    `;
}; 