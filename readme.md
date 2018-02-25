# OpenCV Web App
Here's a little experiment showing how to build a cross-platform C++ OpenCV app that also works in the browser (via emscripten). More details in my [**OpenCV Web Apps** blog post](http://videocortex.io/2017/opencv-web-app/).

# Webassembly
To build the project as a Webassembly set the BUILD_WASM option in cmake. A demo is given in docs_wasm.

# Try it out
You try out the demos by using Python's Simple HTTP Server. Run the following command in /docs or /docs_wasm:
```
python -m SimpleHTTPServer 80
```


![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)

Let's make [Sirocco](https://www.facebook.com/siroccokakapo/), the *real* parrot, PARTY!

See it [live here](http://videocortex.io/party_parrot/)!  

Built on Windows with CMake, emscripten and ninja.

Credits: [Cult of the Party Parrot](http://cultofthepartyparrot.com/) :: [BBC Last Chance To See Kākāpō](https://www.youtube.com/watch?v=9T1vfsHYiKY) :: [Sirocco](https://en.wikipedia.org/wiki/Sirocco_(parrot))
