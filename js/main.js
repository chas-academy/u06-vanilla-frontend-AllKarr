document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "https://finance-api-1.onrender.com/api/v1";
  
    const getApiKey = () => localStorage.getItem("apiKey");
  
    const displayTransaction = document.getElementById("transactions-display");
    const displayBudget = document.getElementById("budgets-display");
  
    // Fetch Transactions
    const fetchTransactions = async () => {
      const apiKey = getApiKey();
      if (!apiKey) return alert("Please login first.");
      try {
        const res = await fetch(`${API_BASE}/transactions`, {
          headers: { "x-api-key": apiKey },
        });
        const data = await res.json();
        if (res.ok) {
          renderTransactions(data);
        } else {
          alert(data.message || "Error fetching transactions.");
        }
      } catch (err) {
        alert("Network error.");
      }
    };
  
    // Fetch Budgets
    const fetchBudgets = async () => {
      const apiKey = getApiKey();
      if (!apiKey) return alert("Please login first.");
      try {
        const res = await fetch(`${API_BASE}/budgets`, {
          headers: { "x-api-key": apiKey },
        });
        const data = await res.json();
        if (res.ok) {
          renderBudgets(data);
        } else {
          alert(data.message || "Error fetching budgets.");
        }
      } catch (err) {
        alert("Network error.");
      }
    };
  
    // Render Transactions
    const renderTransactions = (transactions) => {
        displayTransaction.innerHTML = "";
        if (!transactions.length) {
        displayTransaction.innerHTML = "<p>No transactions found.</p>";
        return;
        }
    
        transactions.forEach((t) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <span>${t.description} - ${t.amount}kr - ${t.category} (${t.type})</span>
            <div class="actions">
            <button class="edit" data-id="${t._id}">Edit</button>
            <button class="delete" data-id="${t._id}">Delete</button>
            </div>
        `;
        displayTransaction.appendChild(div);
        });
    };
  
    // Render Budgets
    const renderBudgets = (budgets) => {
        displayBudget.innerHTML = "";
        if (!budgets.length) {
        displayBudget.innerHTML = "<p>No budgets found.</p>";
        return;
        }
    
        budgets.forEach((b) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <span>${b.category} - ${b.limit}kr</span>
            <div class="actions">
            <button class="edit" data-id="${b._id}">Edit</button>
            <button class="delete" data-id="${b._id}">Delete</button>
            </div>
        `;
        displayBudget.appendChild(div);
        });
    };
  
  
    // Add Transaction
    document.getElementById("add-transaction").addEventListener("click", async () => {
      const description = document.getElementById("description").value.trim();
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value.trim();
      const type = document.getElementById("type").value;
  
      if (!description || isNaN(amount) || !category || !type) {
        return alert("Please fill in all fields correctly.");
      }
  
      const payload = { description, amount, category, type };
  
      try {
        const res = await fetch(`${API_BASE}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": getApiKey(),
          },
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Failed to create transaction");
        } else {
          document.getElementById("description").value = "";
          document.getElementById("amount").value = "";
          document.getElementById("category").value = "";
          fetchTransactions();
        }
      } catch (err) {
        alert("Error creating transaction.");
      }
    });
  
    // Add Budget
    document.getElementById("add-budget").addEventListener("click", async () => {
      const category = document.getElementById("budget-category").value.trim();
      const limit = parseFloat(document.getElementById("budget-limit").value);
  
      if (!category || isNaN(limit)) return alert("Please enter valid inputs.");
  
      try {
        const res = await fetch(`${API_BASE}/budgets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": getApiKey(),
          },
          body: JSON.stringify({ category, limit }),
        });
  
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Failed to add budget");
        } else {
          document.getElementById("budget-category").value = "";
          document.getElementById("budget-limit").value = "";
          fetchBudgets();
        }
      } catch (err) {
        alert("Error creating budget.");
      }
    });
  
    // Transaction Filter
    document.getElementById("search-transactions").addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (!term) return fetchTransactions();
  
      fetch(`${API_BASE}/transactions`, {
        headers: { "x-api-key": getApiKey() },
      })
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((t) =>
            t.category.toLowerCase().includes(term)
          );
          renderTransactions(filtered);
        });
    });
  
    // Budget Filter
    document.getElementById("search-budgets").addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (!term) return fetchBudgets();
  
      fetch(`${API_BASE}/budgets`, {
        headers: { "x-api-key": getApiKey() },
      })
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((b) =>
            b.category.toLowerCase().includes(term)
          );
          renderBudgets(filtered);
        });
    });
  
    // Edit / Delete Transactions
    displayTransaction.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
  
      if (e.target.classList.contains("delete")) {
        if (!confirm("Delete this transaction?")) return;
        await fetch(`${API_BASE}/transactions/${id}`, {
          method: "DELETE",
          headers: { "x-api-key": getApiKey() },
        });
        fetchTransactions();
      }
  
      if (e.target.classList.contains("edit")) {
        const newDescription = prompt("New description:");
        const newAmount = prompt("New amount:");
        const newCategory = prompt("New category:");
        const newType = prompt("New type (income/expense):");
  
        if (!newDescription || isNaN(newAmount) || !newCategory || !newType) {
          return alert("Invalid input.");
        }
  
        await fetch(`${API_BASE}/transactions/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": getApiKey(),
          },
          body: JSON.stringify({
            description: newDescription,
            amount: parseFloat(newAmount),
            category: newCategory,
            type: newType,
          }),
        });
        fetchTransactions();
      }
    });
  
    // Edit / Delete Budgets
    displayBudget.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
  
      if (e.target.classList.contains("delete")) {
        if (!confirm("Delete this budget?")) return;
        await fetch(`${API_BASE}/budgets/${id}`, {
          method: "DELETE",
          headers: { "x-api-key": getApiKey() },
        });
        fetchBudgets();
      }
  
      if (e.target.classList.contains("edit")) {
        const newCategory = prompt("New category:");
        const newLimit = prompt("New limit:");
  
        if (!newCategory || isNaN(newLimit)) {
          return alert("Invalid input.");
        }
  
        await fetch(`${API_BASE}/budgets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": getApiKey(),
          },
          body: JSON.stringify({
            category: newCategory,
            limit: parseFloat(newLimit),
          }),
        });
        fetchBudgets();
      }
    });
  
    // Initial fetches
    fetchTransactions();
    fetchBudgets();
  });
  