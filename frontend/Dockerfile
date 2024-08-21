FROM node:22 AS build
WORKDIR /frontend
COPY . .
RUN ls -al /frontend
RUN cat /frontend/package.json
RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "preview"]
