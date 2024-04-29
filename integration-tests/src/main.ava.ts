import { Worker, NEAR, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // deploy contract
  const root = worker.rootAccount;

  // some test accounts
  const alice = await root.createSubAccount("alice", {
    initialBalance: NEAR.parse("5 N").toJSON(),
  });

  const bob = await root.createSubAccount("bob", {
    initialBalance: NEAR.parse("5 N").toJSON(),
  });

  const john = await root.createSubAccount("john", {
    initialBalance: NEAR.parse("10 N").toJSON(),
  });

  const contract = await root.createSubAccount("contract", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, bob, john };
});

test.afterEach(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("John track his vehicle", async (t) => {
  const { contract, john } = t.context.accounts;
  await john.call(contract, "add_reg", {act_vel: 60, act_acel: 12, x_act: 147.2, y_act: 456.3, Z_act:753.8, ini:true });
  const msgs = await contract.view("get_reg");
  const expectedMessagesResult = [
    { sender: john.accountId, act_vel: 60, act_acel: 12, x_act: 147.2, y_act: 456.3, Z_act:753.8, ini:true  },
  ];
  t.deepEqual(msgs, expectedMessagesResult);
});

test("Alice track her vehicle", async (t) => {
  const { contract, alice } = t.context.accounts;
  await alice.call(contract, "add_reg", { act_vel: 80, act_acel: 10, x_act: 247.2, y_act: 129.3, Z_act:189.8, ini:true });
  const msgs = await contract.view("get_reg");
  const expectedMessagesResult = [
    { sender: alice.accountId, act_vel: 80, act_acel: 10, x_act: 247.2, y_act: 129.3, Z_act:189.8, ini:true   },
  ];
  t.deepEqual(msgs, expectedMessagesResult);
});

test("Bob send one message and retrieve it", async (t) => {
  const { contract, bob } = t.context.accounts;
  await bob.call(contract, "add_reg", {act_vel: 20, act_acel: 1, x_act: 347.2, y_act: 49.3, Z_act:782.6, ini:true  });
  const msgs = await contract.view("get_reg");
  const expectedMessagesResult = [
    { sender: bob.accountId, act_vel: 20, act_acel: 1, x_act: 347.2, y_act: 49.3, Z_act:782.6, ini:true   },
  ];
  t.deepEqual(msgs, expectedMessagesResult);
});
