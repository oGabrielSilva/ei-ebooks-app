import AppServer from './server/AppServer';
import { run } from './utils/run';

export function main() {
  const app = new AppServer().start();
  return app.on();
}

run(main);
