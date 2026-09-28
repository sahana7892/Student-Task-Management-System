const forgotForm = document.getElementById("forgotPasswordForm");
const forgotMessage = document.getElementById("forgotMessage");

forgotForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Get saved student
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {

        forgotMessage.textContent =
            "No student account found.";

        forgotMessage.style.color = "red";

        return;
    }

    const student = JSON.parse(savedStudent);

    // Check email
    if (email === "") {

        forgotMessage.textContent =
            "Please enter your email.";

        forgotMessage.style.color = "red";

        return;
    }

    if (email !== student.email) {

        forgotMessage.textContent =
            "Email not found.";

        forgotMessage.style.color = "red";

        return;
    }

    // Check password length
    if (newPassword.length < 6) {

        forgotMessage.textContent =
            "Password must be at least 6 characters.";

        forgotMessage.style.color = "red";

        return;
    }

    // Check passwords
    if (newPassword !== confirmPassword) {

        forgotMessage.textContent =
            "Passwords do not match.";

        forgotMessage.style.color = "red";

        return;
    }

    // Update password
    student.password = newPassword;

    localStorage.setItem(
        "student",
        JSON.stringify(student)
    );

    forgotMessage.textContent =
        "Password reset successfully!";

    forgotMessage.style.color = "green";

    forgotForm.reset();

    // Go to login
    setTimeout(function() {

        window.location.href = "login.html";

    }, 1500);

});