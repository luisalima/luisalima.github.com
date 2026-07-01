# Local dev/preview for the Astro site (luisalima.com).
# Not a production image — just a reproducible dev server so you can preview
# drafts, diagrams, and CTAs without wrangling Node versions on the host.
FROM node:22-bookworm-slim

WORKDIR /app

# Install deps first for layer caching. Copied files change less often than src.
COPY package.json package-lock.json ./
RUN npm ci

# Source is bind-mounted at runtime (see compose) so edits hot-reload.
# The COPY here is a fallback for `docker run` without a mount.
COPY . .

EXPOSE 4321

# Bind to 0.0.0.0 so the server is reachable from the host (localhost binding
# is invisible outside the container). Astro dev serves on 4321.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
