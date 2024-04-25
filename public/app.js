document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('itemForm');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const itemList = document.getElementById('itemList');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const description = descriptionInput.value;
        try {
            await addItem({ name, description });
            nameInput.value = '';
            descriptionInput.value = '';
            await displayItems();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    });

    const addItem = async (item) => {
        try {
            const response = await fetch('http://localhost:3000/item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (!response.ok) {
                throw new Error('Failed to add item');
            }
        } catch (error) {
            throw new Error('Failed to add item: ' + error.message);
        }
    };

    const displayItems = async () => {
        try {
            itemList.innerHTML = '';
            const response = await fetch('http://localhost:3000/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const items = await response.json();
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.name}</strong>: ${item.description} <button class="delete" data-id="${item.id}">Delete</button>`;
                itemList.appendChild(li);
            });
        } catch (error) {
            console.error('Error displaying items:', error);
        }
    };

    itemList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete')) {
            const itemId = e.target.dataset.id;
            try {
                await deleteItem(itemId);
                await displayItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    });

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            throw new Error('Failed to delete item: ' + error.message);
        }
    };

    displayItems();
});
