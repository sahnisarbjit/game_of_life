// Conway's Game of Life
var GOL = function() {
    var timer,                      // setInterval Handle
        currentGeneration = [],     // Generation Currently Shown
        pointsToFlip = [],          // Points to flip in next Generation
        GridSize;                   // Size of initialized Grid

    this.interval = 500;            // Interval for setInterval function
    this.isStart = false;           // To check if game is Start or Stop

    // To count number of neighbours of particular point in grid
    var NoOfLiveNeighbours = function(row, cell) {
        var neighbours = [];
        
        // Checking if there is any cell on left of this cell
        if (cell > 0) {
            neighbours.push(currentGeneration[row][cell - 1]);
            
            // Checking if there is a cell on top of this cell
            // Overall checking if there is any up-left cell
            if (row > 0) {
                neighbours.push(currentGeneration[row - 1][cell - 1]);
            }

            // Checking if there is a cell on bottom of this cell
            // Overall checking if there is any down-left cell
            if (row < GridSize.rows - 1) {
                neighbours.push(currentGeneration[row + 1][cell - 1]);
            }
        }

        // Checking if there is any cell on right of this cell
        if (cell < GridSize.cells - 1) {
            neighbours.push(currentGeneration[row][cell + 1]);
            
            // Checking if there is a cell on top of this cell
            // Overall checking if there is any up-right cell
            if (row > 0) {
                neighbours.push(currentGeneration[row - 1][cell + 1]);
            }

            // Checking if there is a cell on bottom of this cell
            // Overall checking if there is any down-right cell
            if (row < GridSize.rows - 1) {
                neighbours.push(currentGeneration[row + 1][cell + 1]);
            }
        }

        // Checking if there is a cell on top of this cell
        if (row > 0) {
            neighbours.push(currentGeneration[row - 1][cell]);
        }

        // Checking if there is a cell on bottom of this cell
        if (row < GridSize.rows - 1) {
            neighbours.push(currentGeneration[row + 1][cell]);
        }

        // Counting and returning number of Live Neighbours
        var noOfLiveNeighbours = 0;
        for (var i = 0; i < neighbours.length; i++) {
            if (typeof neighbours[i] !== 'undefinded' && neighbours[i]) {
                noOfLiveNeighbours++;
            }
        }
        
        return noOfLiveNeighbours;
    };

    // To initialize grid and button with given seed
    this.init = function(seed) {
        // Checking if seed is not given
        if (typeof seed === 'undefined') {
            return false;
        }
        
        // Checking if seed is given but empty
        if (seed.length <= 0) {
            return false;
        }
        
        // Grid size initialization
        GridSize = {
            rows: seed.length,
            cells: seed[0].length
        };
        
        // Current Generation is the seed given
        currentGeneration = seed;

        // Setting Grid and button
        var div = document.getElementById("golDiv");
        var table = document.createElement("table");
        table.setAttribute("id", "golTable");

        for (var row = 0; row < GridSize.rows; row++) {
            var tableRow = document.createElement("tr");
            for (var cell = 0; cell < GridSize.cells; cell++) {
                var tableCell = document.createElement("td");
                tableCell.setAttribute("id", row + "_" + cell);
                tableCell.setAttribute("class", seed[row][cell] ? "live" : "dead");
                tableRow.appendChild(tableCell);
            }
            table.appendChild(tableRow);
        }
        div.appendChild(table);

        var button = document.createElement("button");
        button.setAttribute("id", "startStopButton");
        button.setAttribute("onclick", "startStop();");
        button.innerHTML = "Start";
        div.appendChild(button);

        // Generating points to flip in next generation
        generateFlipPoints();
    };

    // To start iterations
    this.start = function() {
        clearTimeout(timer);
        timer = setInterval(function() {
            updateDisplay();
        }, this.interval);
        this.isStart = true;
    };

    // To stop iterations
    this.stop = function() {
        clearTimeout(timer);
        this.isStart = false;
    };

    // To clear everything before reinitialize
    this.clear = function() {
        this.stop();
        currentGeneration = [];
        pointsToFlip = [];
        
        var div = document.getElementById("golDiv");
        div.removeChild(document.getElementById("golTable"));
        div.removeChild(document.getElementById("startStopButton"));
    };

    // To update grid over every iteration
    var updateDisplay = function() {
        flipPoints(pointsToFlip);

        for (var row = 0; row < GridSize.rows; row++) {
            for (var cell = 0; cell < GridSize.cells; cell++) {
                var tableCell = document.getElementById(row + "_" + cell);
                tableCell.setAttribute("class", currentGeneration[row][cell] ? "live" : "dead");
            }
        }

        generateFlipPoints();
    };

    // To generate points to flip in next Generation
    var generateFlipPoints = function() {
        pointsToFlip = [];

        for (var row = 0; row < GridSize.rows; row++) {
            for (var cell = 0; cell < GridSize.cells; cell++) {
                var point = currentGeneration[row][cell];
                var liveNeighbours = NoOfLiveNeighbours(row, cell);
                if (point === 1 && (liveNeighbours < 2 || liveNeighbours > 3)) {
                    pointsToFlip.push({
                        row: row,
                        cell: cell
                    });
                }

                if (point === 0 && liveNeighbours === 3) {
                    pointsToFlip.push({
                        row: row,
                        cell: cell
                    });
                }
            }
        }
    };

    // To flip a particular point
    var flipPoint = function(point) {
        var row = point.row;
        var cell = point.cell;
        if (currentGeneration[row][cell]) {
            currentGeneration[row][cell] = 0;
        } else {
            currentGeneration[row][cell] = 1;
        }
    };

    // To flip more than one points
    var flipPoints = function(points) {
        if (points.length > 0) {
            for (var i = 0; i < points.length; i++) {
                flipPoint(pointsToFlip[i]);
            }
        }
    };
};