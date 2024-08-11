// const budgets = JSON.parse(localStorage.getItem("budgets")) || [];

const budgets = [
 {
    id: 1,
    name:"asdfasf",
    amount: 123,
    date: new Date(),
    type: 'weekly'
 }

];

const formatter = new Intl.NumberFormat('en-US', {
    style:'currency',
    currency: 'USD',
    signDisplay : 'always'
})
const list = document.getElementById("budgetList");
const form = document.getElementById("budgetForm");
const status = document.getElementById("status");
const weekly = document.getElementById("weekly");
const monthly = document.getElementById("monthly");
const yearly = document.getElementById("yearly");


form.addEventListener('submit', addBudget);

function updateAll(){
    const weeklyTotal = budgets.filter(trx => trx.type === 'weekly')
    .reduce((total, trx) => total + trx.amount, 0);
    const monthlyTotal = budgets.filter(trx => trx.type === 'monthly')
    .reduce((total, trx) => total + trx.amount, 0);
    const yearlyTotal = budgets.filter(trx => trx.type === 'yearly')
    .reduce((total, trx) => total + trx.amount, 0);

    weekly.textContent = formatter.format(weeklyTotal); 
    monthly.textContent = formatter.format(monthlyTotal); 
    yearly.textContent = formatter.format(yearlyTotal); 
}

function renderList(){
    list.innerHTML = "";

    if(budgets.length === 0){
        status.textContent = "No budgets.";
        return;
    }else{
        status.textContent = "";
    }
    budgets.forEach(({id, name, amount, date, type}) => {
        const li = document.createElement("li");

        li.innerHTML = `
        <div class="name">
            <h4>${name} (${type})</h4>
            <p>${date.toLocaleDateString()} </p>
        </div>

        <div class="amount ${type}">
            <span>${formatter.format(amount)} </span>
        </div>
        <div class="action">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="deleteBudget(${id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
        `;
        list.appendChild(li);
    });

}
renderList();
updateAll();

function deleteBudget(id){
    const index = budgets.findIndex((trx)  => trx.id === id);
    budgets.splice(index,1);

    updateAll();
    saveBudgets()
    renderList();
    
}

function addBudget(e){
    e.preventDefault();
    const formData = new FormData(this);
    
    budgets.push({
        id:budgets.length + 1,
        name: formData.get("name"),
        amount : parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: formData.get("type"),
    });
 
  this.reset();
  updateAll();
  saveBudgets();
  renderList();
  
}
function saveBudgets(){
    budgets.sort((a,b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem("budgets", JSON.stringify(budgets));
}

//{budget.name}: ${formatter.format(budget.amount)} ${budget.date.toLocaleDateString()} (${budget.type})`;
//
        