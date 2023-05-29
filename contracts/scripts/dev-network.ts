import * as hre from "hardhat";
import path from "path";

/**
 * This script starts a Hardhat node and deploys the contracts to it.
 * Used to test the contracts locally.
 */

const _deploy = "./deploy.ts";
const deployPath = path.resolve(__dirname, _deploy);

const _listItem = "./listItem.ts";
const listItemPath = path.resolve(__dirname, _listItem);

async function main() {
  await hre.run("compile");

  hre.hardhatArguments.network = "localhost";

  hre.run("node");

  // wait for the node to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await hre.run("run", { script: deployPath });
  await hre.run("run", { script: listItemPath });

  console.log("\n===================================");
  console.log("== Hardhat 👷 node started ✅ 🎉 ==");
  console.log("===================================\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
