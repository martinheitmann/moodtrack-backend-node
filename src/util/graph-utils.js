/**
 * Search function for finding nodes connected to the root node in
 * a directed graph.
 * @param {*} root
 * @param {*} nodes
 * @param {*} edges
 * @returns All nodes connected to the argument root node.
 */
module.exports.depthFirstSearch = function (root, nodes, edges) {
  if (!root) throw new Error("Cannot perform a DFS without a root node.");
  console.log(
    "Running DFS with + " +
      nodes.length +
      " nodes and " +
      edges.length +
      " edges."
  );
  const visited = [];
  const stack = [];
  stack.push(root);
  console.log("Adding root node to stack: " + root._id);
  while (stack.length > 0) {
    const node = stack.pop();
    console.log("Popped node: " + node._id);
    visited.push(node);
    console.log("Marking as visited: " + node._id);
    const outgoingEdges = edges.filter((e) => {
      console.log(
        "Comparing edge source id " + e.source + " to node id " + node._id + "."
      );
      const result = e.source === node._id;
      console.log("Comparison returned " + result + ".");
      return result;
    });
    console.log(
      "Found " + outgoingEdges.length + " edges for node " + node._id
    );
    const adjacentNodes = outgoingEdges
      .map((e) => {
        return nodes.find((n) => n._id === e.target);
      })
      .sort();
    console.log(
      "Found " + adjacentNodes.length + " adjacent nodes for node " + node._id
    );
    for (const adjacentNode of adjacentNodes) {
      stack.push(adjacentNode);
    }
  }
  return visited;
};

/**
 * Search function for finding nodes connected to the root node in
 * a directed graph by comparing ObjectIds.
 * @param {*} root
 * @param {*} nodes
 * @param {*} edges
 * @returns All nodes connected to the argument root node.
 */
module.exports.depthFirstSearchObjectId = function (root, nodes, edges) {
  if (!root) throw new Error("Cannot perform a DFS without a root node.");
  const visited = [];
  const stack = [];
  stack.push(root);
  while (stack.length > 0) {
    const node = stack.pop();
    visited.push(node);
    const outgoingEdges = edges.filter((e) => e.source.equals(node._id));
    const adjacentNodes = outgoingEdges
      .map((e) => {
        return nodes.find((n) => n._id.equals(e.target));
      })
      .sort();
    for (const adjacentNode of adjacentNodes) {
      stack.push(adjacentNode);
    }
  }
  return visited;
};

/**
 * Finds all edges connected to the argument nodes by strict equality.
 * @param {*} nodes
 * @param {*} allEdges
 * @returns All edges connected to the argument nodes.
 */
module.exports.getEdgesForNodes = function (nodes, allEdges) {
  let foundEdges = [];
  for (const node of nodes) {
    const edgesForNode = allEdges.filter((e) => e.source === node._id);
    foundEdges = foundEdges.concat(edgesForNode);
  }
  return foundEdges;
};

/**
 * Finds all edges connected to the argument nodes by comparing ObjectIds.
 * @param {*} nodes
 * @param {*} allEdges
 * @returns All edges connected to the argument nodes.
 */
module.exports.getEdgesForNodesObjectId = function (nodes, allEdges) {
  let foundEdges = [];
  for (const node of nodes) {
    const edgesForNode = allEdges.filter((e) => e.source.equals(node._id));
    foundEdges = foundEdges.concat(edgesForNode);
  }
  return foundEdges;
};

/**
 * Checks if the graph given the root, nodes and edges contains
 * a cycle by strict comparison.
 * @param {*} root
 * @param {*} nodes
 * @param {*} edges
 * @returns
 */
module.exports.hasCycle = function (root, nodes, edges) {
  if (!root) throw new Error("Cannot chech for cycles without a root node.");
  const visited = [];
  const stack = [];
  stack.push(root);
  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.find((n) => n._id === node._id)) return true;
    visited.push(node);
    const outgoingEdges = edges.filter((e) => e.source === node._id);
    const adjacentNodes = outgoingEdges
      .map((e) => {
        return nodes.find((n) => n._id === e.target);
      })
      .sort();
    for (const adjacentNode of adjacentNodes) {
      stack.push(adjacentNode);
    }
  }
  return false;
};

/**
 * Checks if the graph given the root, nodes and edges contains
 * a cycle by ObjectId comparisons.
 * @param {*} root
 * @param {*} nodes
 * @param {*} edges
 * @returns
 */
module.exports.hasCycleObjectId = function (root, nodes, edges) {
  if (!root) throw new Error("Cannot chech for cycles without a root node.");
  const visited = [];
  const stack = [];
  stack.push(root);
  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.find((n) => n._id.equals(node._id))) return true;
    visited.push(node);
    const outgoingEdges = edges.filter((e) => e.source.equals(node._id));
    const adjacentNodes = outgoingEdges
      .map((e) => {
        return nodes.find((n) => n._id.equals(e.target));
      })
      .sort();
    for (const adjacentNode of adjacentNodes) {
      stack.push(adjacentNode);
    }
  }
  return false;
};
