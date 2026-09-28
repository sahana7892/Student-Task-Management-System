const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Get registered student
    const savedStudent = localStorage.getItem("student");

    // Check whether a student is registered
    if (!savedStudent) {
        loginMessage.textContent = "No student account found. Please register first.";
        loginMessage.style.color = "red";
        return;
    }

    const student = JSON.parse(savedStudent);

    // Validate email
    if (email === "") {
        loginMessage.textContent = "Please enter your email.";
        loginMessage.style.color = "red";
        return;
    }

    // Validate password
    if (password === "") {
        loginMessage.textContent = "Please enter your password.";
        loginMessage.style.color = "red";
        return;
    }

    // Check credentials
    if (email !== student.email || password !== student.password) {
        loginMessage.textContent = "Invalid email or password.";
        loginMessage.style.color = "red";
        return;
    }

    // Login successful
    loginMessage.textContent = "Login successful!";
    loginMessage.style.color = "green";

    // Save login status
    localStorage.setItem("loggedIn", "true");

    // Redirect to dashboard
    setTimeout(function() {
        window.location.href = "dashboard.html";
    }, 1000);
});