document.addEventListener('DOMContentLoaded', () => {
    const sessionRaw = localStorage.getItem('opulusSession');
    let session = null;
    try {
        session = sessionRaw ? JSON.parse(sessionRaw) : null;
    } catch (error) {
        console.error('Unable to parse session data', error);
    }

    if (!session || !session.email) {
        // If there is no valid session redirect back to login.
        window.location.replace('login.html');
        return;
    }

    const storageKey = `opulusExpenses:${session.email}`;
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    const totalCountDisplay = document.getElementById('expense-count');
    const topCategoryDisplay = document.getElementById('top-category');
    const sortBySelect = document.getElementById('sort-by');

    let expenses = [];

    try {
        const storedExpenses = localStorage.getItem(storageKey);
        expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    } catch (error) {
        console.error('Unable to parse stored expenses', error);
        expenses = [];
    }

    const ensureIds = () => {
        let updated = false;
        expenses = expenses.map((expense) => {
            if (expense.id) {
                return expense;
            }
            updated = true;
            return { ...expense, id: generateId() };
        });
        if (updated) {
            persistExpenses();
        }
    };

    function persistExpenses() {
        localStorage.setItem(storageKey, JSON.stringify(expenses));
    }

    function generateId() {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    function formatCategory(category) {
        if (!category) {
            return 'Other';
        }
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        const sortedExpenses = sortExpenses([...expenses]);

        if (sortedExpenses.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No expenses logged yet. Start by adding your latest purchase.';
            expenseList.appendChild(emptyState);
            updateSummary();
            return;
        }

        sortedExpenses.forEach((expense) => {
            const item = document.createElement('li');
            item.className = 'expense-item';
            item.innerHTML = `
                <div class="expense-item__details">
                    <span class="expense-item__description">${expense.description}</span>
                    <span class="expense-item__meta">${formatCurrency(expense.amount)} · ${formatCategory(expense.category)}</span>
                </div>
                <button class="remove-btn" data-id="${expense.id}" aria-label="Remove ${expense.description}">Remove</button>
            `;
            expenseList.appendChild(item);
        });

        updateSummary();
    }

    function updateSummary() {
        const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        totalAmountDisplay.textContent = formatCurrency(totalAmount);
        totalCountDisplay.textContent = expenses.length;

        if (expenses.length === 0) {
            topCategoryDisplay.textContent = '–';
            return;
        }

        const categoryCounts = expenses.reduce((acc, expense) => {
            const key = expense.category || 'other';
            acc[key] = (acc[key] || 0) + Number(expense.amount || 0);
            return acc;
        }, {});

        const [topCategory] = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])[0];
        topCategoryDisplay.textContent = formatCategory(topCategory);
    }

    function sortExpenses(list) {
        const sortBy = sortBySelect.value;
        return list.sort((a, b) => {
            if (sortBy === 'amount') {
                return b.amount - a.amount;
            }
            if (sortBy === 'category') {
                return a.category.localeCompare(b.category);
            }
            if (sortBy === 'createdAt') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return a.description.localeCompare(b.description);
        });
    }

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (!description || Number.isNaN(amount)) {
            return;
        }

        expenses.push({
            description,
            amount,
            category,
            createdAt: new Date().toISOString(),
            id: generateId()
        });

        persistExpenses();
        renderExpenses();
        expenseForm.reset();
        document.getElementById('description').focus();
    });

    expenseList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('remove-btn')) {
            const { id } = target.dataset;
            if (!id) {
                return;
            }
            expenses = expenses.filter((expense) => expense.id !== id);
            persistExpenses();
            renderExpenses();
        }
    });

    sortBySelect.addEventListener('change', renderExpenses);

    ensureIds();
    renderExpenses();
});
