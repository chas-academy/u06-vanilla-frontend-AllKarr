document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "https://finance-api-1.onrender.com/api/v1"; // <-- Make sure it's defined
    const addBtn = document.getElementById("add-budget");
    const display = document.getElementById("budgets-display");
  
    const getApiKey = () => localStorage.getItem("apiKey");
  
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
        alert("Network error. Try again.");
      }
    };
  
    document.getElementById("search-budgets")?.addEventListener("input", (e) => {
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
      
  
      let summaryVisible = false;

      document.getElementById("summary-budgets")?.addEventListener("click", async () => {
        const box = document.getElementById("summary-output");
      
        if (!summaryVisible) {
          try {
            const res = await fetch(`${API_BASE}/budgets/summary`, {
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
      
        summaryVisible = !summaryVisible;
      });
      
  
    async function fetchBudgetsSorted() {
      try {
        const res = await fetch(`${API_BASE}/budgets?sort=category`, {
          headers: { "x-api-key": getApiKey() },
        });
        const data = await res.json();
        if (res.ok) {
          renderBudgets(data);
        } else {
          alert("Error fetching sorted budgets.");
        }
      } catch {
        alert("Error sorting budgets.");
      }
    }
  
    const renderBudgets = (budgets) => {
      display.innerHTML = "";
      if (!budgets.length) {
        display.innerHTML = "<p>No budgets found.</p>";
        return;
      }
  
      budgets.forEach((b) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          ${b.category} - ${b.limit}kr
          <button class="edit" data-id="${b._id}">Edit</button>
          <button class="delete" data-id="${b._id}">Delete</button>
        `;
        display.appendChild(div);
      });
    };
  
    addBtn.addEventListener("click", async () => {
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
  
    display.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
  
      if (e.target.classList.contains("delete")) {
        await fetch(`${API_BASE}/budgets/${id}`, {
          method: "DELETE",
          headers: { "x-api-key": getApiKey() },
        });
        fetchBudgets();
      }
  
      if (e.target.classList.contains("edit")) {
        const newCategory = prompt("New category:");
        const newLimit = parseFloat(prompt("New limit:"));
  
        if (!newCategory || isNaN(newLimit)) return;
  
        await fetch(`${API_BASE}/budgets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": getApiKey(),
          },
          body: JSON.stringify({ category: newCategory, limit: newLimit }),
        });
        fetchBudgets();
      }
    });
  
    fetchBudgets();
  });
  