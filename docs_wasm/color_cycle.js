var worker = new Worker("color_cycle_worker.js");
worker.postMessage({'cmd': 'start'}); // Start the worker.

worker.addEventListener('message', function(e) {
  switch(e.data.cmd) {
	  case 'onRuntimeInitilized':
			onRuntimeInitialized();
			break;
	  case 'drawProcessedFrame':
			drawProcessedFrame(e.data.img_data);
			break;
  }
}, false);

var fp;

function onRuntimeInitialized() {
   fp = makeFrameProcessor("sirocco.mp4");
}

function drawProcessedFrame(img_data){
	if(fp != null){
		// Render to viewport
		fp.viewport.putImageData(img_data, 0, 0);
	}
}

function updateColorChangeSpeed(newValue) { if (fp != null) fp.color_change_speed = newValue; }

// create video element : Markdown does not support 'video' and 'canvas' elements:
function addVideoElements(videoPath) {
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

   return { video: video, canvas: canvas };
}

function makeFrameProcessor(videoName) {

   var fp = addVideoElements(videoName);

   // Somewhat based on http://www.kaizou.org/2012/09/frame-by-frame-video-effects-using-html5-and/
   fp.viewport = fp.canvas.getContext("2d");
   fp.width = fp.canvas.width;
   fp.height = fp.canvas.height;
   // Create the frame-buffer canvas
   fp.framebuffer = document.createElement("canvas");
   fp.framebuffer.width = fp.width;
   fp.framebuffer.height = fp.height;
   fp.ctx = fp.framebuffer.getContext("2d");

   // Start rendering when the video is playing
   fp.playHandler = function () {
      // check if video frames are ready, if not try again a bit later.
      if (0 == fp.video.videoWidth || 0 == fp.video.videoHeight) {
         setTimeout(fp.playHandler, 10);
         return;
      }

      fp.canvas.width = fp.video.videoWidth;
      fp.canvas.height = fp.video.videoHeight;
      fp.width = fp.canvas.width;
      fp.height = fp.canvas.height;
      fp.framebuffer.width = fp.width;
      fp.framebuffer.height = fp.height;
      fp.render();
   }
   fp.video.addEventListener("play", fp.playHandler, false);

   fp.color_change_speed = 10;


   // Compute and display the next frame
   fp.renderFrame = function () {
      // Acquire a video frame from the video element
      fp.ctx.drawImage(fp.video, 0, 0, fp.video.videoWidth,
                   fp.video.videoHeight, 0, 0, fp.width, fp.height);
      var img_data = fp.ctx.getImageData(0, 0, fp.width, fp.height);

      worker.postMessage({'cmd': 'processFrame', 'img_data': img_data, 'color_change_speed': fp.color_change_speed});
      
   };

   // Rendering call-back
   fp.render = function () {
      if (fp.video.paused || fp.video.ended) {
         return;
      }
      fp.renderFrame();
      var self = fp;
      requestAnimationFrame(self.render);
   };
   
   // Some platforms seem to disable autoplay 
   // so wait a moment and display the controls and call play() manually
   setTimeout(function() {
      var isPlaying = 0 < fp.video.currentTime && !fp.video.paused && !fp.video.ended && 2 < fp.video.readyState;
      if (!isPlaying) {
         fp.video.controls = true;
         fp.video.play();
      }          
   }, 200);

   return fp;
};
