document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
  
    // Fetch and display tasks
    const fetchTasks = async () => {
      const response = await fetch("/tasks");
      const tasks = await response.json();
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${task.title}</strong> - ${task.description} [${task.status}]
          <button data-id="${task.id}" class="delete-btn">Delete</button>
          <button data-id="${task.id}" class="update-btn">Update</button>
        `;
        taskList.appendChild(li);
      });
    };
  
    // Add new task
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const status = document.getElementById("status").value;
      await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });
      taskForm.reset();
      fetchTasks();
    });
  
    // Delete or Update tasks
    taskList.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        await fetch(`/tasks/${id}`, { method: "DELETE" });
        fetchTasks();
      } else if (e.target.classList.contains("update-btn")) {
        const id = e.target.dataset.id;
        const newStatus = prompt("Enter new status (Pending, In Progress, Completed):");
        if (newStatus) {
          await fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });
          fetchTasks();
        }
      }
    });
  
    fetchTasks();
  });
  