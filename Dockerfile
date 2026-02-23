# ========== Build stage ==========
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock* drizzle.config.ts tsconfig.json ./
RUN bun install --frozen-lockfile

COPY ./src ./src

# ========== Runtime stage ==========
# Use same Bun image so native @libsql/* bindings from node_modules work (bun --compile does not bundle them)
FROM oven/bun:1 AS runtime

# ffmpeg + yt-dlp (official release) + python3 (required by yt-dlp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    curl \
    python3 \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp \
    && apt-get purge -y curl \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

WORKDIR /app
ENTRYPOINT ["bun", "run", "./src/index.ts"]
