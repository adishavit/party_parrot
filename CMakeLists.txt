project (ColorCycle)
cmake_minimum_required(VERSION 3.0)

set(OpenCV_STATIC ON)
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS} .)

add_library(color_cycle_lib color_cycle.cpp color_cycle.h)

if (EMSCRIPTEN)
	option(BUILD_WASM "Build Webassembly" OFF)

	add_executable (color_cycle_asm web/color_cycle_js.cpp)
	target_link_libraries(color_cycle_asm ${OpenCV_LIBS} color_cycle_lib)

   # copy files to docs folder
	configure_file(${CMAKE_SOURCE_DIR}/web/index.html        ${CMAKE_SOURCE_DIR}/docs/demo.html      COPYONLY)
	configure_file(${CMAKE_SOURCE_DIR}/web/color_cycle.js    ${CMAKE_SOURCE_DIR}/docs/color_cycle.js COPYONLY)

   # post build events - copy files to hosted demo folder
   if(BUILD_WASM)
      add_custom_command(TARGET color_cycle_asm POST_BUILD              # Adds a post-build event to color_cycle_asm
                         COMMAND ${CMAKE_COMMAND} -E copy_if_different  # which executes "cmake - E copy_if_different..."
                         ${CMAKE_CURRENT_BINARY_DIR}/color_cycle_asm.js # <--this is in-file
                         ${CMAKE_SOURCE_DIR}/docs_wasm/color_cycle_asm.js)   # <--this is out-file path

      add_custom_command(TARGET color_cycle_asm POST_BUILD              # Adds a post-build event to color_cycle_asm
                         COMMAND ${CMAKE_COMMAND} -E copy_if_different  # which executes "cmake - E copy_if_different..."
                         ${CMAKE_CURRENT_BINARY_DIR}/color_cycle_asm.wasm # <--this is in-file
                         ${CMAKE_SOURCE_DIR}/docs_wasm/color_cycle_asm.wasm)   # <--this is out-file path
   else()
      add_custom_command(TARGET color_cycle_asm POST_BUILD              # Adds a post-build event to color_cycle_asm
                         COMMAND ${CMAKE_COMMAND} -E copy_if_different  # which executes "cmake - E copy_if_different..."
                         ${CMAKE_CURRENT_BINARY_DIR}/color_cycle_asm.js # <--this is in-file
                         ${CMAKE_SOURCE_DIR}/docs/color_cycle_asm.js)   # <--this is out-file path
   endif()

else()
	add_executable (color_cycle main.cpp)
	target_link_libraries(color_cycle ${OpenCV_LIBS} color_cycle_lib)
endif()

if(BUILD_WASM)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1")
endif()

if(UNIX)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -msse")
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++1z -O3 --llvm-lto 1 --bind -s ASSERTIONS=2 --memory-init-file 0 -s ALLOW_MEMORY_GROWTH=1") # -Oz --profiling
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s NO_FILESYSTEM=1 -s NO_EXIT_RUNTIME=1") # reduce file size
	
    if(!BUILD_WASM)
        # For wasm there is no need to set ELIMINATE_DUPLICATE_FUNCTIONS as the binaryen optimizer does it automatically
        SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ELIMINATE_DUPLICATE_FUNCTIONS=1")
    endif()

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

