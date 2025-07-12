document.addEventListener('DOMContentLoaded', () => {
    const featuredItemsGrid = document.getElementById('featured-items-grid');
    const categoriesGrid = document.getElementById('categories-grid');

    const loadFeaturedItems = async () => {
        try {
            const response = await fetch('data/items.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            
            const featuredItems = items.slice(0, 4); // Display first 4 as featured
            
            featuredItemsGrid.innerHTML = featuredItems.map(item => `
                <a href="item_detail.html?id=${item.id}" class="item-card bg-white rounded-lg shadow-md overflow-hidden block group">
                    <div class="overflow-hidden h-64">
                        <img src="${item.images[0]}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-lg truncate">${item.title}</h3>
                        <p class="text-sm text-gray-500">${item.category}</p>
                        <div class="mt-2 text-green-600 font-bold">${item.points ? `${item.points} Points` : 'Swap Only'}</div>
                    </div>
                </a>
            `).join('');

        } catch (error) {
            console.error('Failed to load featured items:', error);
            featuredItemsGrid.innerHTML = '<p class="text-red-500 col-span-full">Could not load featured items.</p>';
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const categories = await response.json();
            
            categoriesGrid.innerHTML = categories.map(category => `
                <a href="browse.html?category=${encodeURIComponent(category.name)}" class="category-card bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center border-2 border-transparent hover:border-[#4CAF50] transition duration-300">
                    <div class="mb-2 text-[#4CAF50]">${category.icon}</div>
                    <h4 class="font-semibold text-gray-800">${category.name}</h4>
                </a>
            `).join('');
            lucide.createIcons();
        } catch (error) {
             console.error('Failed to load categories:', error);
            categoriesGrid.innerHTML = '<p class="text-red-500 col-span-full">Could not load categories.</p>';
        }
    };

    if (featuredItemsGrid) {
        loadFeaturedItems();
    }
    if (categoriesGrid) {
        loadCategories();
    }
});
