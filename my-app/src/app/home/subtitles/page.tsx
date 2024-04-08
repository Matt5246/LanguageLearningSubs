'use client'
import { useSelector, useDispatch } from 'react-redux';
import { SubtitlesState, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useSession } from 'next-auth/react';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import SubtitlesList from '@/components/Subtitles/SubtitlesList';
import { DataTable } from '@/components/Subtitles/SubtitlesListTanstack';
import UpdateSubtitles from './UpdateSubtitles';
import DeleteSubtitle from './DeleteSubtitles';
import { setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice'
export default function Home() {
  const dispatch = useDispatch();
  const subtitlesData: any = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);

  const [selectedSub, setSelectedSub] = React.useState<Subtitle | null>(null);
  if (selectedSub) {
    dispatch(setSelectedSubtitle(selectedSub));
  }
  return (
    <div className='m-5'>
      <div className='flex justify-between'>
        <SubtitlesDropDown data={subtitlesData} //@ts-ignore
          setSelectedSubtitle={setSelectedSub} />
        {selectedSub && (
          <div className='space-x-2'>
            <DeleteSubtitle SubtitleId={selectedSub?.SubtitleId} />
            <UpdateSubtitles selectedSubtitle={selectedSub as Subtitle} />
          </div>
        )}
      </div>
      {selectedSub && (
        <div >
          <p className="text-sm text-muted-foreground mt-2">Subtitles Title</p>
          <p className='m-1 select-text'>{selectedSub.subtitleTitle}</p>
          <p className="text-sm text-muted-foreground">Youtube url</p>
          <p className='m-1 select-text'>{selectedSub.youtubeUrl}</p>

          {selectedSub.subtitleData && selectedSub.subtitleData.length > 0 && (
            <DataTable captions={selectedSub.subtitleData as Caption[]} height="1000px" />
          )}
          {/* {selectedSubtitle.subtitleData && selectedSubtitle.subtitleData.length > 0 && (
            <SubtitlesList captions={selectedSubtitle.subtitleData as Caption[]} url={selectedSubtitle.youtubeUrl as string} userEmail={email} />
          )} */}

        </div>
      )}
    </div>
  );
}
