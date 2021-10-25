FROM node:latest
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
ENTRYPOINT ["yarn"]
CMD ["start"]