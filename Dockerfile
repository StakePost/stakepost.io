# Build stage
FROM node:12-alpine as build

# Install git
RUN apk add --no-cache git

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package.json .
COPY --chown=node yarn.lock .

# Bundle app source code
COPY --chown=node packages/backend ./packages/backend
COPY --chown=node packages/frontend ./packages/frontend

# Install all dependencies
RUN yarn install --pure-lockfile --non-interactive

# Build app
WORKDIR /home/node/app/packages/backend
RUN yarn build

WORKDIR /home/node/app/packages/frontend
RUN yarn build

# Deploy stage
FROM node:12-alpine

# Install git
RUN apk add --no-cache git

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package.json .
COPY --chown=node yarn.lock .

# Bundle app build code
COPY --chown=node --from=build /home/node/app/packages/backend/package.json /home/node/app/packages/backend/package.json
COPY --chown=node --from=build /home/node/app/packages/backend/dist /home/node/app/packages/backend/dist

# Do not copy frontend package.json, as its already build
COPY --chown=node --from=build /home/node/app/packages/frontend/build /home/node/app/packages/frontend/build

# Install all dependencies
RUN yarn install --pure-lockfile --non-interactive --production

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}

WORKDIR /home/node/app/packages/backend

CMD ["node", "dist/main"]