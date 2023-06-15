import { BaseCommand, args, Kernel } from "@adonisjs/ace";
import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { join } from "path";

export default class MakeTask extends BaseCommand {
  public static commandName = "mongoose:model";
  public static description = "Generate mongoose model";

  @args.string({ description: "MongoDb collection name", required: true })
  public name: string;

  public static settings = {
    loadApp: true,
  };

  constructor(application: ApplicationContract, kernel: Kernel) {
    super(application, kernel);
    this.application = application;
  }

  public async run(): Promise<void> {
    try {
      const stub = join(__dirname, "..", "templates", "modelTemplate.txt");
      const path =
        this.application.resolveNamespaceDirectory("models") || "app/Models";

      this.generator
        .addFile(this.name, { pattern: "pascalcase", form: "singular" })
        .stub(stub)
        .destinationDir(path)
        .useMustache()
        .appRoot(this.application.cliCwd || this.application.appRoot);

      await this.generator.run();
    } catch (e) {
      this.logger.error(
        "Error: cannot to generate collection class with error " + e.message
      );
    }
  }
}
