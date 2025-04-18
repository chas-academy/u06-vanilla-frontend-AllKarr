if (typeof API_BASE === "undefined") {
    var API_BASE = "https://finance-api-1.onrender.com/api/v1";
  }  

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const welcome = document.getElementById("welcome-msg");

  // Show welcome message if already logged in
  const storedUser = localStorage.getItem("username");
  if (storedUser && welcome) {
    welcome.textContent = `Welcome ${storedUser}!`;
    toggleAuthButtons(true);
  }

  // Helper to toggle button visibility
  function toggleAuthButtons(isLoggedIn) {
    if (isLoggedIn) {
      if (loginBtn) loginBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (registerBtn) registerBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  // Login function
  loginBtn?.addEventListener("click", async () => {
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!username || !password) return alert("Please enter username and password.");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.apiKey) {
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("username", username);
        if (welcome) welcome.textContent = `Welcome ${username}!`;
        toggleAuthButtons(true);
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      alert("Login error.");
    }
  });

  // Register function
  registerBtn?.addEventListener("click", async () => {
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value.trim();
    const email = emailInput?.value.trim();

    if (!username || !password || !email) {
      return alert("Please fill in all fields.");
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();
      if (res.ok && data.apiKey) {
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("username", username);
        if (welcome) welcome.textContent = `Welcome ${username}!`;
        toggleAuthButtons(true);
        alert("Registration successful!");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      alert("Registration error.");
    }
  });

  // Logout function
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("username");
    if (welcome) welcome.textContent = "Finance Manager";
    toggleAuthButtons(false);
    alert("Logged out!");
  });
});
