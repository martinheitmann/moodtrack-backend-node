const expect = require("chai").expect;
const GraphUtils = require("../src/util/graph-utils");

const _nodes = [
  { _id: 0 },
  { _id: 1 },
  { _id: 2 },
  { _id: 3 },
  { _id: 4 },
  { _id: 5 },
  { _id: 6 },
];

const _edges = [
  {
    source: 0,
    target: 1,
  },
  {
    source: 0,
    target: 2,
  },
  {
    source: 3,
    target: 4,
  },
  {
    source: 3,
    target: 5,
  },
  {
    source: 1,
    target: 6,
  },
];

describe("GraphUtils", function () {
  describe("#hasCycle()", function () {
    it("should return true when the graph has a cycle", function () {
      const _cycleNodes1 = [{ _id: 0 }, { _id: 1 }, { _id: 2 }];
      const _cycleEdges1 = [
        {
          source: 0,
          target: 1,
        },
        {
          source: 1,
          target: 2,
        },
        {
          source: 2,
          target: 0,
        },
      ];
      const _cycleNodes2 = [{ _id: 0 }, { _id: 1 }];
      const _cycleEdges2 = [
        {
          source: 0,
          target: 1,
        },
        {
          source: 1,
          target: 0,
        },
      ];
      const result1 = GraphUtils.hasCycle(
        { _id: 0 },
        _cycleNodes1,
        _cycleEdges1
      );
      const result2 = GraphUtils.hasCycle(
        { _id: 0 },
        _cycleNodes2,
        _cycleEdges2
      );
      expect(result1).to.equal(true);
      expect(result2).to.equal(true);
    });
  });
});

describe("GraphUtils", function () {
  describe("#hasCycle()", function () {
    it("should return false when the graph has no cycle", function () {
      const _noCycleNodes = [{ _id: 0 }, { _id: 1 }, { _id: 2 }];
      const _noCycleEdges = [
        {
          source: 0,
          target: 1,
        },
        {
          source: 1,
          target: 2,
        },
      ];
      const result = GraphUtils.hasCycle(
        { _id: 0 },
        _noCycleNodes,
        _noCycleEdges
      );
      expect(result).to.equal(false);
    });
  });
});

describe("GraphUtils", function () {
  describe("#getEdgesForNodes()", function () {
    it("should return edges connected to the root node 1", function () {
      const n = [{ _id: 0 }, { _id: 1 }];
      const result = GraphUtils.getEdgesForNodes(n, _edges);
      const expected = [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 1, target: 6 },
      ];
      const not_expected = [
        { source: 3, target: 5 },
        { source: 3, target: 4 },
      ];
      expect(result).to.have.lengthOf(3);
      expect(result).to.deep.include(expected[0]);
      expect(result).to.deep.include(expected[1]);
      expect(result).to.deep.include(expected[2]);
      expect(result).to.not.deep.include(not_expected[0]);
      expect(result).to.not.deep.include(not_expected[1]);
    });
  });
});

describe("GraphUtils", function () {
  describe("#getEdgesForNodes()", function () {
    it("should return edges connected to the root node 2", function () {
      const n = [{ _id: 3 }, { _id: 4 }, { _id: 5 }];
      const result = GraphUtils.getEdgesForNodes(n, _edges);
      const not_expected = [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 1, target: 6 },
      ];
      const expected = [
        { source: 3, target: 5 },
        { source: 3, target: 4 },
      ];
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.include(expected[0]);
      expect(result).to.deep.include(expected[1]);
      expect(result).to.not.deep.include(not_expected[0]);
      expect(result).to.not.deep.include(not_expected[1]);
      expect(result).to.not.deep.include(not_expected[2]);
    });
  });
});

describe("GraphUtils", function () {
  describe("#depthFirstSearch()", function () {
    it("should return nodes connected to the root node 1", function () {
      const n = { _id: 0 };
      const result = GraphUtils.depthFirstSearch(n, _nodes, _edges);
      const not_expected = [{ _id: 3 }, { _id: 4 }, { _id: 5 }];
      const expected = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 6 }];
      expect(result).to.have.lengthOf(4);
      expect(result).to.deep.include(expected[0]);
      expect(result).to.deep.include(expected[1]);
      expect(result).to.deep.include(expected[2]);
      expect(result).to.deep.include(expected[3]);
      expect(result).to.not.deep.include(not_expected[0]);
      expect(result).to.not.deep.include(not_expected[1]);
      expect(result).to.not.deep.include(not_expected[2]);
    });
  });
});

describe("GraphUtils", function () {
  describe("#depthFirstSearch()", function () {
    it("should return nodes connected to the root node 2", function () {
      const n = { _id: 3 };
      const result = GraphUtils.depthFirstSearch(n, _nodes, _edges);
      const expected = [{ _id: 3 }, { _id: 4 }, { _id: 5 }];
      const not_expected = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 6 }];
      expect(result).to.have.lengthOf(3);
      expect(result).to.deep.include(expected[0]);
      expect(result).to.deep.include(expected[1]);
      expect(result).to.deep.include(expected[2]);
      expect(result).to.not.deep.include(not_expected[0]);
      expect(result).to.not.deep.include(not_expected[1]);
      expect(result).to.not.deep.include(not_expected[2]);
      expect(result).to.not.deep.include(not_expected[3]);
    });
  });
});
