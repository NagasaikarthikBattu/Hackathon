document.addEventListener('DOMContentLoaded', async () => {
    const itemsGrid = document.getElementById('browse-items-grid');
    const noResultsDiv = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const conditionFilter = document.getElementById('condition-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    let allItems = [];

    const fetchItems = async () => {
        try {
            const response = await fetch('data/items.json');
            if (!response.ok) throw new Error('Network response was not ok');
            allItems = await response.json();
            displayItems(allItems);
        } catch (error) {
            console.error('Failed to load items:', error);
            itemsGrid.innerHTML = '<p class="text-red-500 col-span-full">Could not load items.</p>';
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('data/categories.json');
            const categories = await response.json();
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const displayItems = (items) => {
        if (items.length === 0) {
            itemsGrid.innerHTML = '';
            noResultsDiv.classList.remove('hidden');
        } else {
            noResultsDiv.classList.add('hidden');
            itemsGrid.innerHTML = items.map(item => `
                <a href="item_detail.html?id=${item.id}" class="item-card bg-white rounded-lg shadow-md overflow-hidden block group">
                    <div class="overflow-hidden h-64">
                        <img src="${item.images[0]}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-lg truncate">${item.title}</h3>
                        <p class="text-sm text-gray-500">${item.category}</p>
                        <div class="mt-2 flex justify-between items-center">
                            <span class="text-green-600 font-bold">${item.points ? `${item.points} Points` : 'Swap Only'}</span>
                            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${item.condition}</span>
                        </div>
                    </div>
                </a>
            `).join('');
        }
    };

    const filterAndSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedCondition = conditionFilter.value;

        const filteredItems = allItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
            return matchesSearch && matchesCategory && matchesCondition;
        });

        displayItems(filteredItems);
    };

    await fetchCategories();
    await fetchItems();

    searchInput.addEventListener('input', filterAndSearch);
    categoryFilter.addEventListener('change', filterAndSearch);
    conditionFilter.addEventListener('change', filterAndSearch);
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = 'all';
        conditionFilter.value = 'all';
        filterAndSearch();
    });
});
