# --- build the Vite site ---
FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- runtime: static site + contact API in one process ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8787
COPY --from=build /app/dist ./dist
COPY server/contact-api.mjs .
EXPOSE 8787
USER node
CMD ["node", "contact-api.mjs"]
