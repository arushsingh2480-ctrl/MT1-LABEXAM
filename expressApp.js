import express from "express";

const app = express();
const PORT = 4000;

// JSON body parse karne ke liye middleware
app.use(express.json());

// Sample data (minimum 3 tasks)
let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
  { id: 2, taskName: "Design Database Schema", assignedTo: "Priya Singh", status: "In Progress", priority: "Medium" },
  { id: 3, taskName: "Write Test Cases", assignedTo: "Amit Kumar", status: "Completed", priority: "Low" },
];

// GET /tasks - saare tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - ek task
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
});

// POST /tasks - naya task
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (!id || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "All fields are required: id, taskName, assignedTo, status, priority",
    });
  }

  if (tasks.some((t) => t.id === id)) {
    return res.status(400).json({ message: "Task with this ID already exists" });
  }

  const newTask = { id, taskName, assignedTo, status, priority };
  tasks.push(newTask);

  res.status(201).json({ message: "Task added successfully", task: newTask });
});

// PUT /tasks/:id - task update
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "All fields are required: taskName, assignedTo, status, priority",
    });
  }

  tasks[index] = { id, taskName, assignedTo, status, priority };
  res.status(200).json({ message: "Task updated successfully", task: tasks[index] });
});

// DELETE /tasks/:id - task delete
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
});

// Invalid routes ke liye
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});