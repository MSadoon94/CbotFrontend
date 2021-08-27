FROM node:14.17-alpine as build
WORKDIR /app
ENV NODE_ENV production
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci --only=production
RUN npm install react-scripts@4.0.3
COPY . /app/
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.20-alpine
COPY --chown=nginx:nginx .nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]