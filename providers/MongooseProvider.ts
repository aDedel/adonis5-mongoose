import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import mongoose, { Connection } from "mongoose";

const defaultMongoUri = "mongodb://127.0.0.1:27017/mydb";

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
    const conn = this.createConnection();

    // Disable strict query to prevent nodejs warning
    conn.set("strictQuery", false);

    // Build returned data
    const m = { ...mongoose.default, ...conn, connection: conn };

    // Register mongoose
    this.app.container.singleton("Adonis/Addons/Mongoose", () => m);
  }

  public async boot() {
    // Connect to MongoDb
    const Logger = this.app.container.resolveBinding("Adonis/Core/Logger");
    Logger.info("Connecting to MongoDb...");

    const conn: Connection = this.app.container.use(
      "Adonis/Addons/Mongoose"
    ).connection;
    await conn
      .asPromise()
      .then(() => {
        Logger.info("MongoDb Connection: OK");
      })
      .catch((err) => {
        Logger.error(err, "MongoDb Error");
      });
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    await this.app.container.use("Adonis/Addons/Mongoose").disconnect();
  }

  /**
   * Create mongoose connection
   */
  private createConnection(): Connection {
    // Register bindings
    const Env = this.app.container.resolveBinding("Adonis/Core/Env");
    const useDefault = !Env.get("MONGODB_CREATE_NEW_CONNECT");
    const mongoUri = Env.get("MONGODB_URI") || defaultMongoUri;
    const mongoOptions = Env.get("MONGODB_OPTIONS");
    const options = mongoOptions ? JSON.parse(mongoOptions) : undefined;

    if (useDefault) {
      mongoose.connect(mongoUri, options);

      return mongoose.connection;
    } else {
      return mongoose.createConnection(mongoUri, options);
    }
  }
}
