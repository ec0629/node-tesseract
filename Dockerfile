# might want to switch this to the Node image but getting the tesseract package will be harder
FROM ubuntu:latest

WORKDIR /home

RUN apt-get update && apt-get install -y tesseract-ocr gnupg curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs \
  && apt-get install -y build-essential cmake unzip pkg-config \
  && apt-get install -y libjpeg-dev libpng-dev libtiff-dev \
  && apt-get install -y libatlas-base-dev gfortran \
  && apt-get install -y python3-dev \
  && apt-get install -y wget \
  && wget -O opencv.zip https://github.com/opencv/opencv/archive/3.4.1.zip \
  && wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/3.4.1.zip \
  && unzip opencv.zip \
  && unzip opencv_contrib.zip \
  && rm opencv.zip opencv_contrib.zip \
  && wget https://bootstrap.pypa.io/get-pip.py \
  && python3 get-pip.py \
  && rm -rf /home/get-pip.py /home/.cache/pip \
  && pip install numpy

WORKDIR /home/opencv-3.4.1/build
RUN cmake -D CMAKE_BUILD_TYPE=RELEASE \
	-D CMAKE_INSTALL_PREFIX=/usr/local \
	-D INSTALL_PYTHON_EXAMPLES=ON \
	-D INSTALL_C_EXAMPLES=OFF \
	-D OPENCV_EXTRA_MODULES_PATH=/home/opencv_contrib-3.4.1/modules \
	-D PYTHON_EXECUTABLE=/usr/bin/python3 \
	-D BUILD_EXAMPLES=ON ..

RUN make \
  && make install \
  && ldconfig

WORKDIR /usr/local/lib/python3.6/dist-packages/
RUN mv cv2.cpython-36m-x86_64-linux-gnu.so cv2.so

WORKDIR /home
RUN rm -rf opencv-3.4.1 opencv_contrib-3.4.1

WORKDIR /home/app
ENTRYPOINT [ "bash" ]

# docker build -t jsimonit/node_tesseract_opencv .
# docker run --rm -it -p 3000:3000 -v ${pwd}:/home/app --name node-app jsimonit/node_tesseract_opencv
