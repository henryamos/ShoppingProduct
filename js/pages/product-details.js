import { getProducts } from '../services/ProductService.js';
import { cartService } from '../services/CartService.js';
import { formatPrice } from '../utils/formatters.js';
import { renderCartDrawer } from '../components/CartDrawer.js';

// Add state management
const state = {
    product: null
};

const elements = {
    productDetails: document.getElementById('productDetails'),
    cartToggle: document.getElementById('cartToggle'),
    cartCount: document.getElementById('cartCount'),
    cartContainer: document.getElementById('cartContainer')
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
                        <button class="quantity-btn" onclick="window.decrementQuantity()">
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
                        <button class="quantity-btn" onclick="window.incrementQuantity()">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                    <button 
                        class="add-to-cart-btn"
                        onclick="window.addToCartFromDetails(${product.id})"
                    >
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

// Cart functionality
const setupCartEventListeners = () => {
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-overlay');
    if (!cartDrawer) return;

    const closeCart = () => cartService.toggleCart();

    cartDrawer.querySelector('#closeCart')?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            closeCart();
        }
    });

    // Cart item actions
    cartDrawer.querySelectorAll('.cart-item').forEach(item => {
        const productId = parseInt(item.dataset.productId);

        item.querySelector('[data-action="increase"]')?.addEventListener('click', () => {
            const currentQuantity = cartService.getCartInfo().items.find(i => i.id === productId).quantity;
            cartService.updateQuantity(productId, currentQuantity + 1);
        });

        item.querySelector('[data-action="decrease"]')?.addEventListener('click', () => {
            const currentQuantity = cartService.getCartInfo().items.find(i => i.id === productId).quantity;
            cartService.updateQuantity(productId, currentQuantity - 1);
        });

        item.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
            cartService.removeFromCart(productId);
        });
    });
};

const updateCartUI = (cartInfo) => {
    if (elements.cartCount) {
        elements.cartCount.textContent = cartInfo.totalItems;
        elements.cartCount.classList.toggle('has-items', cartInfo.totalItems > 0);
    }

    if (elements.cartContainer) {
        elements.cartContainer.innerHTML = renderCartDrawer(cartInfo);
        setupCartEventListeners();
    }
};

// Add to cart from product details
window.addToCartFromDetails = () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (state.product && quantity > 0) {
        cartService.addToCart(state.product, quantity);
        showToast(`${quantity} ${state.product.name}${quantity > 1 ? 's' : ''} added to cart!`);
    }
};

// Quantity controls
window.incrementQuantity = () => {
    const input = document.getElementById('quantity');
    input.value = Math.min(99, parseInt(input.value) + 1);
};

window.decrementQuantity = () => {
    const input = document.getElementById('quantity');
    input.value = Math.max(1, parseInt(input.value) - 1);
};

// Toast notification
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Initialize
const init = async () => {
    try {
        const productId = getProductIdFromUrl();
        const products = await getProducts();
        const product = products.find(p => p.id === productId);
        
        if (product) {
            state.product = product; // Store the product in state
            renderProductDetails(product);
            document.title = `${product.name} - Gourmet Desserts`;
            
            // Setup cart functionality
            elements.cartToggle?.addEventListener('click', () => cartService.toggleCart());
            cartService.subscribe(updateCartUI);
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
        elements.productDetails.innerHTML = `
            <div class="error-state">
                <p>Failed to load product details. Please try again.</p>
                <a href="/" class="btn">Back to Home</a>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', init); 