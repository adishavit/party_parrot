#include <iostream>
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include "rotate_hue.h"

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

   cv::Mat3b img;

   int c = 0;
   while (27 != c)
   {
       while (27 != (c = waitKey(1000.f/vidcap.get(CAP_PROP_FPS))) && (vidcap >> img, !img.empty()))
       {
          rotate_hue(img, img);
          imshow("Party!!", img);
       }
       vidcap.open(argv[1]);
   }

   waitKey();
	return EXIT_SUCCESS;
}
