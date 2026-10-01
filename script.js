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


// Get the form and task list
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Create Task
taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get values from the form
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;

    // Validate task title
    if (title === "") {
        alert("Please enter task title.");
        return;
    }

    // Validate description
    if (description === "") {
        alert("Please enter task description.");
        return;
    }

    // Create task object
    const task = {
        title: title,
        description: description,
        priority: priority
    };

    // Save task
    saveTask(task);

    // Clear form
    taskForm.reset();

    // Show success message
    alert("Task created successfully!");
});


// Save Task to Local Storage
function saveTask(task) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}


// Display Tasks
function displayTasks() {

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.innerHTML = "";

    // If there are no tasks
    if (tasks.length === 0) {

        taskList.innerHTML =
            '<div class="empty-message">No tasks available.</div>';

        return;
    }

    // Display every task
    tasks.forEach(function (task, index) {

        const taskDiv = document.createElement("div");

        taskDiv.className = "task";

        taskDiv.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-description">
                    ${task.description}
                </div>

                <div class="priority">
                    Priority: ${task.priority}
                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        taskList.appendChild(taskDiv);
    });
}


// Delete Task
function deleteTask(index) {

    // Confirmation message
    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    // Get existing tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Remove selected task
    tasks.splice(index, 1);

    // Save updated task list
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Update task list
    displayTasks();

    alert("Task deleted successfully!");
}


// Display saved tasks when page opens
displayTasks();
