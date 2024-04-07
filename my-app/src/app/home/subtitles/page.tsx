'use client'
import { useSelector } from 'react-redux';
import { SubtitlesState, Subtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useSession } from 'next-auth/react';
import * as React from "react";
import { SubtitlesDropDown } from './SubtitlesDropDown';
import SubtitlesList from '@/components/Subtitles/SubtitlesList';
import UpdateSubtitles from './UpdateSubtitles';
import axios from 'axios'

export default function Home() {
  const subtitlesData: any = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
  const session = useSession();
  const email = session?.data?.user?.email;
  const [selectedSubtitle, setSelectedSubtitle] = React.useState<Subtitle | null>(null);

  //const [subsResult, setSubsResult] = React.useState<string | Subtitle[] | null>(null);
  // React.useEffect(() => {
  //   // Call the getSubs function when the component mounts
  //   if (email) {
  //     console.log("useEffectEmail", email);
  //     getSubs(email, session?.status)
  //       .then((result) => setSubsResult(result))
  //       .catch((error) => setSubsResult(error.message));
  //   }
  //   console.log(subsResult)
  // }, [email, session?.status]);

  return (
    <div className='m-5'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SubtitlesDropDown data={subtitlesData} //@ts-ignore
          setSelectedSubtitle={setSelectedSubtitle} />
        {selectedSubtitle && (<UpdateSubtitles selectedSubtitle={selectedSubtitle as Subtitle} />)}
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

async function getSubs(email: string, status: string) {
  try {


    if (status === 'authenticated') {

      const response = await axios.post('/api/subtitles/get', { email });
      return response.data;
    } else {
      throw new Error('User is not authenticated');
    }
  } catch (error: any) {
    return error.message
  }
}