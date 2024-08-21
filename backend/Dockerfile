FROM node:22 AS build
WORKDIR /backend
COPY . .
RUN npm install
RUN npm run build

FROM node:22-alpine
WORKDIR /backend
COPY --from=build /backend/dist ./dist
COPY --from=build /backend/src ./src
COPY --from=build /backend/bootstrap.js ./
COPY --from=build /backend/package.json ./
RUN apk add --no-cache tzdata
ENV TZ="Asia/Shanghai"
RUN npm install --production
EXPOSE 7001
CMD ["npm", "run", "start"]
