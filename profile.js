// Check if student is logged in
const loggedIn = localStorage.getItem("loggedIn");
const savedStudent = localStorage.getItem("student");

if (loggedIn !== "true" || !savedStudent) {
    window.location.href = "login.html";
}

let student = JSON.parse(savedStudent);

// DOM Elements
const avatarInitials = document.getElementById("avatarInitials");
const profileHeading = document.getElementById("profileHeading");
const profileSubheading = document.getElementById("profileSubheading");
const displayFullName = document.getElementById("displayFullName");
const displayEmail = document.getElementById("displayEmail");

const editNameInput = document.getElementById("editName");
const editEmailInput = document.getElementById("editEmail");
const editProfileForm = document.getElementById("editProfileForm");
const editMessage = document.getElementById("editMessage");

const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const changePasswordForm = document.getElementById("changePasswordForm");
const passwordMessage = document.getElementById("passwordMessage");

// Helper to get initials
function getInitials(name) {
    if (!name) return "S";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

// AM-12: Load and Display Student Profile Data
function loadStudentProfile() {
    const currentData = localStorage.getItem("student");
    if (currentData) {
        student = JSON.parse(currentData);
    }

    displayFullName.textContent = student.name || "N/A";
    displayEmail.textContent = student.email || "N/A";
    profileSubheading.textContent = student.email || "";
    avatarInitials.textContent = getInitials(student.name);

    editNameInput.value = student.name || "";
    editEmailInput.value = student.email || "";
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    // Deactivate all tab buttons
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

    // Reset messages
    editMessage.textContent = "";
    passwordMessage.textContent = "";

    if (tabName === "view") {
        document.getElementById("viewSection").classList.add("active");
        document.getElementById("tabViewBtn").classList.add("active");
        loadStudentProfile();
    } else if (tabName === "edit") {
        document.getElementById("editSection").classList.add("active");
        document.getElementById("tabEditBtn").classList.add("active");
        editNameInput.value = student.name || "";
        editEmailInput.value = student.email || "";
    } else if (tabName === "password") {
        document.getElementById("passwordSection").classList.add("active");
        document.getElementById("tabPasswordBtn").classList.add("active");
        resetPasswordForm();
    }
}

// AM-10: Edit Student Profile
editProfileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newName = editNameInput.value.trim();
    const newEmail = editEmailInput.value.trim().toLowerCase();

    // Validate Name
    if (newName === "") {
        editMessage.textContent = "Please enter your name.";
        editMessage.style.color = "red";
        return;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail === "") {
        editMessage.textContent = "Please enter your email.";
        editMessage.style.color = "red";
        return;
    }

    if (!emailPattern.test(newEmail)) {
        editMessage.textContent = "Please enter a valid email address.";
        editMessage.style.color = "red";
        return;
    }

    // Update student object
    student.name = newName;
    student.email = newEmail;

    localStorage.setItem("student", JSON.stringify(student));

    editMessage.textContent = "Profile updated successfully!";
    editMessage.style.color = "green";

    // Refresh view and switch back after a short delay
    loadStudentProfile();
    setTimeout(() => {
        switchTab("view");
    }, 1200);
});

// AM-11: Change Password
changePasswordForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    // Verify current password
    if (currentPassword !== student.password) {
        passwordMessage.textContent = "Incorrect current password.";
        passwordMessage.style.color = "red";
        return;
    }

    // Check new password length
    if (newPassword.length < 6) {
        passwordMessage.textContent = "New password must be at least 6 characters.";
        passwordMessage.style.color = "red";
        return;
    }

    // Ensure new password is not identical to current password
    if (newPassword === currentPassword) {
        passwordMessage.textContent = "New password cannot be the same as current password.";
        passwordMessage.style.color = "red";
        return;
    }

    // Check confirm password matches
    if (newPassword !== confirmNewPassword) {
        passwordMessage.textContent = "New passwords do not match.";
        passwordMessage.style.color = "red";
        return;
    }

    // Update password in storage
    student.password = newPassword;
    localStorage.setItem("student", JSON.stringify(student));

    passwordMessage.textContent = "Password changed successfully!";
    passwordMessage.style.color = "green";

    resetPasswordForm();

    setTimeout(() => {
        switchTab("view");
    }, 1500);
});

function resetPasswordForm() {
    changePasswordForm.reset();
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

// Initial load
loadStudentProfile();
