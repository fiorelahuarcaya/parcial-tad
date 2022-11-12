const { MongoClient } = require("mongodb");

 const findProducts = async function(client, tiendaID) {
    const result = await client
      .db(`tienda-${tiendaID}`)
      .collection("productos")
      .find({}).toArray();
  
    if (result) {
      console.log(
        `Se encontró productos en la tienda ${tiendaID}':`
      );
      console.log(result);
      return result;
    } else {
      console.log(`No se encontró productos en la tienda '${tiendaID}'`);
    }
}

const comprar = async function (client, tiendaID, userId, productID, quantity, status) {
    const ordersCollection = client
      .db(`tienda-${tiendaID}`)
      .collection("reportes");
  
    const inventoryCollection = client
      .db(`tienda-${tiendaID}`)
      .collection("productos");
  
    const session = client.startSession();
  
    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    };
  
    try {
      const transactionResults = await session.withTransaction(async () => {
        const updateInventoryResults = await inventoryCollection.updateOne(
          { idProducto: productID },
          { $inc: { cantidad: quantity * -1 } },
          { session }
        );
        console.log(
          `${updateInventoryResults.matchedCount} document(s) found in the inventory collection with _id ${productID}.`
        );
        console.log(
          `${updateInventoryResults.modifiedCount} document(s) was/were updated.`
        );
        if (updateInventoryResults.modifiedCount !== 1) {
          await session.abortTransaction();
          return;
        }
  
        const insertOrderResults = await ordersCollection.insertOne(
          {
            idUsuario: userId,
            idProducto: productID,
            cantidad: quantity,
            pago: status,
          },
          { session }
        );
        console.log(
          `New order recorded with the following id: ${insertOrderResults.insertedId}`
        );
      }, transactionOptions);
  
      if (transactionResults) {
        console.log(
          "The order was successfully processed. Database operations from the transaction are now visible outside the transaction."
        );
      } else {
        console.log(
          "The order was not successful. The transaction was intentionally aborted."
        );
      }
    } catch (e) {
      console.log(
        "The order was not successful. The transaction was aborted due to an unexpected error: " +
          e
      );
    } finally {
      await session.endSession();
    }
  }

    module.exports = {
        findProducts,
        comprar,
    };

