require("dotenv").config();
const contractData = require("./constants/constant.json");
const { PrismaClient } = require("./src/client/generate");
const processMarketplaceEvents = require("./services/paymentsTracker");
const callApi = require("./utils/apiUtils");
const prisma = new PrismaClient();

const CHAIN_ID = process.env.NETWORK_CHAINID ?? "31337";

const connect = async () => {
  // Check last block processed;
  const result = await prisma.tracker_State.findMany();
  if (!result.length) {
    await prisma.tracker_State.create({
      data: {
        contractAddress: contractData[CHAIN_ID].address,
        lastBlockProcessed: 0,
        chainId: CHAIN_ID,
      },
    });
  }

  console.log();

  const trackContractCallback = async () => {
    const lastBlocks = await prisma.Tracker_State.findMany();
    await processMarketplaceEvents(lastBlocks[0].lastBlockProcessed, prisma);
    await processDeadEvents();
    setTimeout(() => trackContractCallback(), 2000);
  };
  await trackContractCallback();
};

const processDeadEvents = async () => {
  // checkear si hay eventos muertos
  const deadEvents = await prisma.dead_events_queue.findMany();

  if (!deadEvents.length) return console.log("no hay que recuperar");
  // de ser asi, llamar a callApi con esos datos
  try {
    deadEvents.forEach(async (event) => {
      await callApi(event.eventName, JSON.parse(event.data), true);
      await prisma.dead_events_queue.delete({ where: { id: event.id } });
    });
  } catch (error) {
    console.log(error);
  }
};

setTimeout(connect, 2000);
