#include <opencv2/imgproc.hpp>
#include "color_cycle.h"

cv::Mat3b hsv;
int accHOffset = 0;

namespace color_cycle
{
   void rotate_hue(cv::Mat3b const& img, cv::Mat3b& result_img, int hsteps)
   {
      assert(result_img.size() == img.size() && result_img.type() == img.type());

      // re-allocate global temp storage if needed
      hsv.create(img.size());

      // convert to HSV
      cv::cvtColor(img, hsv, CV_BGR2HSV_FULL);

      for (int r = 0; r < hsv.rows; ++r)
         for (int c = 0; c < hsv.cols; ++c)
            hsv.at<cv::Vec3b>(r, c)[0] = (hsv.at<cv::Vec3b>(r, c)[0] + accHOffset) % 255; // cycle H

      // convert back to BGR
      cv::cvtColor(hsv, result_img, CV_HSV2BGR_FULL);

      // update cycle offset
      accHOffset += hsteps;
   }

   void clear_all()
   {
      // release global memory
      hsv.release();
      accHOffset = 0;
   }
}