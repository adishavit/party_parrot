project (HueRotate)
cmake_minimum_required(VERSION 3.0)

set(OpenCV_STATIC ON)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS} .)

add_library(rotate_hue rotate_hue.cpp rotate_hue.h)

if (EMSCRIPTEN)
	add_executable (hue_rotate web/rotate_hue_js.cpp)
	target_link_libraries(hue_rotate ${OpenCV_LIBS} rotate_hue)
	configure_file(${CMAKE_SOURCE_DIR}/web/index.html ${CMAKE_CURRENT_BINARY_DIR}/index.html COPYONLY)
	configure_file(${CMAKE_SOURCE_DIR}/data/sirocco_w320.mp4 ${CMAKE_CURRENT_BINARY_DIR}/sirocco.mp4 COPYONLY)

else()
	add_executable (HueRotate main.cpp)
	target_link_libraries(HueRotate ${OpenCV_LIBS} rotate_hue)
endif()

if(UNIX)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++1z --llvm-lto 1 --bind -s ASSERTIONS=2 --memory-init-file 0 -O3") # -Oz -s NO_FILESYSTEM=1
	
	if(DEFINED CMAKE_BUILD_TYPE)
		SET(CMAKE_BUILD_TYPE ${CMAKE_BUILD_TYPE})
	else()
	    SET(CMAKE_BUILD_TYPE Release)
    endif()
	
elseif(MSVC)
   add_definitions(/D_CRT_SECURE_NO_WARNINGS)
   add_definitions(/D_SCL_SECURE_NO_WARNINGS)
   add_definitions(/DNOMINMAX)
   set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /MT")
   set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} /MTd")
endif()

