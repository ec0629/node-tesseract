The code for the front-end was adapted from the following tutorial:
https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

# Run docker for development:
docker build -f DockerDev -t node-ocr-dev .
docker run --rm -it -p 3000:3000 -v ${pwd}/server:/home/app/server node-ocr-dev

# Run docker for production:
docker build -t node-ocr .
docker run --rm -d -p 3000:3000 node-ocr
