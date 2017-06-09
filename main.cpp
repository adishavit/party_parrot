#include <iostream>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

int main(int argc, char* argv[])
{
   if (argc < 2)
   {
      std::cerr << "Usage: " << argv[0] << " <image>" << std::endl;
      return EXIT_FAILURE;
   }

   auto img0 = imread(argv[1]);
   assert( 3 == img0.channels());
   assert( img0.isContinuous());

   cv::Mat3b hsv0, hsv1, res;
   cvtColor(img0, hsv0, CV_BGR2HSV_FULL);
   hsv1.create(hsv0.size());

   int hdelta = 0;
   while (27 != waitKey(10))
   {
       for (int r = 0; r < hsv0.rows; ++r)
           for (int c = 0; c < hsv0.cols; ++c)
               hsv1.at<Vec3b>(r, c) = cv::Vec3b((hsv0.at<Vec3b>(r, c)[0] + hdelta) % 255,
                                                 hsv0.at<Vec3b>(r, c)[1],
                                                 hsv0.at<Vec3b>(r, c)[2]);

       cvtColor(hsv1, res, CV_HSV2BGR_FULL);
       imshow("ff", res);
       hdelta += 5;

   }


   waitKey();
	return EXIT_SUCCESS;
}
