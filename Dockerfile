# Self-hosting the marketing site.
#
# Included because the product's whole argument is that you should be able to
# run things on your own infrastructure. A site making that case that can only
# be deployed to a vendor PaaS would be slightly embarrassing.

# ---- build ----------------------------------------------------------------
FROM node:24-alpine AS build

WORKDIR /app

# Install deps first so this layer caches across content edits.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ENV ASTRO_TELEMETRY_DISABLED=1
# Runs the full gate: icon check, type check, build, third-party check,
# and header generation.
RUN npm run build

# ---- serve ----------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/deploy/headers.conf /etc/nginx/conf.d/headers.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Runs unprivileged. nginx:alpine ships an `nginx` user already.
RUN touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
