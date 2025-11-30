import type { Page } from "puppeteer";
import { ConsoleInspector } from "./inspectors/console-inspector";
import { NetworkInspector } from "./inspectors/network-inspector";

export class Session {
  page: Page;
  consoleInspector: ConsoleInspector;
  networkInspector: NetworkInspector;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.networkInspector = new NetworkInspector({ page });
    this.consoleInspector = new ConsoleInspector({ page });
  }

  start() {
    this.networkInspector.start();
    this.consoleInspector.start();
  }

  stop() {
    this.networkInspector.stop();
    this.consoleInspector.stop();
  }
}
