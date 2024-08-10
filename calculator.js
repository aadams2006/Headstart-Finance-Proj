function calculateTime() {
    // Get values from the input fields
    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const goal = parseFloat(document.getElementById('goal').value);

    // Calculate monthly savings
    const savingsPerMonth = income - expenses;

    // Ensure savings per month is positive
    if (savingsPerMonth <= 0) {
        document.getElementById('result').innerText = "Your expenses are equal to or greater than your income. Saving is not possible.";
        return;
    }

    // Calculate the remaining amount needed to reach the goal
    const remainingAmount = goal - savings;

    if (remainingAmount <= 0) {
        document.getElementById('result').innerText = "Congratulations! You have already achieved your savings goal.";
        return;
    }

    // Calculate the number of months needed to reach the goal
    const months = Math.ceil(remainingAmount / savingsPerMonth);

    // Display the result
    document.getElementById('result').innerText = `It will take you approximately ${months} month(s) to save $${goal}.`;
}
