if (typeof API_BASE === "undefined") {
    var API_BASE = "https://finance-api-1.onrender.com/api/v1";
  }
  
  // 🔧 Gör variablerna till globala
  let usernameInput, passwordInput, emailInput;
  let loginBtn, registerBtn, logoutBtn, welcome;
  
  document.addEventListener("DOMContentLoaded", () => {
    // Tilldela DOM-elementen till de globala variablerna
    usernameInput = document.getElementById("username");
    passwordInput = document.getElementById("password");
    emailInput = document.getElementById("email");
    loginBtn = document.getElementById("login-btn");
    registerBtn = document.getElementById("register-btn");
    logoutBtn = document.getElementById("logout-btn");
    welcome = document.getElementById("welcome-msg");
  
    // Visa welcome-message om redan inloggad
    const storedUser = localStorage.getItem("username");
    const storedApiKey = localStorage.getItem("apiKey");
  
    if (storedUser && storedApiKey) {
      if (welcome) welcome.textContent = `Welcome ${storedUser}!`;
      toggleAuthButtons(true);
    } else {
      toggleAuthButtons(false);
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
          window.location.href = "index.html";
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
      window.location.href = "index.html";
    });
  });
  
  // ✅ Sync login/logout över flera flikar
  window.addEventListener("storage", (event) => {
    if (event.key === "apiKey") {
      const apiKey = localStorage.getItem("apiKey");
      const username = localStorage.getItem("username");
  
      if (apiKey) {
        if (welcome) welcome.textContent = `Welcome ${username}!`;
        toggleAuthButtons(true);
      } else {
        if (welcome) welcome.textContent = "";
        toggleAuthButtons(false);
      }
    }
  });
  
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
  