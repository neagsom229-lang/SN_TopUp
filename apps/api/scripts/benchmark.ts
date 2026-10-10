import autocannon from 'autocannon';
import { createApp } from '../src/app.js';

async function runBenchmark() {
  const app = createApp();
  const server = app.listen(4001, async () => {
    console.log('Benchmark server running on port 4001...');

    console.log('\n--- Benchmarking GET /api/v1/games (Cached) ---');
    const result1 = await autocannon({
      url: 'http://localhost:4001/api/v1/games',
      connections: 10,
      duration: 3,
    });
    console.log(autocannon.printResult(result1));

    console.log('\n--- Benchmarking GET /api/v1/games/mobile-legends (Cached) ---');
    const result2 = await autocannon({
      url: 'http://localhost:4001/api/v1/games/mobile-legends',
      connections: 10,
      duration: 3,
    });
    console.log(autocannon.printResult(result2));

    server.close();
    process.exit(0);
  });
}

runBenchmark().catch((err) => {
  console.error(err);
  process.exit(1);
});
