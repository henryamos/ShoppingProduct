// Mock product data
const products = [
    {
        id: 1,
        name: "Chocolate Truffle Cake",
        category: "cakes",
        price: 35.99,
        description: "Rich chocolate cake layered with truffle cream and dark chocolate ganache",
        image: {
            mobile: "https://placehold.co/300x200?text=Chocolate+Cake",
            tablet: "https://placehold.co/600x400?text=Chocolate+Cake",
            desktop: "https://placehold.co/900x600?text=Chocolate+Cake"
        }
    },
    {
        id: 2,
        name: "French Macarons Box",
        category: "pastries",
        price: 24.99,
        description: "Assorted French macarons in various flavors",
        image: {
            mobile: "https://placehold.co/300x200?text=Macarons",
            tablet: "https://placehold.co/600x400?text=Macarons",
            desktop: "https://placehold.co/900x600?text=Macarons"
        }
    },
    // Add more products as needed
];

// Simulate API call delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async () => {
    await delay(500);
    return products;
};

export const filterByCategory = async (category) => {
    const allProducts = await getProducts();
    return allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
};

export const searchProducts = async (query) => {
    const allProducts = await getProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}; 