#include <opencv2/imgproc.hpp>

#include "rotate_hue.h"


cv::Mat3b hsv_in, hsv_out;
int accHOffset = 0;

using namespace cv;

void rotate_hue(cv::Mat3b const& img, cv::Mat3b& result_img, int hsteps)
{
   assert(result_img.size() == img.size() && result_img.type() == img.type());
   hsv_in.create(img.size());
   hsv_out.create(hsv_in.size());

   cvtColor(img, hsv_in, CV_BGR2HSV_FULL);

   for (int r = 0; r < hsv_in.rows; ++r)
      for (int c = 0; c < hsv_in.cols; ++c)
         hsv_out.at<Vec3b>(r, c) = cv::Vec3b((hsv_in.at<Vec3b>(r, c)[0] + accHOffset) % 255,
            hsv_in.at<Vec3b>(r, c)[1],
            hsv_in.at<Vec3b>(r, c)[2]);

   cvtColor(hsv_out, result_img, CV_HSV2BGR_FULL);
   accHOffset += hsteps;
}


void clear_all()
{
   hsv_in.release();
   hsv_out.release();
   accHOffset = 0;
}
