'use client'
import { useSelector } from 'react-redux';
import { SubtitlesState, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import { DataTable } from '@/components/Subtitles/SubtitlesListTanstack';
import UpdateSubtitles from './UpdateSubtitles';
import DeleteSubtitle from './DeleteSubtitles';
import TranslateSubtitle from './TranslateSubtitle';
export default function Home() {
  const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
  const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));

  return (
    <div className='m-5'>
      <div className='flex flex-col md:flex-row justify-between items-start'>
        <div className="mb-4 md:mb-0">
          <SubtitlesDropDown data={subtitlesData as any[]} />
        </div>
        {selectedSub && (
          <div className='flex space-x-2'>
            <UpdateSubtitles selectedSubtitle={selectedSub as Subtitle} SubtitleId={selectedSub?.SubtitleId} />
            <TranslateSubtitle selectedSubtitle={selectedSub as Subtitle} SubtitleId={selectedSub?.SubtitleId} />
            <DeleteSubtitle SubtitleId={selectedSub?.SubtitleId} />
          </div>
        )}
      </div>
      {selectedSub && (
        <div >
          <p className="text-sm text-muted-foreground mt-2">Subtitles Title</p>
          <p className='m-1 select-text'>{selectedSub?.subtitleTitle}</p>
          <p className="text-sm text-muted-foreground">Video url</p>
          <p className='m-1 select-text mb-3'>{selectedSub?.youtubeUrl ? selectedSub?.youtubeUrl : 'Video from user drive'}</p>

          {selectedSub?.subtitleData && selectedSub?.subtitleData?.length > 0 && (
            <DataTable captions={selectedSub?.subtitleData as Caption[]} height="1000px" />
          )}
        </div>
      )}
    </div>
  );
}
