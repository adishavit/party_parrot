# OpenCV Web App
Here's [a little experiment](https://github.com/adishavit/party_parrot) showing how to build a cross-platform C++ OpenCV app that also works in the browser (via emscripten).  
More details in a forthcoming blog post on [my blog](http://videocortex.io).

![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)![Sirocco](http://cultofthepartyparrot.com/parrots/rightparrot.gif)

Let's make [Sirocco](https://www.facebook.com/siroccokakapo/), the *real* parrot, **PARTY!**


<div id="video_place"></div>
<script src='color_cycle_asm.js'></script>
<script src='color_cycle.js'></script>
<script>
    var fp = makeFrameProcessor("sirocco.mp4");
    function updateColorChangeSpeed(newValue) { fp.color_change_speed = newValue; }
</script>
<input type="range" min="0" max="20" value="1" oninput="updateColorChangeSpeed(this.value)" onchange="updateColorChangeSpeed(this.value)"/>

On the left, the original, a regular HTML5 video.  
On the right, the same video being processed live, frame-by-frame cycling of the frame's hue channel.  
This is a live, real time view, running in the browser!  

Use the slider to change the color cycle speed.  

![Sirocco](http://cultofthepartyparrot.com/parrots/parrot.gif) [Adi Shavit](https://twitter.com/adishavit)

Credits: [Cult of the Party Parrot](http://cultofthepartyparrot.com/) :: [BBC Last Chance To See: Kākāpō](https://www.youtube.com/watch?v=9T1vfsHYiKY) :: [Sirocco](https://en.wikipedia.org/wiki/Sirocco_(parrot))

