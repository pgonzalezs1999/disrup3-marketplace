require("dotenv").config();
const ethers = require("ethers");
const contractsData = require("../constants/constant.json");
const axios = require("axios");
const callApi = require("../utils/apiUtils");
const decoder = new ethers.utils.AbiCoder();

const CURR_CHAIN_ID = process.env.NETWORK_CHAINID ?? "31337";
const provider = new ethers.providers.JsonRpcProvider(
  process.env.LOCALHOST_RPC_PROVIDER ?? "http://127.0.0.1:8545/"
);

const loadMarketplaceContract = () => {
  const abi = contractsData[CURR_CHAIN_ID].abi;
  const address = contractsData[CURR_CHAIN_ID].address;
  return new ethers.Contract(address, abi, provider);
};

const processMarketplaceEvents = async (startFromBlock, prisma) => {
  const currentBlock = await provider.getBlockNumber();
  const marketplaceSC = loadMarketplaceContract();
  let lastBlockProcessed = startFromBlock;

  console.info(
    `Processing events from block ${startFromBlock} to ${currentBlock}`
  );

  const handleMarketplaceEvents = async (events) => {
    // logic for handling paymentEvents
    for (const event of events) {
      if (event.event === "ItemListed") {
        processListed(event);
      }

      if (event.event === "ItemBought") {
        processSale(event);
      }

      // TODO: check evento de itemcancel
      lastBlockProcessed = event.blockNumber + 1;
    }
  };

  try {
    const pastEvents = await marketplaceSC.queryFilter(
      "*",
      startFromBlock,
      currentBlock
    );
    console.log(pastEvents.length, "events length");

    const batches = pastEvents.reduce((batchArray, item, index) => {
      const chunkIndex = Math.floor(index / 10);

      if (!batchArray[chunkIndex]) {
        batchArray[chunkIndex] = []; // start a new chunk
      }

      batchArray[chunkIndex].push(item);

      return batchArray;
    }, []);

    batches.length && console.log(`Event batches to run ${batches.length}`);
    let runBatch = 0;
    await new Promise((resolve) => {
      let interval = setInterval(async () => {
        if (runBatch >= batches.length) {
          clearInterval(interval);
          return resolve();
        }

        await handleMarketplaceEvents(batches[runBatch]);
        await prisma.Tracker_State.update({
          where: {
            contractAddress: contractsData[CURR_CHAIN_ID].address,
          },
          data: {
            lastBlockProcessed: lastBlockProcessed,
          },
        });
        console.log(
          `[PastEvents] Proccesed batch ${runBatch + 1} of ${batches.length}`
        );
        console.log(`[PastEvents] LastBlockProcessed: ${lastBlockProcessed}`);

        runBatch += 1;
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
};

const processListed = async (event) => {
  console.log(event.blockNumber, "blockNumber");
  const eventData = {
    seller: event.args.seller.toString(),
    paytoken: event.args.paytoken.toString(),
    price: Number(event.args.price),
    tokenId: Number(event.args.tokenId),
    nftAddress: event.args.nftAddress.toString(),
    timestamp: Number(event.args.timestamp),
    listingId: Number(event.args.listingId),
  };
  console.log(eventData);
  await callApi("itemListed", eventData);
};

const processSale = async (event) => {
  console.log(event.blockNumber, "blockNumber");
  const eventData = {
    buyer: event.args.buyer.toString(),
    paytoken: event.args.paytoken.toString(),
    price: Number(event.args.price),
    tokenId: Number(event.args.tokenId),
    nftAddress: event.args.nftAddress.toString(),
    timestamp: Number(event.args.timestamp),
    listingId: Number(event.args.listingId),
  };
  console.log(eventData);
  await callApi("itemBought", eventData);
};

module.exports = processMarketplaceEvents;
