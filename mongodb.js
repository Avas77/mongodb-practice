const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://AvasBajra:notmycupoftea123@task-manager.vsf6qyq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "Task-Manager";

async function run() {
  try {
    // Connect to the Atlas cluster
    await client.connect();
    const db = client.db(dbName);
    // Reference the "people" collection in the specified database
    const col = db.collection("people");
    // Create a new document
    let personDocument = {
      name: { first: "Alan", last: "Turing" },
      birth: new Date(1912, 5, 23), // May 23, 1912
      death: new Date(1954, 5, 7), // May 7, 1954
      contribs: ["Turing machine", "Turing test", "Turingery"],
      views: 1250000,
    };
    // Insert the document into the specified collection
    const p = await col.insertOne(personDocument);
    // Find and return the document
    const filter = { "name.last": "Turing" };
    const document = await col.findOne(filter);
    console.log("Document found:\n" + JSON.stringify(document));
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
