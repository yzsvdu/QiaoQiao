
# The first stage
# Build React static files
FROM node:17-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
COPY ./frontend/ ./
RUN npm install
RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
#COPY ./frontend/public/.well-known/pki-validation /usr/share/nginx/html/.well-known/pki-validation

CMD ["nginx", "-g", "daemon off;"]