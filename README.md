# 🌳 JSON Tree Visualizer

An interactive **JSON Tree Visualizer** built using **React Flow**, designed to help you explore, understand, and visualize complex JSON structures with an intuitive graph interface.  
This project provides **real-time tree generation**, **path-based node highlighting**, **dark mode support**, and **export as image** functionality — all packed in a responsive UI.

---

## 🚀 Features

- 🧩 **Real-Time Tree Generation**  
  Parse any JSON input and instantly visualize it as an interactive tree.

- 🔍 **Path Search & Highlighting**  
  Search for any key or value using a JSON path (e.g., `$.user.name`) and auto-highlight the node.

- 🌗 **Dark & Light Mode**  
  Toggle between elegant light and dark modes seamlessly.

- 📤 **Export as Image**  
  Download the current JSON visualization as a PNG image.

- 📱 **Responsive Sidebar & Header**  
  Easily switch between tree view and JSON editor, optimized for mobile and desktop.

- ⚡ **Smooth Animations & Clean UI**  
  Built with React Flow and TailwindCSS for a minimal and modern interface.

---

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | React (Vite) |
| **Visualization Library** | React Flow |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Logic** | JavaScript (ES6) |
| **State Management** | React Hooks (`useState`, `useEffect`, `useCallback`) |

---

## 📂 Project Structure


```bash
src/
│
├── components/
│   ├── JSONTreeVisualizerContent.jsx   # Main visualizer logic
│   ├── FlowCanvas.jsx                  # Canvas with React Flow
│   ├── CustomNode.jsx                  # Node design and copy logic
│   ├── Sidebar.jsx                     # Input, controls, search panel
│   ├── Header.jsx                      # Top bar with mode & menu toggle
│
├── utils/
│   ├── jsonUtils.js                    # JSON parsing and tree building
│   ├── canvasExporter.js               # Export visualization as PNG
│
├── index.css                           # Tailwind base styles
└── main.jsx                            # Entry point

```
---


---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/harish-pasupuleti/JSONTreeVisualizer.git

# Navigate into the project folder
cd JSONTreeVisualizer

# Install dependencies
npm install

# Start the development server
npm run dev
```
---
## 🎯 Usage Guide

- **Paste JSON** in the sidebar text area.  
- Click **"Generate Tree"** to visualize.  
- Use the **Search Path** field (example: `$.user.name`) to locate specific nodes.  
- Toggle between **Dark / Light Mode** using the header switch.  
- Click **Download** to export the tree as a **PNG image**.  
- On small screens, tap the **menu icon** to open or close the sidebar.  

---

## 🧠 Key Implementation Highlights

### 🟩 Custom Node Rendering
Each node is **color-coded by type** — key, value, object, array — with **smooth animations** and **copy-to-clipboard path support**.

### 🟦 Canvas Export Logic
A custom algorithm using `getRectOfNodes()` and `CanvasRenderingContext2D` ensures the **entire tree (including edges, nodes, and colors)** is accurately captured in exported images.

### 🟨 Responsive UI Design
The **sidebar automatically collapses on mobile**, overlaying a **transparent black background** for focus on controls.

### 🟥 Error Resilience
Invalid JSON automatically **clears visualization** and provides **user-friendly error feedback**.

---

## 💾 Example JSON

```json
{
  "user": {
    "id": 1,
    "name": "Harish",
    "address": {
      "city": "Vizag",
      "country": "India"
    },
    "skills": ["React", "Node.js", "MongoDB"]
  }
}
```