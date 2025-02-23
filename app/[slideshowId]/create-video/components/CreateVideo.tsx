'use client';

import BarLoader from '@ism/app/components/common/loaders/BarLoader';
import useCreateSlideshowVideo, {
  VideoQuality,
} from '../../lib/hooks/useCreateSlideshowVideo';
import { SlideshowWithSlides } from '../../lib/types/slideshow';
import VideoQualityControl from './controls/VideoQualityControl';

import './styles/createVideo.css';

type Props = {
  slideshow: SlideshowWithSlides;
  quality?: VideoQuality;
};

export default function CreateVideo({ slideshow, quality }: Props) {
  const { isLoading, createVideo } = useCreateSlideshowVideo(
    slideshow,
    quality
  );

  return (
    <div className="create_video">
      {isLoading ? (
        <>
          <h1>
            Creating the video file <q>{slideshow.name}.mp4</q>
          </h1>
          <h2>
            Please, do not close or reload the page while the video is being
            created
          </h2>
          <BarLoader />
        </>
      ) : (
        <>
          <h1>
            Select the quality and press the button below to start creating your
            video.
          </h1>
          <VideoQualityControl />
        </>
      )}
      <button
        className="create_video__button primary_button centered_button"
        disabled={isLoading}
        onClick={createVideo}
      >
        Start creating the video
      </button>
    </div>
  );
}
