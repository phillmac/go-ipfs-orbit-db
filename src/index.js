const Ctl = require("ipfsd-ctl");
const OrbitDB = require("orbit-db");
let ipfsd;
let orbitdb;
let db;
const dbPeers = [];

async function init() {
  ipfsd = await Ctl.createController({
    ipfsHttpModule: require("ipfs-http-client"),
    ipfsBin: require("go-ipfs-dep").path(),
    args: ["--enable-pubsub-experiment"]
  });
  await ipfsd.api.config.profiles.apply("server");
  orbitdb = await OrbitDB.createInstance(ipfsd.api);
  console.log(`id: ${orbitdb.id}`);
  db = await orbitdb.open(
    "/orbitdb/zdpuAuSAkDDRm9KTciShAcph2epSZsNmfPeLQmxw6b5mdLmq5/keyvalue_test"
  );
  setInterval(() => console.log(db.replicationStatus), 1000);

  // for await (const p of ipfsd.api.dht.findProvs(
  //   "zdpuAuSAkDDRm9KTciShAcph2epSZsNmfPeLQmxw6b5mdLmq5"
  // )) {
  //   dbPeers.push(p);
  // }
  console.dir(dbPeers);
}

function run() {
  init();
}
run();

process.once("SIGUSR2", async () => {
  console.log("Shutting down");
  await orbitdb.close();
  await ipfsd.stop();
  process.kill(process.pid, "SIGUSR2");
});
