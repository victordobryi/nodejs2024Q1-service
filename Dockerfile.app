# ---- Base Node image ----
FROM node:alpine as base

# ---- Create app directory ---- 
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install  && npm cache clean --force

 # ---- Copy Files ----
FROM dependencies as build
WORKDIR /app
COPY . .

# ---- Build Frontend bundle static files ----
RUN npm run build && mkdir -p /app/dist

# ---- Release with Alpine ----
FROM node:alpine as release
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/package.json ./

# ---- Install all dependencies ----
RUN npm install --only=production
COPY --from=build /app/dist ./dist
ENV PORT=4000
EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]



