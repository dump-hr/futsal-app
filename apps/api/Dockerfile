FROM node:22.12-alpine AS base
LABEL org.opencontainers.image.source=https://github.com/dump-hr/futsal-app

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=api --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/out/full/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.yarn/releases ./.yarn/releases

RUN yarn install --immutable && yarn cache clean

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn turbo run build --filter=api...

FROM base AS runner
WORKDIR /app
EXPOSE 3000

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs
COPY --from=installer --chown=nestjs:nestjs /app .
COPY --chown=nestjs:nestjs apps/admin/dist ./apps/admin/dist
COPY --chown=nestjs:nestjs apps/app/dist ./apps/app/dist

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/api/healthz || exit 1

CMD ["node", "apps/api/dist/src/main.js"]
