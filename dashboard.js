document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('rewear-user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const profileSummaryContainer = document.getElementById('profile-summary');
    const myListingsGrid = document.getElementById('my-listings-grid');
    const mySwapsGrid = document.getElementById('my-swaps-grid');

    const renderItemCard = (item) => `
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
    `;

    try {
        const [usersRes, itemsRes] = await Promise.all([
            fetch('data/users.json'),
            fetch('data/items.json')
        ]);
        const users = await usersRes.json();
        const allItems = await itemsRes.json();

        const userData = users.find(u => u.id === currentUser.id);
        
        const myItems = allItems.filter(item => item.userId === currentUser.id);

        const swappedItems = allItems.filter(item => item.userId !== currentUser.id).slice(0, 2);


        if (profileSummaryContainer) {
            profileSummaryContainer.innerHTML = `
                <img src="https://i.pravatar.cc/100?u=${currentUser.id}" alt="User Avatar" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                <div class="flex-grow">
                    <h2 class="text-3xl font-bold">${userData.username}</h2>
                    <p class="text-gray-500">${userData.email}</p>
                    <p class="text-gray-500">Joined: ${userData.joinedDate}</p>
                </div>
                <div class="flex gap-8 text-center">
                    <div>
                        <p class="text-3xl font-bold text-[#4CAF50]">${userData.points}</p>
                        <p class="text-gray-500">Points</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold text-[#4CAF50]">${myItems.length}</p>
                        <p class="text-gray-500">Items Listed</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold text-[#4CAF50]">${swappedItems.length}</p>
                        <p class="text-gray-500">Items Swapped</p>
                    </div>
                </div>
            `;
        }

        if (myListingsGrid) {
            if (myItems.length > 0) {
                myListingsGrid.innerHTML = myItems.map(renderItemCard).join('');
            } else {
                myListingsGrid.innerHTML = `<p class="text-gray-500 col-span-full">You haven't listed any items yet.</p>`;
            }
        }

        if (mySwapsGrid) {
             if (swappedItems.length > 0) {
                mySwapsGrid.innerHTML = swappedItems.map(renderItemCard).join('');
            } else {
                mySwapsGrid.innerHTML = `<p class="text-gray-500 col-span-full">You have no swap history yet.</p>`;
            }
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if(profileSummaryContainer) profileSummaryContainer.innerHTML = '<p class="text-red-500 w-full text-center">Could not load profile data.</p>';
    }
});
