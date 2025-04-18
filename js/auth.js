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
    const storedApiKey = localStorage.getItem("apiKey");
  
    if (storedUser && storedApiKey) {
      if (welcome) welcome.textContent = `Welcome ${storedUser}!`;
      toggleAuthButtons(true);
    } else {
      toggleAuthButtons(false);
    }
  
    function toggleAuthButtons(isLoggedIn) {
      const headerLeft = document.getElementById("header-left");
      const username = localStorage.getItem("username");
  
      if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (usernameInput) usernameInput.style.display = "none";
        if (passwordInput) passwordInput.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (headerLeft) headerLeft.innerHTML = `Welcome ${username}!`;
      } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (registerBtn) registerBtn.style.display = "inline-block";
        if (usernameInput) usernameInput.style.display = "inline-block";
        if (passwordInput) passwordInput.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (headerLeft) headerLeft.innerHTML = `<a href="index.html" style="text-decoration: none; color: #ffffff;">Finance App</a>`;
      }
    }
  
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
  
    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("apiKey");
      localStorage.removeItem("username");
      toggleAuthButtons(false);
      alert("Logged out!");
    });
  });
  
  // ✅ Sync login/logout across tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "apiKey") {
      const apiKey = localStorage.getItem("apiKey");
      const username = localStorage.getItem("username");
      const welcome = document.getElementById("welcome-msg");
  
      if (apiKey) {
        if (welcome) welcome.textContent = `Welcome ${username}!`;
        toggleAuthButtons(true);
      } else {
        if (welcome) welcome.textContent = "";
        toggleAuthButtons(false);
      }
    }
  });
  