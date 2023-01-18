import React, { useState, useEffect } from "react";

const Maze = () => {
  const [render, setRender] = useState(true);
  const [maze, setMaze] = useState(<div>No maze yet!</div>);

  const n = 41;

  // using randomized kruskal's
  const generateMaze = (dim) => {
    const n = Math.floor((dim + 1) / 2);
    const sz = Array(n * n);
    for (let i = 0; i < n * n; i++) {
      sz[i] = -1;
    }

    const get = (a) => {
      return sz[a] < 0 ? a : (sz[a] = get(sz[a]));
    };

    const unite = (a, b) => {
      a = get(a);
      b = get(b);
      if (a === b) return false;
      if (sz[a] < sz[b]) {
        [a, b] = [b, a];
      }
      sz[b] += sz[a];
      sz[a] = b;
      return true;
    };

    // fisher-yates
    const shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
    };

    const edges = [];
    for (var i = 0; i < n * n; i++) {
      var col = i % n;
      var row = Math.floor((i - col) / n);
      if (row != n - 1) {
        edges.push([
          [row, col],
          [row + 1, col],
        ]);
      }
      if (col != n - 1) {
        edges.push([
          [row, col],
          [row, col + 1],
        ]);
      }
    }
    // console.log(edges);
    shuffle(edges);
    let connectors = [];
    while (connectors.length < n * n - 1) {
      let edge = edges.pop();
      let x = unite(edge[0][0] * n + edge[0][1], edge[1][0] * n + edge[1][1]);
      if (x) {
        let new_connector;
        new_connector = [edge[0][0] + edge[1][0], edge[0][1] + edge[1][1]];
        connectors.push(new_connector);
      }
    }
    return connectors;
  };

  const renderMaze = () => {
    console.log("n", n);
    var connectors = generateMaze(n);
    var maze_container = [];
    for (var i = 0; i < n * n; i++) {
      var col = i % n;
      var row = Math.floor((i - (i % n)) / n);
      let x = false;
      for (var j = 0; j < connectors.length; j++) {
        if (connectors[j][0] === row && connectors[j][1] === col) {
          x = true;
        }
      }
      var maze_cell;
      if (x || (col % 2 === 0 && row % 2 === 0)) {
        maze_cell = (
          <div className="maze-cell white" key={i}>
            {i + 1}
          </div>
        );
      } else {
        maze_cell = (
          <div className="maze-cell black" key={i}>
            {i + 1}
          </div>
        );
      }
      maze_container.push(maze_cell);
    }
    return maze_container;
  };

  useEffect(() => {
    setMaze(renderMaze());
  }, [render]);

  useEffect(() => {
    setMaze(<div>No Maze Yet</div>);
  }, []);

  const toggleMaze = () => {
    setRender(!render);
  };

  return (
    <>
      <div className="maze-container">
        <div className="grid-container">{maze}</div>
      </div>
      <button onClick={toggleMaze} className="toggle-button">
        Re-render Maze
      </button>
    </>
  );
};

export default Maze;
