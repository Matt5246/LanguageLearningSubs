'use client'
import { useSelector, useDispatch } from 'react-redux';
import { SubtitlesState, setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import { DataTable } from '@/components/Subtitles/SubtitlesListTanstack';
import UpdateSubtitles from './UpdateSubtitles';
import DeleteSubtitle from './DeleteSubtitles';
import TranslateSubtitle from './TranslateSubtitle';
import SwapTranslationButton from './SwapTranslationButton';
import { MostUsedWordsButton } from './MostUsedWords';
import { SubtitleCards } from './SubtitleCards';
import { Button } from '@/components/ui/button';

export default function Home() {
  const dispatch = useDispatch();
  const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
  const selectedSub: Subtitle = useSelector((state: any) => state.subtitle.subtitles.find((subtitle: any) => subtitle.SubtitleId === state.subtitle.selectedSubtitle));
  const validData = Array.isArray(subtitlesData) ? subtitlesData : [];

  const groupedSubtitles = validData.reduce((acc: { [key: string]: Subtitle[] }, subtitle) => {
    if (subtitle.subtitleTitle && !acc[subtitle.subtitleTitle]) {
      acc[subtitle.subtitleTitle] = [];
    }
    if (subtitle.subtitleTitle) {
      acc[subtitle.subtitleTitle].push(subtitle);
    }
    return acc;
  }, {});

  return (
    <div className='m-5'>
      <div className='flex flex-col md:flex-row justify-between items-start'>
        <div className="mb-4 md:mb-0">
          <SubtitlesDropDown data={subtitlesData as any[]} />
        </div>

        {selectedSub && (
          <div className='flex flex-col items-end'>
            <div className='flex space-x-2 mb-2'>
              <TranslateSubtitle selectedSubtitle={selectedSub as Subtitle} />
              <UpdateSubtitles selectedSubtitle={selectedSub as Subtitle} />
              <DeleteSubtitle SubtitleId={selectedSub?.SubtitleId} />
            </div>
            <div className='flex space-x-2'>
              <SwapTranslationButton selectedSubtitle={selectedSub as Subtitle} />
              <Button onClick={() => dispatch(setSelectedSubtitle(null))} >Go Back</Button>
              <MostUsedWordsButton selectedSubtitle={selectedSub as Subtitle} />
            </div>
          </div>
        )}
      </div>

      {selectedSub ? (
        <div>
          <p className="text-sm text-muted-foreground mt-2">Subtitles Title</p>
          <p className='m-1 select-text'>{selectedSub?.subtitleTitle}</p>
          {selectedSub?.episode &&
            <>
              <p className="text-sm text-muted-foreground">Episode</p>
              <p className='m-1 select-text'>{selectedSub?.episode}</p>
            </>
          }
          <p className="text-sm text-muted-foreground">Video url</p>
          <p className='m-1 select-text mb-3'>{selectedSub?.youtubeUrl ? selectedSub?.youtubeUrl : 'Video from private storage'}</p>

          {selectedSub?.subtitleData && selectedSub?.subtitleData?.length > 0 && (
            <DataTable captions={selectedSub?.subtitleData as Caption[]} height="1100px" />
          )}
        </div>
      ) : (
        Object.keys(groupedSubtitles).length > 0 && <SubtitleCards groupedSubtitles={groupedSubtitles} />
      )}
    </div>
  );
}
