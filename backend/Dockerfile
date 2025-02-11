FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i --legacy-peer-deps

COPY . .

RUN npx prisma generate 

EXPOSE 3000

CMD [ "npm", "run", "dev" ]