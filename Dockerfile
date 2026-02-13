# Simple Dockerfile to serve the static Spotify-like web app
# Assumes your site files are in the ./code directory next to this Dockerfile

FROM nginx:stable-alpine

# Arguments (optional) to customize image
ARG APP_DIR=/usr/share/nginx/html

# Clean default Nginx content
RUN rm -rf ${APP_DIR}/*

# Copy static site from current directory into Nginx html directory
COPY . ${APP_DIR}/

# Expose HTTP port
EXPOSE 80

# Health check (simple HTTP GET)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1

# Use default Nginx startup command
CMD ["nginx", "-g", "daemon off;"]
