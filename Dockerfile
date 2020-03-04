# might want to switch this to the Node image but getting the tesseract package will be harder
# FROM ubuntu:19.10
FROM node:12-buster

WORKDIR /home/app
COPY package.json .
COPY ./src ./src

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y tesseract-ocr \
  && apt-get install -y libtesseract-dev \
  && npm install

ENTRYPOINT [ "npm", "start" ]

# docker build -t node-ocr .
# docker run --rm -d -p 3000:3000 node-ocr
