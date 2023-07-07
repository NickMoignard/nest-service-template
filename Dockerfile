FROM node:18-alpine

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

RUN pnpm i

RUN turbo run build --filter=nest-service-template...

CMD ["turbo", "run", "start"]

# RUN turbo prune --scope="nest-service-template" --docker