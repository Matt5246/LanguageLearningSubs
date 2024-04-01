'use client'
import { useSelector } from 'react-redux';
import { SubtitlesState, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useSession } from 'next-auth/react';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import SubtitlesList from '@/components/Subtitles/SubtitlesList';

export default function Home() {
  const subtitlesData = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
  const session = useSession();
  const userEmail = session?.data?.user?.email;
  const [selectedSubtitle, setSelectedSubtitle] = React.useState<Subtitle | null>(null);

  return (
    <div className='m-5'>

      <SubtitlesDropDown data={subtitlesData} setSelectedSubtitle={setSelectedSubtitle} />
      {selectedSubtitle && (
        <div>
          <h1>{selectedSubtitle.subtitleTitle}</h1>
          <p>{selectedSubtitle.youtubeUrl}</p>
          {selectedSubtitle.subtitleData && selectedSubtitle.subtitleData.length > 0 && (
            <SubtitlesList captions={selectedSubtitle.subtitleData} url={selectedSubtitle.youtubeUrl?.toString()} userEmail={userEmail} />
          )}
        </div>
      )}
    </div>
  );
}
