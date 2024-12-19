import { getProducts } from '../services/ProductService.js';
import { formatPrice } from '../utils/formatters.js';

const elements = {
    productDetails: document.getElementById('productDetails')
};

const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
};

const renderProductDetails = (product) => {
    const template = `
        <nav class="breadcrumb">
            <a href="/">Home</a>
            <i class="ph ph-caret-right"></i>
            <a href="/">Products</a>
            <i class="ph ph-caret-right"></i>
            <span>${product.name}</span>
        </nav>

        <div class="product-details-container">
            <div class="product-gallery">
                <img 
                    src="${product.image.desktop}" 
                    alt="${product.name}"
                    class="main-image"
                >
                <div class="thumbnail-grid">
                    <img src="${product.image.mobile}" alt="Thumbnail 1" class="thumbnail active">
                    <img src="${product.image.tablet}" alt="Thumbnail 2" class="thumbnail">
                    <img src="${product.image.desktop}" alt="Thumbnail 3" class="thumbnail">
                    <!-- Add more thumbnails as needed -->
                </div>
            </div>

            <div class="product-info">
                <p class="product-category">
                    <i class="ph ph-tag"></i>
                    ${product.category}
                </p>
                <h1 class="product-name">${product.name}</h1>
                <p class="product-price">
                    <i class="ph ph-currency-dollar"></i>
                    ${formatPrice(product.price)}
                </p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decrementQuantity()">
                            <i class="ph ph-minus"></i>
                        </button>
                        <input 
                            type="number" 
                            class="quantity-input" 
                            value="1" 
                            min="1" 
                            max="99"
                            id="quantity"
                        >
                        <button class="quantity-btn" onclick="incrementQuantity()">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                    <button class="add-to-cart-btn">
                        <i class="ph ph-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>

        <div class="additional-info">
            <div class="info-tabs">
                <button class="tab-btn active" data-tab="description">Description</button>
                <button class="tab-btn" data-tab="ingredients">Ingredients</button>
                <button class="tab-btn" data-tab="nutrition">Nutrition Info</button>
            </div>
            <div class="tab-content" id="tabContent">
                <p>${product.description}</p>
            </div>
        </div>
    `;

    elements.productDetails.innerHTML = template;
    setupEventListeners();
};

const setupEventListeners = () => {
    // Quantity controls
    window.incrementQuantity = () => {
        const input = document.getElementById('quantity');
        input.value = Math.min(99, parseInt(input.value) + 1);
    };

    window.decrementQuantity = () => {
        const input = document.getElementById('quantity');
        input.value = Math.max(1, parseInt(input.value) - 1);
    };

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContent = document.getElementById('tabContent');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In a real app, you'd load different content based on the tab
            tabContent.innerHTML = `<p>Content for ${btn.dataset.tab} tab</p>`;
        });
    });

    // Thumbnail switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImage.src = thumb.src;
        });
    });
};

const init = async () => {
    try {
        const productId = getProductIdFromUrl();
        const products = await getProducts();
        const product = products.find(p => p.id === productId);
        
        if (product) {
            renderProductDetails(product);
            document.title = `${product.name} - Gourmet Desserts`;
        } else {
            elements.productDetails.innerHTML = `
                <div class="error-state">
                    <p>Product not found</p>
                    <a href="/" class="btn">Back to Home</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load product details:', error);
    }
};

document.addEventListener('DOMContentLoaded', init); 