# might want to switch this to the Node image but getting the tesseract package will be harder
FROM ubuntu:latest

WORKDIR /home/app

RUN apt-get update && apt-get install -y tesseract-ocr gnupg curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

ENTRYPOINT [ "bash" ]

# docker build -t jsimonit/node_ubuntu .
# docker run --rm -it -v ${pwd}:/home/app --name node-app jsimonit/node_ubuntu
