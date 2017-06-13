// create video element : Markdown does not support 'video' and 'canvas' elements:
function addVideoElements(videoPath)
{
    var div = document.getElementById('video_place');

    var video = document.createElement('video');
    div.appendChild(video);
    video.id = "video";
    video.loop = true;
    video.autoplay = true;

    var sourceMP4 = document.createElement("source");
    sourceMP4.src = videoPath;
    sourceMP4.type = "video/mp4";
    video.appendChild(sourceMP4);

    // create canvas element
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    canvas.id = "canvas";

    return { video: video, canvas:canvas };
}

function makeFrameProcessor(videoName) {

    var fp = addVideoElements(videoName);

    // Somewhat based on http://www.kaizou.org/2012/09/frame-by-frame-video-effects-using-html5-and/
    fp.viewport = fp.canvas.getContext("2d");
    fp.width  = fp.canvas.width;
    fp.height = fp.canvas.height;
    // Create the frame-buffer canvas
    fp.framebuffer = document.createElement("canvas");
    fp.framebuffer.width = fp.width;
    fp.framebuffer.height = fp.height;
    fp.ctx = fp.framebuffer.getContext("2d");

    // Start rendering when the video is playing
    fp.video.addEventListener("play", function() {
        fp.canvas.width  = fp.video.videoWidth;
        fp.canvas.height = fp.video.videoHeight;
        fp.width  = fp.canvas.width;
        fp.height = fp.canvas.height;
        fp.framebuffer.width = fp.width;
        fp.framebuffer.height = fp.height;
        fp.render();
      }, false);

    fp.color_change_speed = 10;

    function _freeArray(heapBytes) {
        Module._free(heapBytes.byteOffset);
    }
        
    function _arrayToHeap(typedArray) {
        var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
        var ptr = Module._malloc(numBytes);
        heapBytes = Module.HEAPU8.subarray(ptr, ptr + numBytes);
        heapBytes.set(typedArray);
        return heapBytes;
    }  
          
    // Compute and display the next frame
    fp.renderFrame = function() {
        // Acquire a video frame from the video element
        fp.ctx.drawImage(fp.video, 0, 0, fp.video.videoWidth,
                         fp.video.videoHeight,0,0,fp.width, fp.height);
        var img_data = fp.ctx.getImageData(0, 0, fp.width, fp.height);

        if (!fp.frame_bytes) {
            fp.frame_bytes = _arrayToHeap(img_data.data);
        }
        else if (fp.frame_bytes.length !== img_data.data.length) {
            _freeArray(fp.frame_bytes); // free heap memory
            fp.frame_bytes = _arrayToHeap(img_data.data);
        }
        else {
            fp.frame_bytes.set(img_data.data);
        }
        
        // Perform operation on copy, no additional conversions needed, direct pointer manipulation
        // results will be put directly into the output param.
        Module._rotate_colors(img_data.width, img_data.height, fp.frame_bytes.byteOffset, fp.frame_bytes.byteOffset, fp.color_change_speed);
        // copy output to ImageData
        img_data.data.set(fp.frame_bytes);
        // Render to viewport
        fp.viewport.putImageData(img_data, 0, 0);
    };

     // Rendering call-back
    fp.render = function() {
        if (fp.video.paused || fp.video.ended) {
          return;
        }
        fp.renderFrame();
        var self = fp;
        requestAnimationFrame(self.render);
    };
    return fp;
};
