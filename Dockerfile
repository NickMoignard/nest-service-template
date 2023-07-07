FROM node:18-alpine as builder

ARG PNPM_HOME="/usr/local/shared/pnpm/shared/shared/v3/shared/v3"
ENV PNPM_HOME=${PNPM_HOME}

ARG SHELL="bash"
ENV SHELL=${SHELL}

RUN npm i -g pnpm@8.6.6

ENV PATH="${PNPM_HOME}:${PATH}"

RUN pnpm setup
RUN pnpm i -g turbo
RUN pnpm i -g @nestjs/cli

COPY ./pruned/ /app
WORKDIR /app

RUN turbo prune --scope="nest-service-template" --docker