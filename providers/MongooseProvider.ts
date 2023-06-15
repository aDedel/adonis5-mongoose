import Logger from "@ioc:Adonis/Core/Logger";
import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { Mongoose } from "mongoose";

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
*/
export default class MongooseProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    const mongoose = new Mongoose();

    mongoose.set("strictQuery", false);

    const Env = this.app.container.resolveBinding("Adonis/Core/Env");
    const mongoUri = Env.get("MONGODB_URI") || "mongodb://127.0.0.1:27017/mydb";
    Logger.info("Connecting to MongoDb...");
    mongoose
      .connect(mongoUri, {})
      .then(() => {
        Logger.info("MongoDb Connection: OK");
      })
      .catch((err) => {
        Logger.error(err, "MongoDb Error");
      });

    this.app.container.singleton("Mongoose", () => mongoose);
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    await this.app.container.use("Mongoose").disconnect();
  }
}
