// const form = document.getElementById("registrationForm");
// const message = document.getElementById("message");

// form.addEventListener("submit", function(event) {

//     event.preventDefault();

//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim().toLowerCase();
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     // Check name
//     if (name === "") {
//         message.textContent = "Please enter your name.";
//         message.style.color = "red";
//         return;
//     }

//     // Check email
//     if (email === "" || !email.includes("@")) {
//         message.textContent = "Please enter a valid email.";
//         message.style.color = "red";
//         return;
//     }

//     // Check password
//     if (password.length < 6) {
//         message.textContent = "Password must be at least 6 characters.";
//         message.style.color = "red";
//         return;
//     }

//     // Check confirm password
//     if (password !== confirmPassword) {
//         message.textContent = "Passwords do not match.";
//         message.style.color = "red";
//         return;
//     }

//     // Create student object
//     const student = {
//         name: name,
//         email: email,
//         password: password
//     };

//     // Save student information
//     localStorage.setItem("student", JSON.stringify(student));

//     message.textContent = "Registration successful!";
//     message.style.color = "green";

//     form.reset();

//     // Go to login page after 1 second
//     setTimeout(function() {
//         window.location.href = "login.html";
//     }, 1000);
// });



const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check name
    if (name === "") {
        message.textContent = "Please enter your name.";
        message.style.color = "red";
        return;
    }

    // Check email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        message.textContent = "Please enter your email.";
        message.style.color = "red";
        return;
    }

    if (!emailPattern.test(email)) {
        message.textContent = "Please enter a valid email, e.g. example@gmail.com";
        message.style.color = "red";
        return;
    }

    // Check password
    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        message.style.color = "red";
        return;
    }

    // Check confirm password
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    }

    // Create student object
    const student = {
        name: name,
        email: email,
        password: password
    };

    // Save student information
    localStorage.setItem("student", JSON.stringify(student));

    message.textContent = "Registration successful!";
    message.style.color = "green";

    form.reset();

    // Go to login page after 1 second
    setTimeout(function() {
        window.location.href = "login.html";
    }, 1000);
});


