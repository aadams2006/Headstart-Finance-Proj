(function () {
    const STORAGE_KEY_PREFIX = 'opulusSavings:';
    const sessionRaw = localStorage.getItem('opulusSession');
    let sessionEmail = null;

    try {
        const session = sessionRaw ? JSON.parse(sessionRaw) : null;
        sessionEmail = session && session.email ? session.email : null;
    } catch (error) {
        console.error('Unable to parse session while setting up calculator', error);
    }

    function storageKey() {
        return sessionEmail ? `${STORAGE_KEY_PREFIX}${sessionEmail}` : null;
    }

    function persistScenario(data) {
        const key = storageKey();
        if (!key) {
            return;
        }
        localStorage.setItem(key, JSON.stringify(data));
    }

    function loadScenario() {
        const key = storageKey();
        if (!key) {
            return null;
        }
        const raw = localStorage.getItem(key);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.error('Unable to parse stored savings scenario', error);
            return null;
        }
    }

    function populateForm(values) {
        if (!values) {
            return;
        }
        document.getElementById('income').value = values.income ?? '';
        document.getElementById('expenses').value = values.expenses ?? '';
        document.getElementById('savings').value = values.savings ?? '';
        document.getElementById('goal').value = values.goal ?? '';
        if (values.resultHtml) {
            document.getElementById('result').innerHTML = values.resultHtml;
        }
    }

    window.calculateTimeline = function calculateTimeline() {
        const income = parseFloat(document.getElementById('income').value);
        const expenses = parseFloat(document.getElementById('expenses').value);
        const savings = parseFloat(document.getElementById('savings').value);
        const goal = parseFloat(document.getElementById('goal').value);
        const result = document.getElementById('result');

        if ([income, expenses, savings, goal].some((value) => Number.isNaN(value))) {
            result.textContent = 'Please complete every field to generate your projection.';
            persistScenario({ income, expenses, savings, goal, resultHtml: result.innerHTML });
            return;
        }

        const savingsPerMonth = income - expenses;
        if (savingsPerMonth <= 0) {
            result.textContent = 'Your expenses are equal to or greater than your income. Adjust your plan to unlock monthly savings.';
            persistScenario({ income, expenses, savings, goal, resultHtml: result.innerHTML });
            return;
        }

        const remainingAmount = goal - savings;
        if (remainingAmount <= 0) {
            result.textContent = 'Congratulations! You have already reached this goal. Try setting a higher target or earmark the extra cash for investments.';
            persistScenario({ income, expenses, savings, goal, resultHtml: result.innerHTML });
            return;
        }

        const months = Math.ceil(remainingAmount / savingsPerMonth);
        const years = Math.floor(months / 12);
        const leftoverMonths = months % 12;
        const completionDate = new Date();
        completionDate.setMonth(completionDate.getMonth() + months);

        const formattedDate = completionDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long'
        });

        const timelineSummary = [
            years > 0 ? `${years} year${years === 1 ? '' : 's'}` : null,
            leftoverMonths > 0 ? `${leftoverMonths} month${leftoverMonths === 1 ? '' : 's'}` : null
        ].filter(Boolean).join(' and ');

        const monthlySavingsFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(savingsPerMonth);

        result.innerHTML = `
            <p>You will reach <strong>$${goal.toLocaleString()}</strong> in approximately <strong>${months} month${months === 1 ? '' : 's'}</strong>${timelineSummary ? ` (${timelineSummary})` : ''} if you save <strong>${monthlySavingsFormatted}</strong> each month.</p>
            <p style="margin-top: 12px;">Stay on course and you can celebrate around <strong>${formattedDate}</strong>. Consider boosting contributions to accelerate the plan.</p>
        `;

        persistScenario({
            income,
            expenses,
            savings,
            goal,
            resultHtml: result.innerHTML
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const storedScenario = loadScenario();
        populateForm(storedScenario);
    });
})();
