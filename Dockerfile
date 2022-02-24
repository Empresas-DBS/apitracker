FROM node:16

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".","/usr/src"]

EXPOSE 3005

CMD ["node", "index.js"]