import { getProducts, searchProducts, filterByCategory } from './services/ProductService.js';
import { renderProductCard } from './components/ProductCard.js';
import { formatPrice } from './utils/formatters.js';

// State management
const state = {
    products: [],
    filters: {
        search: '',
        category: '',
        maxPrice: 100
    }
};

// DOM Elements
const elements = {
    productsGrid: document.getElementById('productsGrid'),
    searchInput: document.getElementById('searchInput'),
    categorySelect: document.getElementById('categorySelect'),
    priceRange: document.getElementById('priceRange'),
    priceValue: document.getElementById('priceValue'),
    filterToggle: document.getElementById('filterToggle'),
    filtersDropdown: document.getElementById('filtersDropdown'),
    themeToggle: document.getElementById('themeToggle')
};

// Initialize application
const init = async () => {
    try {
        await loadProducts();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

// Load products
const loadProducts = async () => {
    try {
        showLoadingState();
        state.products = await getProducts();
        renderProducts(state.products);
    } catch (error) {
        showErrorState('Failed to load products. Please try again.');
    }
};

// Render products
const renderProducts = (products) => {
    if (!products.length) {
        showEmptyState();
        return;
    }

    elements.productsGrid.innerHTML = products
        .map(product => renderProductCard(product))
        .join('');
};

// Event Listeners
const setupEventListeners = () => {
    // Search with debounce
    elements.searchInput?.addEventListener('input', 
        debounce(handleSearch, 300)
    );

    // Category filter
    elements.categorySelect?.addEventListener('change', 
        handleCategoryChange
    );

    // Price range
    elements.priceRange?.addEventListener('input', 
        handlePriceChange
    );

    // Filter toggle
    elements.filterToggle?.addEventListener('click', 
        toggleFilters
    );

    // Theme toggle
    elements.themeToggle?.addEventListener('click', 
        toggleTheme
    );
};

// Event Handlers
const handleSearch = async (e) => {
    state.filters.search = e.target.value;
    await applyFilters();
};

const handleCategoryChange = async (e) => {
    state.filters.category = e.target.value;
    await applyFilters();
};

const handlePriceChange = async (e) => {
    state.filters.maxPrice = Number(e.target.value);
    elements.priceValue.textContent = `$${state.filters.maxPrice}`;
    await applyFilters();
};

// Toggle functions
const toggleFilters = () => {
    elements.filtersDropdown.classList.toggle('show');
    elements.filterToggle.setAttribute(
        'aria-expanded',
        elements.filtersDropdown.classList.contains('show')
    );
};

const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    elements.themeToggle.querySelector('i').className = isDark ? 'ph ph-moon' : 'ph ph-sun';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Filter products
const applyFilters = async () => {
    showLoadingState();
    
    try {
        let filteredProducts = state.products;

        // Apply filters
        if (state.filters.search) {
            filteredProducts = await searchProducts(state.filters.search);
        }

        if (state.filters.category) {
            filteredProducts = await filterByCategory(state.filters.category);
        }

        filteredProducts = filteredProducts.filter(
            product => product.price <= state.filters.maxPrice
        );

        renderProducts(filteredProducts);
    } catch (error) {
        showErrorState('Error applying filters');
    }
};

// UI State Handlers
const showLoadingState = () => {
    elements.productsGrid.innerHTML = `
        <div class="loading-state" aria-live="polite">
            <div class="loading-spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
};

const showErrorState = (message) => {
    elements.productsGrid.innerHTML = `
        <div class="error-state" role="alert">
            <p>${message}</p>
            <button onclick="window.location.reload()">
                Retry
            </button>
        </div>
    `;
};

const showEmptyState = () => {
    elements.productsGrid.innerHTML = `
        <div class="empty-state">
            <p>No products found matching your criteria.</p>
        </div>
    `;
};

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 

// Product Details Handler
window.showProductDetails = (productId) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" onclick="this.closest('.product-modal').remove()">
                <i class="ph ph-x"></i>
            </button>
            <div class="modal-body">
                <div class="product-image">
                    <img 
                        src="${product.image.desktop}" 
                        alt="${product.name}"
                    >
                </div>
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <p class="category">
                        <i class="ph ph-tag"></i>
                        ${product.category}
                    </p>
                    <p class="price">
                        <i class="ph ph-currency-dollar"></i>
                        ${formatPrice(product.price)}
                    </p>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart-btn">
                        <i class="ph ph-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}; 