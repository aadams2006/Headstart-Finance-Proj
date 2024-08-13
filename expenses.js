document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    const sortBySelect = document.getElementById('sort-by');
    
    let expenses = [];

    function renderExpenses() {
        expenseList.innerHTML = '';
        const sortedExpenses = sortExpenses([...expenses]);
        sortedExpenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="expense-box">
                    <div class="expense-info">
                        <span class="expense-description">${expense.description}</span><br>
                        <span class="expense-category">${expense.category}</span> - 
                        <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                    </div>
                    <div class="remove-btn-container">
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            expenseList.appendChild(li);
        });
        calculateTotal();
    }

    function calculateTotal() {
        const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
        totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
    }

    function sortExpenses(expenses) {
        const sortBy = sortBySelect.value;
        return expenses.sort((a, b) => {
            if (sortBy === 'amount') {
                return a.amount - b.amount;
            } else if (sortBy === 'category') {
                return a.category.localeCompare(b.category);
            } else {
                return a.description.localeCompare(b.description);
            }
        });
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        if (description && amount) {
            expenses.push({ description, amount, category });
            renderExpenses();
            expenseForm.reset();
        }
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.dataset.index;
            expenses.splice(index, 1);
            renderExpenses();
        }
    });

    sortBySelect.addEventListener('change', renderExpenses);

    renderExpenses();
});

