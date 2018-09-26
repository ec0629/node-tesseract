The code for the front-end was provided by the following tutorial:

https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

OpenCv
apt-get install -y build-essential cmake unzip pkg-config
apt-get install -y libjpeg-dev libpng-dev libtiff-dev
apt-get install -y libatlas-base-dev gfortran
apt-get install -y python3-dev

apt-get install wget

cd ~
$ wget -O opencv.zip https://github.com/opencv/opencv/archive/3.4.1.zip
$ wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/3.4.1.zip

$ unzip opencv.zip
$ unzip opencv_contrib.zip

$ wget https://bootstrap.pypa.io/get-pip.py
$ sudo python3 get-pip.py

$ sudo pip install virtualenv virtualenvwrapper
$ sudo rm -rf ~/get-pip.py ~/.cache/pip

$ echo -e "\n# virtualenv and virtualenvwrapper" >> ~/.bashrc
$ echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.bashrc
$ echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" >> ~/.bashrc
$ echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

$ source ~/.bashrc

$ mkvirtualenv cv -p python3
$ workon cv

$ pip install numpy

$ cd ~/opencv-3.4.1/
$ mkdir build
$ cd build
$ cmake -D CMAKE_BUILD_TYPE=RELEASE \
	-D CMAKE_INSTALL_PREFIX=/usr/local \
	-D INSTALL_PYTHON_EXAMPLES=ON \
	-D INSTALL_C_EXAMPLES=OFF \
	-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib-3.4.1/modules \
	-D PYTHON_EXECUTABLE=~/.virtualenvs/cv/bin/python \
	-D BUILD_EXAMPLES=ON ..

$ make

$ make install
$ ldconfig

$ cd /usr/local/lib/python3.6/site-packages/
$ mv cv2.cpython-36m-x86_64-linux-gnu.so cv2.so

$ cd ~/.virtualenvs/cv/lib/python3.6/site-packages/
$ ln -s /usr/local/lib/python3.6/site-packages/cv2.so cv2.so
