document.addEventListener("DOMContentLoaded", () => {
    const spreadsheet = document.getElementById("spreadsheet");
    let isMouseDown = false;
    let startCell = null;
    let endCell = null;

    // Function to create the spreadsheet
    function createSpreadsheet(rows = 20, cols = 20) {
        spreadsheet.innerHTML = ""; // Clear existing cells
        spreadsheet.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; // Auto-adjust columns

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = document.createElement("input");
                cell.type = "text";
                cell.className = "cell";
                cell.dataset.row = i;
                cell.dataset.col = j;
                spreadsheet.appendChild(cell);
            }
        }
    }

    // Function to adjust the spreadsheet size dynamically
    function adjustSpreadsheetSize() {
        let containerWidth = spreadsheet.parentElement.clientWidth;
        let cellSize = 100; // Default cell width
        let columns = Math.floor(containerWidth / cellSize);
        createSpreadsheet(20, columns);
    }

    // Function to find and replace text in the spreadsheet
    function findAndReplace() {
        let findText = document.getElementById("findText").value;
        let replaceText = document.getElementById("replaceText").value;
        document.querySelectorAll(".cell").forEach(cell => {
            if (cell.value.includes(findText)) {
                cell.value = cell.value.replace(new RegExp(findText, 'g'), replaceText);
            }
        });
    }

    // Function to remove duplicate values in the spreadsheet
    function removeDuplicates() {
        let seen = new Set();
        document.querySelectorAll(".cell").forEach(cell => {
            if (seen.has(cell.value)) {
                cell.value = "";
            } else {
                seen.add(cell.value);
            }
        });
    }

    // Function to save spreadsheet data to MongoDB
    async function saveSpreadsheet() {
        let data = Array.from({ length: 20 }, () => Array(20).fill("")); // 2D array

        document.querySelectorAll(".cell").forEach(cell => {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            data[row][col] = cell.value;
        });

        console.log("📤 Saving Data:", data); // Debugging

        try {
            let response = await fetch("http://127.0.0.1:5000/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "MySheet", data })
            });

            let result = await response.json();
            console.log("✅ Save Response:", result);
            alert("Spreadsheet saved successfully!");
        } catch (error) {
            console.error("❌ Error saving data:", error);
            alert("Failed to save spreadsheet.");
        }
    }

    // Function to load spreadsheet data from MongoDB
    async function loadSpreadsheet() {
        try {
            let response = await fetch("http://127.0.0.1:5000/load/MySheet");
            if (!response.ok) throw new Error("Spreadsheet not found");

            let { data } = await response.json();
            console.log("📥 Loading Data:", data); // Debugging

            document.querySelectorAll(".cell").forEach(cell => {
                let row = parseInt(cell.dataset.row);
                let col = parseInt(cell.dataset.col);
                cell.value = data[row]?.[col] || ""; // Avoid undefined errors
            });

            alert("Spreadsheet loaded successfully!");
        } catch (error) {
            console.error("❌ Error loading data:", error);
            alert("Failed to load spreadsheet.");
        }
    }

    // Function to clear previous selection
    function clearSelection() {
        document.querySelectorAll(".cell.selected").forEach(cell => {
            cell.classList.remove("selected");
        });
    }

    // Function to select a range of cells during dragging
    function selectRange(start, end) {
        clearSelection();
        let startRow = parseInt(start.dataset.row);
        let startCol = parseInt(start.dataset.col);
        let endRow = parseInt(end.dataset.row);
        let endCol = parseInt(end.dataset.col);

        let minRow = Math.min(startRow, endRow);
        let maxRow = Math.max(startRow, endRow);
        let minCol = Math.min(startCol, endCol);
        let maxCol = Math.max(startCol, endCol);

        document.querySelectorAll(".cell").forEach(cell => {
            let cellRow = parseInt(cell.dataset.row);
            let cellCol = parseInt(cell.dataset.col);
            if (cellRow >= minRow && cellRow <= maxRow && cellCol >= minCol && cellCol <= maxCol) {
                cell.classList.add("selected");
            }
        });
    }

    // Function to calculate sum, average, min, max, count
    function calculate(operation) {
        let selectedCells = document.querySelectorAll(".cell.selected");
        let values = [];

        selectedCells.forEach(cell => {
            let num = parseFloat(cell.value.trim());
            if (!isNaN(num)) values.push(num);
        });

        if (values.length === 0) {
            alert("No numeric values selected!");
            return;
        }

        let result;
        switch (operation) {
            case "sum":
                result = values.reduce((a, b) => a + b, 0);
                break;
            case "average":
                result = values.reduce((a, b) => a + b, 0) / values.length;
                break;
            case "max":
                result = Math.max(...values);
                break;
            case "min":
                result = Math.min(...values);
                break;
            case "count":
                result = values.length;
                break;
            default:
                alert("Invalid operation!");
                return;
        }

        console.log(`${operation.toUpperCase()}: ${result}`);
        alert(`${operation.toUpperCase()}: ${result}`);
    }

    // Expose functions globally
    window.findAndReplace = findAndReplace;
    window.removeDuplicates = removeDuplicates;
    window.saveSpreadsheet = saveSpreadsheet;
    window.loadSpreadsheet = loadSpreadsheet;
    window.calculate = calculate;

    // Event delegation for efficient event handling
    spreadsheet.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("cell")) {
            isMouseDown = true;
            startCell = event.target;
            clearSelection();
            event.target.classList.add("selected");
        }
    });

    spreadsheet.addEventListener("mouseover", (event) => {
        if (isMouseDown && event.target.classList.contains("cell")) {
            endCell = event.target;
            selectRange(startCell, endCell);
        }
    });

    document.addEventListener("mouseup", () => {
        isMouseDown = false;
    });

    // Adjust spreadsheet size when window resizes
    window.addEventListener("resize", adjustSpreadsheetSize);

    // Initial setup
    adjustSpreadsheetSize();
});
