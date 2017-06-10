#include <iostream>
#include <opencv2/opencv.hpp>
#include <opencv2/videoio.hpp>

using namespace std;
using namespace cv;

int main(int argc, char* argv[])
{
   if (argc < 2)
   {
      std::cerr << "Usage: " << argv[0] << " <image>" << std::endl;
      return EXIT_FAILURE;
   }

   VideoCapture vidcap(argv[1]);
   if (!vidcap.isOpened())
   {
       std::cerr << "Could not open media '" << argv[1] << "'." << std::endl;
       return EXIT_FAILURE;
   }

   cv::Mat3b img, hsv0, hsv1, res;
   cv::Mat1b gray;

   int hdelta = 0;
   int c = 0;
   while (27 != c)
   {
       while (27 != (c = waitKey(1.5*1000.f/vidcap.get(CAP_PROP_FPS))) && (vidcap >> img, !img.empty()))
       {
           cvtColor(img, hsv0, CV_BGR2HSV_FULL);
           hsv1.create(hsv0.size());

           for (int r = 0; r < hsv0.rows; ++r)
               for (int c = 0; c < hsv0.cols; ++c)
                   hsv1.at<Vec3b>(r, c) = cv::Vec3b((hsv0.at<Vec3b>(r, c)[0] + hdelta) % 255,
                       hsv0.at<Vec3b>(r, c)[1],
                       hsv0.at<Vec3b>(r, c)[2]);

           cvtColor(hsv1, res, CV_HSV2BGR_FULL);
           cvtColor(res, gray, CV_BGR2GRAY);
           imshow("Party", res);
           imshow("Gray", gray);

           hdelta += 10;

       }
       //vidcap.set(CAP_PROP_POS_FRAMES, 0);
       vidcap.open(argv[1]);
   }

   waitKey();
	return EXIT_SUCCESS;
}
