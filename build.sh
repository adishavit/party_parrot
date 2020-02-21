#! /bin/bash

# Get our location.
OURDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

##!!! Use -s DISABLE_EXCEPTION_CATCHING=0 if building with detection type 1 or utilizing OpenCL functions!!!

EM_FLAGS="-O3 -s ASSERTIONS=0 --llvm-lto 1 --memory-init-file 0 -s INVOKE_RUN=0 -s NO_EXIT_RUNTIME=1"
# EM_FLAGS="--llvm-lto 1 -s ASSERTIONS=1 -g4 -s SAFE_HEAP=1 --memory-init-file 0 -s INVOKE_RUN=0 -s NO_EXIT_RUNTIME=1"
EM_TOOLCHAIN="$EMSCRIPTEN/cmake/Modules/Platform/Emscripten.cmake"
OPENCV_INTRINSICS="-DCV_ENABLE_INTRINSICS=0 -DCPU_BASELINE="" -DCPU_DISPATCH="""
OPENCV_MODULES_EXCLUDE="-DBUILD_opencv_dnn=0 -DBUILD_opencv_ml=0 -DBUILD_opencv_objdetect=1 -DBUILD_opencv_photo=0 -DBUILD_opencv_shape=0 -DBUILD_opencv_shape=0 -DBUILD_opencv_stitching=0 -DBUILD_opencv_superres=0 -DBUILD_opencv_videostab=0 -DWITH_TIFF=0 -DWITH_JASPER=0"
OPENCV_CONF="${OPENCV_MODULES_EXCLUDE} -DBUILD_opencv_apps=0 -DBUILD_JPEG=1 -DBUILD_PNG=1 -DBUILD_DOCS=0 -DBUILD_EXAMPLES=0 -DBUILD_IPP_IW=0 -DBUILD_PACKAGE=0 -DBUILD_PERF_TESTS=0 -DBUILD_TESTS=0 -DBUILD_WITH_DEBUG_INFO=0 -DWITH_PTHREADS_PF=0 -DWITH_PNG=1 -DWITH_WEBP=1 -DWITH_JPEG=1 -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=0 -DBUILD_ITT=0 -DWITH_IPP=0"

echo "Building OpenCV for the web with Emscripten"
echo "Building dependencies"

cd $OURDIR

if [ ! -d "build_opencv-em" ] ; then
  mkdir build_opencv-em
fi

cd build_opencv-em
cmake ../opencv -GNinja -DCMAKE_TOOLCHAIN_FILE=$EM_TOOLCHAIN $OPENCV_CONF $OPENCV_INTRINSICS -DCMAKE_CXX_FLAGS="$EM_FLAGS" -DCMAKE_C_FLAGS="$EM_FLAGS" -DCMAKE_C_FLAGS_RELEASE="-DNDEBUG -O3" -DCMAKE_CXX_FLAGS_RELEASE="-DNDEBUG -O3"
ninja -v

cd $OURDIR

EM_P_FLAGS="-msse -msse2 -msse3 -mssse3 "
OPENCV_DIR="$OURDIR/build_opencv-em"


echo "Building party_parrot"
if [ ! -d "build" ] ; then
    mkdir build
fi
cd build

echo "Removing libs"

rm -f CMakeCache.txt
rm -rf ./color_cycle_asm.js ./color_cycle_asm.wasm ./libcolor_cycle_lib.a

cmake ../ -GNinja -DCMAKE_TOOLCHAIN_FILE=$EM_TOOLCHAIN -DOpenCV_DIR="$OPENCV_DIR" -DCMAKE_C_FLAGS_RELEASE="$EM_P_FLAGS -DNDEBUG -O3" -DCMAKE_CXX_FLAGS_RELEASE="$EM_P_FLAGS -DNDEBUG -O3"

ninja -v

echo "party_parrot libs compiled!"
echo "---------------------------"
echo "exit process"
