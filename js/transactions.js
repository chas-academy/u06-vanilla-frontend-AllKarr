document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-transaction");
  const display = document.getElementById("transactions-display");

  const getApiKey = () => localStorage.getItem("apiKey");

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

  document.getElementById("sort-transactions")?.addEventListener("change", (e) => {
    e.target.checked ? fetchTransactionsSorted() : fetchTransactions();
  });

  document.getElementById("summary-transactions")?.addEventListener("change", async (e) => {
    const box = document.getElementById("summary-output");
    if (e.target.checked) {
      try {
        const res = await fetch(`${API_BASE}/transactions/average`, {
          headers: { "x-api-key": getApiKey() },
        });
        const data = await res.json();
        box.innerText = JSON.stringify(data, null, 2);
      } catch {
        box.innerText = "Error loading summary.";
      }
    } else {
      box.innerText = "";
    }
  });

  async function fetchTransactionsSorted() {
    try {
      const res = await fetch(`${API_BASE}/transactions?sort=category`, {
        headers: { "x-api-key": getApiKey() },
      });
      const data = await res.json();
      renderTransactions(data);
    } catch {
      alert("Error sorting transactions.");
    }
  }

  const renderTransactions = (transactions) => {
    display.innerHTML = "";
    if (!transactions.length) {
      display.innerHTML = "<p>No transactions found.</p>";
      return;
    }

    transactions.forEach((t) => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        ${t.description} - ${t.amount}kr - ${t.category} (${t.type})
        <button class="edit" data-id="${t._id}">Edit</button>
        <button class="delete" data-id="${t._id}">Delete</button>
      `;
      display.appendChild(div);
    });
  };

  addBtn.addEventListener("click", async () => {
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

  display.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete")) {
      await fetch(`${API_BASE}/transactions/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": getApiKey() },
      });
      fetchTransactions();
    }

    if (e.target.classList.contains("edit")) {
      const newDesc = prompt("New description:");
      const newAmount = parseFloat(prompt("New amount:"));
      const newCategory = prompt("New category:");
      const newType = prompt("Type (expense/income):");

      if (!newDesc || isNaN(newAmount) || !newCategory || !newType) return;

      await fetch(`${API_BASE}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getApiKey(),
        },
        body: JSON.stringify({
          description: newDesc,
          amount: newAmount,
          category: newCategory,
          type: newType,
        }),
      });

      fetchTransactions();
    }
  });

  fetchTransactions();
});
