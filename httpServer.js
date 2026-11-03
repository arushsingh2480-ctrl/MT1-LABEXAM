import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Modules mein __dirname nahi hota, isliye ye banana padta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory tasks array (database nahi)
const tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
  { id: 2, taskName: "Design Database Schema", assignedTo: "Priya Singh", status: "In Progress" },
  { id: 3, taskName: "Write Test Cases", assignedTo: "Amit Kumar", status: "Completed" },
];

// Helper: JSON response bhejne ke liye
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ---------- GET Routes ----------
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Employee Task Management Application</h1>");
  }

  else if (method === "GET" && url === "/tasks") {
    sendJSON(res, 200, tasks);
  }

  else if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      "Employee Task Management Application - built using Node.js HTTP module to manage employee tasks."
    );
  }

  else if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 - Error reading HTML file");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // ---------- POST /add-task ----------
  else if (method === "POST" && url === "/add-task") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let newTask;
      try {
        newTask = JSON.parse(body);
      } catch (error) {
        return sendJSON(res, 400, { error: "Invalid JSON format" });
      }

      const { id, taskName, assignedTo, status } = newTask;

      // Validation: saare required fields hone chahiye
      if (!id || !taskName || !assignedTo || !status) {
        return sendJSON(res, 400, {
          error: "Missing required fields: id, taskName, assignedTo, status",
        });
      }

      // Duplicate ID check
      if (tasks.some((task) => task.id === id)) {
        return sendJSON(res, 400, { error: "Task with this ID already exists" });
      }

      tasks.push({ id, taskName, assignedTo, status });
      sendJSON(res, 201, {
        message: "Task added successfully",
        task: { id, taskName, assignedTo, status },
      });
    });
  }

  // ---------- 404 for everything else ----------
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Page Not Found</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:3000`);
});