interface PoolOptions {
  concurrency: number;
  retries?: number;
}

export async function concurrentPool<T, R>(
  items: T[],
  callback: (item: T) => Promise<R>,
  { concurrency, retries = 0 }: PoolOptions,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let currentIndex = 0;

  const runTask = async (item: T, attempt = 0): Promise<R> => {
    try {
      return await callback(item);
    } catch (error) {
      if (attempt < retries) {
        return runTask(item, attempt + 1);
      }
      throw error;
    }
  };

  const worker = async (id: number) => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      try {
        const item = items[index];
        if (!item) continue;
        //console.log(`[concurrent-pool] Worker ${id} processing item ${index}`);
        const value = await runTask(item);
        results[index] = { status: "fulfilled", value };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  };

  const workers = Array.from({
    length: Math.min(concurrency, items.length),
  }).map((_, index) => worker(index));

  await Promise.all(workers);
  return results;
}
