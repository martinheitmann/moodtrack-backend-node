const chai = require("chai");
const expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod;
let mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const NotificationQuestionnaire = require("../src/model/nqgraph/notification-questionnaire");
const NQEdge = require("../src/model/nqgraph/nq-edge");
const NQNode = require("../src/model/nqgraph/nq-node");
const Resolver = require("../src/resolver/notification-questionnaire-by-time-of-day-resolver");

/**
 * Connect to a new in-memory database before running any tests.
 */
before(async function () {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async function () {
  await NotificationQuestionnaire.create(exampleNotificationQuestionnaire);
  await NQNode.create(exampleEntryNode);
  await NQNode.create(exampleFollowUpNode1);
  await NQNode.create(exampleFollowUpNode2);
  await NQEdge.create(exampleEdge1);
  await NQEdge.create(exampleEdge2);
});

/**
 * Clear all test data after every test.
 */
afterEach(async function () {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

/**
 * Remove and close the db and server.
 */
after(async function () {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

/**
 * Test suite.
 */
describe("Notification questionnaire (by time of day) ", () => {
  it("can be fetched with its respective nodes and edges.", async function () {
    const exampleTimeOfDay = { hour: 9, minute: 0 };
    const functionArgs = {
      timeOfDay: exampleTimeOfDay,
      notificationQuestionnaireId: exampleNotificationQuestionnaire._id,
    };
    const parent = null;
    const args = functionArgs;
    const context = null;
    const info = null;
    const result =
      await Resolver.notificationQuestionnaireByTimeOfDayResolvers.Query.notificationQuestionnaireByTimeOfDay(
        parent,
        args,
        context,
        info
      );
    expect(result.nqId.toString()).to.equal(
      exampleNotificationQuestionnaire._id.toString()
    );
    expect(result.nodes).to.have.length(3);
    expect(result.edges).to.have.length(2);
    const nodeLabels = result.nodes.map((n) => n.nodeLabel);
    expect(nodeLabels).to.include(exampleEntryNode.nodeLabel);
    expect(nodeLabels).to.include(exampleFollowUpNode1.nodeLabel);
    expect(nodeLabels).to.include(exampleFollowUpNode2.nodeLabel);
  });
  it("throws if a cycle is detected.", async function () {
    await createCycleInGraph();

    const exampleTimeOfDay = { hour: 9, minute: 0 };
    const functionArgs = {
      timeOfDay: exampleTimeOfDay,
      notificationQuestionnaireId: exampleNotificationQuestionnaire._id,
    };
    const parent = null;
    const args = functionArgs;
    const context = null;
    const info = null;
    const fn =
      Resolver.notificationQuestionnaireByTimeOfDayResolvers.Query
        .notificationQuestionnaireByTimeOfDay;
    expect(fn(parent, args, context, info)).to.eventually.throw;
  });
});

async function createCycleInGraph() {
  const exampleCycleNode1 = {
    nodeLabel: "Sleep Question 2",
    nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
    data: {
      type: "question",
      question: {
        questionText: "Do you feel more tried or awake right now?",
        questionChoices: [
          {
            choiceIconId: ObjectId("60ffd5c14eb2e21953b5c3ef"),
            choiceIcon: "ICONS_Activation_1.png",
            choiceValueType: "number",
            choiceValue: "1",
          },
        ],
      },
      appquestionnaire: null,
    },
    __v: 0,
    isSourceNode: false,
    position: {
      xPos: 205,
      yPos: -223,
    },
    isArchived: false,
  };
  const createdNode = await NQNode.create(exampleCycleNode1);
  const cycleEdge1 = {
    nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
    source: exampleFollowUpNode1._id,
    target: createdNode._id,
    edgeLabel: "Lorem Ipsum",
    condition: {
      condition: "less_than",
      conditionValue: "3",
      conditionType: "integer",
    },
  };
  const cycleEdge2 = {
    nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
    source: createdNode._id,
    target: exampleEntryNode._id,
    edgeLabel: "Lorem Ipsum",
    condition: {
      condition: "less_than",
      conditionValue: "3",
      conditionType: "integer",
    },
  };
  await NQEdge.create(cycleEdge1);
  await NQEdge.create(cycleEdge2);
}

const exampleNotificationQuestionnaire = {
  _id: ObjectId("60ffe17d4eb2e21953b5c437"),
  isActive: false,
  enrolledUsers: [
    "nV7LiTijWrYZOlxVGE3OHDmpHzw1",
    "YNL1zZ1nyGQd1sPfa0xzfXETROn2",
    "TG9RdmbA5RTu5gfP1cNMMzjgvJu1",
  ],
  name: "Test Questionnaire 1",
  description: "",
  __v: 0,
  created: "2021-10-25T12:18:24.518Z",
  isArchived: false,
};

const exampleEntryNode = {
  _id: ObjectId("60ffe1e54eb2e21953b5c441"),
  nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
  nodeLabel: "Entry Node 1",
  isSourceNode: true,
  data: {
    _id: ObjectId("618ce51b15d54d2c8ba578dc"),
    type: "question",
    question: {
      _id: ObjectId("618ce51b15d54d2c8ba578dd"),
      timeOfDay: {
        minute: 0,
        hour: 9,
      },
      questionText: "How well did you sleep tonight?",
      questionChoices: [
        {
          _id: ObjectId("618ce51b15d54d2c8ba578de"),

          choiceIconId: ObjectId("60ffda254eb2e21953b5c40c"),
          choiceIcon: "ICONS_Valence_1.png",
          choiceValueType: "number",
          choiceValue: "1",
        },
      ],
    },
    appquestionnaire: null,
  },
  __v: 0,
  position: {
    xPos: 32,
    yPos: -109,
  },
  isArchived: false,
};

const exampleFollowUpNode1 = {
  _id: ObjectId("61028f5e85d08e3645a4f57a"),
  nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
  nodeLabel: "Depression Questionnaire 1",
  data: {
    _id: ObjectId("6155b5258dc5032dba3e1395"),
    type: "appquestionnaire",
    question: null,
    appquestionnaire: {
      _id: ObjectId("6155b5258dc5032dba3e1396"),
      qid: ObjectId("6102673f85d08e3645a4f1d7"),
    },
  },
  __v: 0,
  position: {
    xPos: -120,
    yPos: -252,
  },
  isArchived: false,
};

const exampleFollowUpNode2 = {
  _id: ObjectId("60ffe26e4eb2e21953b5c44f"),
  nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
  nodeLabel: "Sleep Question 2",
  data: {
    _id: ObjectId("6155b51a8dc5032dba3e137a"),
    type: "question",
    question: {
      _id: ObjectId("6155b51a8dc5032dba3e137b"),
      questionText: "Do you feel more tried or awake right now?",
      questionChoices: [
        {
          _id: ObjectId("6155b51a8dc5032dba3e137c"),
          choiceIconId: ObjectId("60ffd5c14eb2e21953b5c3ef"),
          choiceIcon: "ICONS_Activation_1.png",
          choiceValueType: "number",
          choiceValue: "1",
        },
      ],
    },
    appquestionnaire: null,
  },
  __v: 0,
  isSourceNode: false,
  position: {
    xPos: 205,
    yPos: -223,
  },
  isArchived: false,
};

const exampleEdge1 = {
  _id: ObjectId("61028f8a85d08e3645a4f585"),
  nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
  source: ObjectId("60ffe1e54eb2e21953b5c441"),
  target: ObjectId("61028f5e85d08e3645a4f57a"),
  edgeLabel: "Dep. Follow-up 1",
  condition: {
    _id: ObjectId("612f477fe956c8c064ad221b"),
    condition: "greater_than_or_equal",
    conditionValue: "3",
    conditionType: "integer",
  },
  __v: 0,
};

const exampleEdge2 = {
  _id: ObjectId("60ffe2984eb2e21953b5c45e"),
  nqId: ObjectId("60ffe17d4eb2e21953b5c437"),
  source: ObjectId("60ffe1e54eb2e21953b5c441"),
  target: ObjectId("60ffe26e4eb2e21953b5c44f"),
  edgeLabel: "Sleep Follow-up 1",
  condition: {
    _id: ObjectId("618cf02e3470bd32acfd1e34"),
    condition: "less_than",
    conditionValue: "3",
    conditionType: "integer",
  },
  __v: 0,
};
