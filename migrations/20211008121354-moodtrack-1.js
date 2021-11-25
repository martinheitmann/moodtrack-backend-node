module.exports = {
  async up(db) {
    const contents = await db
      .collection("inappquestionnaires")
      .find({})
      .toArray();
    console.log("Found " + contents.length + " in-app questionnaires.");
    const mapped = contents.map(function (document) {
      return {
        creationDate: new Date(),
        questionnaireId: document._id,
        multipleChoiceItems: document.multipleChoiceItems,
        freeTextItems: document.freeTextItems,
      };
    });
    console.log(
      "Mapped " + mapped.length + " in-app questionnaires to content."
    );

    await db.collection("inappquestionnairecontents").insertMany(mapped);

    await db
      .collection("nqnodes")
      .updateMany({}, { $set: { isArchived: false } });
    await await db
      .collection("neqdges")
      .updateMany({}, { $set: { isArchived: false } });
    await await db
      .collection("notificationquestionnaires")
      .updateMany({}, { $set: { isArchived: false, created: new Date() } });
    await db.collection("inappquestionnaires").updateMany(
      {},
      {
        $set: {
          creationDate: new Date(),
          isArchived: false,
          description: "",
        },
        $unset: {
          multipleChoiceItems: "",
          freeTextItems: "",
        },
      }
    );
  },

  async down(db) {
    await db
      .collection("nqnodes")
      .updateMany({}, { $set: { isArchived: undefined } });
    await db
      .collection("nqedges")
      .updateMany({}, { $set: { isArchived: undefined } });
    await db
      .collection("notificationquestionnaires")
      .updateMany({}, { $set: { isArchived: undefined } });
  },
};
