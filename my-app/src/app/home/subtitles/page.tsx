'use client'
import { useSelector } from 'react-redux';
import { SubtitlesState, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useSession } from 'next-auth/react';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import SubtitlesList from '@/components/Subtitles/SubtitlesList';
import UpdateSubtitles from './UpdateSubtitles';
import DeleteSubtitle from './DeleteSubtitles';

export default function Home() {
  const subtitlesData: any = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
  const session = useSession();
  const email = session?.data?.user?.email;
  const [selectedSubtitle, setSelectedSubtitle] = React.useState<Subtitle | null>(null);
  return (
    <div className='m-5'>
      <div className='flex justify-between'>
        <SubtitlesDropDown data={subtitlesData} //@ts-ignore
          setSelectedSubtitle={setSelectedSubtitle} />
        {selectedSubtitle && (
          <div className='space-x-2'>
            <DeleteSubtitle SubtitleId={selectedSubtitle?.SubtitleId} />
            <UpdateSubtitles selectedSubtitle={selectedSubtitle as Subtitle} />
          </div>
        )}
      </div>
      {selectedSubtitle && (
        <div >
          <p className="text-sm text-muted-foreground mt-2">Subtitles Title</p>
          <p className='m-1 select-text'>{selectedSubtitle.subtitleTitle}</p>
          <p className="text-sm text-muted-foreground">Youtube url</p>
          <p className='m-1 select-text'>{selectedSubtitle.youtubeUrl}</p>

          {selectedSubtitle.subtitleData && selectedSubtitle.subtitleData.length > 0 && (
            <SubtitlesList captions={selectedSubtitle.subtitleData as Caption[]} url={selectedSubtitle.youtubeUrl as string} userEmail={email} />
          )}
        </div>
      )}
    </div>
  );
}
