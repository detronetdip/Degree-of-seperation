let totalNodes;
let path = [];
let graphList = [];
let visited = [];

function createGraph(n) {
  totalNodes = n;
  for (let index = 0; index < totalNodes; index++) {
    graphList[index] = [];
  }
}
function relation(s, d) {
  graphList[s].push(d);
}
function view(s, d) {
  let test = {
    allPath: [],
  };
  for (let index = 0; index < totalNodes; index++) {
    visited[index] = false;
  }
  path = [];
  path.push(s);
  findOtherPaths(s, d, visited, path, test);
  return test.allPath;
}
function findOtherPaths(s, d, visited, path, allpath) {
  if (s == d) {
    let d = [];
    for (let i = 0; i < path.length; i++) {
      d[i] = path[i];
    }
    allpath.allPath.push(d);
    return;
  }
  visited[s] = true;
  for (let i = 0; i < graphList[s].length; i++) {
    if (!visited[graphList[s][i]]) {
      path.push(graphList[s][i]);
      findOtherPaths(graphList[s][i], d, visited, path, allpath);
      path.splice(path.indexOf(graphList[s][i], 1));
    }
  }
  visited[s] = false;
}

export { createGraph, relation, view};
