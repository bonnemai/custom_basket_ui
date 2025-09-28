# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && npm install

COPY . .

ARG VITE_CUSTOM_BASKET_API_URL=http://localhost:8000/
ENV VITE_CUSTOM_BASKET_API_URL=$VITE_CUSTOM_BASKET_API_URL

RUN npm run test

RUN npm run build

FROM nginx:1.25-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
