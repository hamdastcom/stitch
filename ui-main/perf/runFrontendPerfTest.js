import { performance } from "node:perf_hooks";

const baseUrl = process.env.FRONTEND_PERF_URL || "http://127.0.0.1:5173";
const routeList = (process.env.FRONTEND_PERF_ROUTES || "/")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);
const rounds = Number.parseInt(process.env.FRONTEND_PERF_ROUNDS || "10", 10);
const timeoutMs = Number.parseInt(process.env.FRONTEND_PERF_TIMEOUT_MS || "10000", 10);

function buildUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

async function timedFetch(url) {
  const started = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    await response.text();
    const ended = performance.now();
    return { ok: response.ok, ms: ended - started, url };
  } catch {
    const ended = performance.now();
    return { ok: false, ms: ended - started, url };
  } finally {
    clearTimeout(timeout);
  }
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function run() {
  const latencies = [];
  let success = 0;
  let failed = 0;

  console.log(`Frontend perf test -> ${baseUrl}`);
  console.log(`Routes: ${routeList.join(", ")}`);
  console.log(`Rounds per route: ${rounds}`);

  for (const route of routeList) {
    const url = buildUrl(route);
    for (let i = 0; i < rounds; i += 1) {
      const result = await timedFetch(url);
      latencies.push(result.ms);
      if (result.ok) {
        success += 1;
      } else {
        failed += 1;
      }
    }
  }

  console.log("----- Results -----");
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Latency p50: ${percentile(latencies, 50).toFixed(2)}ms`);
  console.log(`Latency p95: ${percentile(latencies, 95).toFixed(2)}ms`);
  console.log(`Latency p99: ${percentile(latencies, 99).toFixed(2)}ms`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

run();
