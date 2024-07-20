import { getSlideshowById } from '@ism/app/[slideshowId]/lib/data/slideshow';
import { notFound } from 'next/navigation';
import SlideViewer from '@ism/app/[slideshowId]/components/slideshow/slideviewer/SlideViewer';
import { Suspense } from 'react';
import SlidePlayer from '@ism/app/[slideshowId]/components/slideshow/player/SlidePlayer';
import { Metadata } from 'next';
import SlidePrompt from './components/SlidePrompt';
import ColorPaletteLoader from '@ism/app/[slideshowId]/components/slideshow/colors/ColorPaletteLoader';

import styles from './page.module.css';
import Reset from './components/buttons/Reset';

type Props = {
  params: {
    slideshowId: string;
  };
  searchParams: {
    slideIndex?: string;
  };
};

export async function generateMetadata({
  params: { slideshowId },
}: Props): Promise<Metadata> {
  // read route params
  const slideshow = await getSlideshowById(slideshowId);

  return {
    title: slideshow?.name,
  };
}

export default async function SlideshowLandingPage({
  params: { slideshowId },
  searchParams: { slideIndex },
}: Props) {
  const slideshow = await getSlideshowById(slideshowId);

  if (!slideshow) notFound();

  const index = parseInt(slideIndex || '') || 0;

  const currentSlide = slideshow.slides.find((slide) => slide.index === index);

  const slidePlayerKey = 'slide-player-' + currentSlide?.id;

  const imgId = 'slide_viewer__img' + currentSlide?.id;

  const isLastSlide = currentSlide?.index === slideshow.slides.length - 1;

  return (
    <main className={styles.main}>
      <SlideViewer
        className={styles.main_slide__viewer}
        imgElemId={imgId}
        slide={currentSlide}
      >
        {/* Esto debe ir dentro de slideviewer */}
        {currentSlide && <SlidePrompt slide={currentSlide} imgElemId={imgId} />}
        {currentSlide && isLastSlide && (
          <Suspense>
            <Reset slideDuration={currentSlide.duration} />
          </Suspense>
        )}
      </SlideViewer>
      {currentSlide && (
        <Suspense>
          <SlidePlayer
            key={slidePlayerKey}
            slideDuration={currentSlide?.duration}
            slidesLength={slideshow.slides.length}
          />
        </Suspense>
      )}
      {slideshow.colorPalette && (
        <ColorPaletteLoader colorPalette={slideshow.colorPalette} />
      )}
    </main>
  );
}
