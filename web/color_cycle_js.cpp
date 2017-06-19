#include <stdio.h>
#include <emscripten.h>

#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>

#include "color_cycle.h"

// global data
cv::Mat3b bgr_g, bgr_out_g;

using namespace cv;

extern "C" 
{
   //////////////////////////////////////////////////////////////////////////

   bool EMSCRIPTEN_KEEPALIVE rotate_colors(int width, int height,
                                           cv::Vec4b* frame4b_ptr,
                                           cv::Vec4b* frame4b_ptr_out, 
                                           int hsteps) try
   {
      // wrap memory pointers with proper cv::Mat images (no copies)
      cv::Mat4b rgba_in(height, width, frame4b_ptr);
      cv::Mat4b rgba_out(height, width, frame4b_ptr_out);

      // allocate 3-channel images if needed
      bgr_g.create(rgba_in.size());
      bgr_out_g.create(rgba_in.size());

      cv::cvtColor(rgba_in, bgr_g, CV_RGBA2BGR);
      color_cycle::rotate_hue(bgr_g, bgr_out_g, hsteps);

      // mix BGR + A (from input) => RGBA output
      const Mat in_mats[] = { bgr_out_g, rgba_in };
      constexpr int from_to[] = { 0,2, 1,1, 2,0, 6,3 };
      mixChannels(in_mats, std::size(in_mats), &rgba_out, 1, from_to, std::size(from_to)/2);
      return true;
   }
   catch (std::exception const& e)
   {
      printf("Exception thrown: %s\n", e.what());
      return false;
   }
   catch (...)
   {
      printf("Unknown exception thrown!\n");
      return false;
   }

   //////////////////////////////////////////////////////////////////////////

   void EMSCRIPTEN_KEEPALIVE release()
   {
      color_cycle::clear_all();
      bgr_g.release();
      bgr_out_g.release();
   }

   //////////////////////////////////////////////////////////////////////////
}
