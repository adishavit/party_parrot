if( 'function' === typeof importScripts) {
   // This loads the wasm generated glue code
	importScripts('color_cycle_asm.js');
	
	let frame_bytes;
   
	addEventListener('message', onMessage);

	function onMessage(e) { 
		switch(e.data.cmd){
			case "processFrame":
				processFrame(e.data.img_data, e.data.color_change_speed);
				break;
		}
	}   
	
	// Overrides for the generated emcc script, module gets redifined later
	Module.onRuntimeInitialized = function() {
		postMessage({'cmd': 'onRuntimeInitilized'});
	}; 
	
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
	
	function processFrame(img_data, color_change_speed){
		
	  if (!frame_bytes) {
         frame_bytes = _arrayToHeap(img_data.data);
      }
      else if (frame_bytes.length !== img_data.data.length) {
         _freeArray(frame_bytes); // free heap memory
         frame_bytes = _arrayToHeap(img_data.data);
      }
      else {
         frame_bytes.set(img_data.data);
      }

      // Perform operation on copy, no additional conversions needed, direct pointer manipulation
      // results will be put directly into the output param.
      Module._rotate_colors(img_data.width, img_data.height, frame_bytes.byteOffset, frame_bytes.byteOffset, color_change_speed);
      // copy output to ImageData
      img_data.data.set(frame_bytes);
      
      postMessage({'cmd': 'drawProcessedFrame', 'img_data': img_data});
	}
}





