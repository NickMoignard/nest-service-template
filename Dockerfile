FROM node:18-alpine as base

ARG PNPM_HOME="/usr/local/shared/pnpm/shared/shared/v3/shared/v3"
ENV PNPM_HOME=${PNPM_HOME}

ARG SHELL="bash"
ENV SHELL=${SHELL}

RUN npm i -g pnpm@8.6.6

ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup
RUN pnpm i -g turbo
RUN pnpm i -g @nestjs/cli

FROM base as installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app


COPY . .
RUN pnpm i --prod --frozen-lockfile

FROM installer as builder
WORKDIR /app
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm run build

FROM base as runner
WORKDIR /app

COPY --from=builder /app .

CMD ["node", "dist/main"]
