function updateAuthButton() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loginBtns = document.querySelectorAll(".cl-login-btn");

  loginBtns.forEach(btn => {
    if (isLoggedIn) {
      btn.innerHTML = '<i class="bi bi-box-arrow-right"></i> Logout';
      btn.onclick = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
      };
    } else {
      btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> <a class="nav-link" href="login.html">Login</a>';
    }
  });
}

document.addEventListener("DOMContentLoaded", updateAuthButton);