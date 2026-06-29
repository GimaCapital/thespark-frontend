// src/pages/Marketplace/data/products.js
export const foodProducts = [
    // Rice
    {
        id: 1,
        name: 'Premium Parboiled Rice',
        category: 'grains',
        originalPrice: 95000,
        discountPrice: 75000,
        discount: 21,
        image: '🍚',
        description: '50kg bag, premium quality parboiled rice',
        unit: '50kg bag',
        stock: 50,
        rating: 4.8,
        reviews: 234
    },
    {
        id: 2,
        name: 'Long Grain Rice',
        category: 'grains',
        originalPrice: 85000,
        discountPrice: 68000,
        discount: 20,
        image: '🍚',
        description: '50kg bag, long grain white rice',
        unit: '50kg bag',
        stock: 40,
        rating: 4.6,
        reviews: 189
    },
    {
        id: 3,
        name: 'Ofada Rice',
        category: 'grains',
        originalPrice: 90000,
        discountPrice: 72000,
        discount: 20,
        image: '🌾',
        description: '50kg bag, authentic Ofada rice',
        unit: '50kg bag',
        stock: 30,
        rating: 4.7,
        reviews: 156
    },
    {
        id: 4,
        name: 'Semovita',
        category: 'grains',
        originalPrice: 28000,
        discountPrice: 22000,
        discount: 21,
        image: '🌾',
        description: '50kg bag, premium semovita flour',
        unit: '50kg bag',
        stock: 30,
        rating: 4.5,
        reviews: 134
    },

    // Garri
    {
        id: 5,
        name: 'Premium Garri (Ijebu)',
        category: 'garri',
        originalPrice: 45000,
        discountPrice: 35000,
        discount: 22,
        image: '🌽',
        description: '50kg bag, smooth Ijebu garri',
        unit: '50kg bag',
        stock: 60,
        rating: 4.9,
        reviews: 312
    },
    {
        id: 6,
        name: 'White Garri',
        category: 'garri',
        originalPrice: 40000,
        discountPrice: 32000,
        discount: 20,
        image: '🌽',
        description: '50kg bag, high-quality white garri',
        unit: '50kg bag',
        stock: 45,
        rating: 4.5,
        reviews: 178
    },
    {
        id: 7,
        name: 'Yellow Garri',
        category: 'garri',
        originalPrice: 48000,
        discountPrice: 38000,
        discount: 21,
        image: '🌽',
        description: '50kg bag, premium yellow garri',
        unit: '50kg bag',
        stock: 35,
        rating: 4.8,
        reviews: 201
    },

    // Beans
    {
        id: 8,
        name: 'Brown Beans (Oloyin)',
        category: 'beans',
        originalPrice: 75000,
        discountPrice: 60000,
        discount: 20,
        image: '🫘',
        description: '50kg bag, premium brown beans',
        unit: '50kg bag',
        stock: 40,
        rating: 4.7,
        reviews: 167
    },
    {
        id: 9,
        name: 'White Beans',
        category: 'beans',
        originalPrice: 70000,
        discountPrice: 56000,
        discount: 20,
        image: '🫘',
        description: '50kg bag, high-quality white beans',
        unit: '50kg bag',
        stock: 35,
        rating: 4.5,
        reviews: 143
    },
    {
        id: 10,
        name: 'Honey Beans',
        category: 'beans',
        originalPrice: 80000,
        discountPrice: 65000,
        discount: 19,
        image: '🫘',
        description: '50kg bag, premium honey beans',
        unit: '50kg bag',
        stock: 25,
        rating: 4.9,
        reviews: 198
    },

    // Oils
    {
        id: 11,
        name: 'Groundnut Oil',
        category: 'oils',
        originalPrice: 35000,
        discountPrice: 28000,
        discount: 20,
        image: '🫒',
        description: '5 liters, pure groundnut oil',
        unit: '5 liters',
        stock: 30,
        rating: 4.6,
        reviews: 134
    },
    {
        id: 12,
        name: 'Palm Oil',
        category: 'oils',
        originalPrice: 32000,
        discountPrice: 25000,
        discount: 22,
        image: '🌴',
        description: '5 liters, organic palm oil',
        unit: '5 liters',
        stock: 28,
        rating: 4.5,
        reviews: 112
    },

    // Others
    {
        id: 13,
        name: 'Salt (Industrial)',
        category: 'others',
        originalPrice: 15000,
        discountPrice: 12000,
        discount: 20,
        image: '🧂',
        description: '50kg bag, industrial salt',
        unit: '50kg bag',
        stock: 50,
        rating: 4.4,
        reviews: 89
    },
    {
        id: 14,
        name: 'Sugar',
        category: 'others',
        originalPrice: 85000,
        discountPrice: 68000,
        discount: 20,
        image: '🍬',
        description: '50kg bag, refined sugar',
        unit: '50kg bag',
        stock: 30,
        rating: 4.6,
        reviews: 156
    },
    {
        id: 15,
        name: 'Spaghetti / Pasta',
        category: 'others',
        originalPrice: 22000,
        discountPrice: 17000,
        discount: 23,
        image: '🍝',
        description: 'Carton of 12 packs, premium pasta',
        unit: 'carton (12 packs)',
        stock: 40,
        rating: 4.3,
        reviews: 98
    }
];

export const categories = [
    { id: 'all', label: 'All', icon: '📦' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'garri', label: 'Garri', icon: '🌽' },
    { id: 'beans', label: 'Beans', icon: '🫘' },
    { id: 'oils', label: 'Oils', icon: '🫒' },
    { id: 'others', label: 'Others', icon: '🧂' }
];