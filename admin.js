document.addEventListener('DOMContentLoaded', async () => {
    const tabs = document.querySelectorAll('.admin-tab-link');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const pageTitle = document.getElementById('page-title');

    const usersTableBody = document.getElementById('users-table-body');
    const listingsTableBody = document.getElementById('listings-table-body');

    lucide.createIcons();

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => {
                t.classList.remove('active-tab');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active-tab');
            tab.setAttribute('aria-selected', 'true');

            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            document.getElementById(`${target}-tab`).classList.remove('hidden');
            pageTitle.textContent = tab.textContent.trim();
        });
    });

    const handleUserAction = (e) => {
        e.preventDefault();
        const action = e.target.textContent.toLowerCase();
        const userRow = e.target.closest('tr');
        const userName = userRow.querySelector('.font-medium').textContent;

        if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete user ${userName}?`)) {
                userRow.remove();
                window.showToast(`User ${userName} deleted.`, 'success');
            }
        } else if (action === 'suspend') {
            if (window.confirm(`Are you sure you want to suspend user ${userName}?`)) {
                userRow.style.opacity = '0.5';
                userRow.style.pointerEvents = 'none';
                 window.showToast(`User ${userName} suspended.`, 'info');
            }
        }
    };

    const handleListingAction = (e) => {
        e.preventDefault();
        const action = e.target.textContent.toLowerCase();
        const listingRow = e.target.closest('tr');
        const listingName = listingRow.querySelector('.font-medium').textContent;

        if (action === 'remove') {
             if (window.confirm(`Are you sure you want to remove the listing "${listingName}"?`)) {
                listingRow.remove();
                window.showToast(`Listing removed.`, 'success');
            }
        } else if (action === 'review') {
             if (window.confirm(`Mark "${listingName}" as reviewed?`)) {
                window.showToast(`Listing reviewed.`, 'info');
                e.target.style.color = 'gray';
                e.target.textContent = 'Reviewed';
            }
        }
    };
    
    if (usersTableBody) usersTableBody.addEventListener('click', handleUserAction);
    if (listingsTableBody) listingsTableBody.addEventListener('click', handleListingAction);


    const loadUsers = async () => {
        try {
            const res = await fetch('data/users.json');
            const users = await res.json();
            if(!usersTableBody) return;
            usersTableBody.innerHTML = users.map(user => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full" src="${user.avatar}" alt="">
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${user.username}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.joinedDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900">Suspend</a>
                        <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            if(usersTableBody) usersTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-500 py-4">Error loading users.</td></tr>`;
        }
    };

    const loadListings = async () => {
         try {
            const [itemsRes, usersRes] = await Promise.all([
                fetch('data/items.json'),
                fetch('data/users.json')
            ]);
            const items = await itemsRes.json();
            const users = await usersRes.json();
            const usersById = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            if(!listingsTableBody) return;
            listingsTableBody.innerHTML = items.map(item => {
                const uploader = usersById[item.userId];
                return `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <img class="h-10 w-10 rounded-md object-cover" src="${item.images[0]}" alt="">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${item.title}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${uploader ? uploader.username : 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Available
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                            <a href="#" class="text-indigo-600 hover:text-indigo-900">Review</a>
                            <a href="#" class="text-red-600 hover:text-red-900">Remove</a>
                        </td>
                    </tr>
                `
            }).join('');
        } catch (error) {
            if(listingsTableBody) listingsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-4">Error loading listings.</td></tr>`;
        }
    };

    await loadUsers();
    await loadListings();
});
