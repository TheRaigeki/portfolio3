FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# The site is static apart from one POST, so a small Node server does both:
# it serves dist/ (with gzip and immutable caching for the hashed assets) and
# takes the contact form. Replaces nginx, which could not send the mail.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
COPY --from=build /app/dist ./dist
COPY server ./server
EXPOSE 80
CMD ["node", "server/index.js"]
