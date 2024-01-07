
# The first stage
# Build React static files
FROM node:17-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
COPY ./frontend/ ./
RUN npm install

#EXPOSE 3000
#
#CMD ["npm", "run", "start-watch"]
#
RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]