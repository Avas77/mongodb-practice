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
    const col = db.collection("tasks");
    const p = await col
      .find({
        completed: false,
      })
      .toArray();
    console.log(p);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
