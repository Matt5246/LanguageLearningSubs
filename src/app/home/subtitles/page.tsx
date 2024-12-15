'use client';

import { DataTable } from '@/components/Subtitles/SubtitlesListTanstack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/useMobile';
import { SubtitlesState, selectedSubtitle, setSelectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Grid, List } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteSubtitle from './DeleteSubtitles';
import { MostUsedWordsButton } from './MostUsedWords';
import { SubtitleCards } from './SubtitleCards';
import SubtitleListView from './SubtitleListView';
import { SubtitleNavigator } from './SubtitleNavigator';
import { SubtitlesDropDown } from './SubtitlesDropDown';
import SwapTranslationButton from './SwapTranslationButton';
import TranslateSubtitle from './TranslateSubtitle';
import UpdateSubtitles from './UpdateSubtitles';


export default function Home() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const subtitlesData: Subtitle[] = useSelector((state: { subtitle: { subtitles: Subtitle[] } }) => state.subtitle.subtitles);
  const selectedSub: Subtitle | undefined = useSelector(selectedSubtitle);
  const validData = Array.isArray(subtitlesData) ? subtitlesData : [];
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const groupedSubtitles = validData.reduce((acc: { [key: string]: Subtitle[] }, subtitle) => {
    if (subtitle.subtitleTitle && !acc[subtitle.subtitleTitle]) {
      acc[subtitle.subtitleTitle] = [];
    }
    if (subtitle.subtitleTitle) {
      acc[subtitle.subtitleTitle].push(subtitle);
    }
    return acc;
  }, {});
  const recentlyAddedFiltered = useMemo(() => {
    return Object.entries(groupedSubtitles)
      .filter(([title]) => title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([, a], [, b]) => new Date(b[0].createdAt!).getTime() - new Date(a[0].createdAt!).getTime())

  }, [groupedSubtitles, searchTerm]);
  const episodesFiltered = useMemo(() => {
    return Object.entries(groupedSubtitles)
      .filter(([title]) => title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([, a], [, b]) => (b.length - a.length) || ((a[0].episode || 0) - (b[0].episode || 0)));
  }, [groupedSubtitles, searchTerm]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalEpisodes = groupedSubtitles[selectedSub?.subtitleTitle || '']?.length || 0;

  const filteredSubtitles = Object.entries(groupedSubtitles)
    .filter(([title]) => title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b));

  if (!isClient || !subtitlesData.length) {
    return (
      <h1 className="text-2xl font-bold mt-9 ml-9">Subtitles Page
        <Spinner />
      </h1>
    );
  } else if (!subtitlesData || subtitlesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BookOpen className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Data Yet.</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Add your subtitles to the database first to see your progress.
        </p>
      </div>
    );
  }
  return (
    <div className='bg-background '>
      {!selectedSub && (<div className='container mx-auto py-8'><h1 className="text-3xl font-bold mb-6">Subtitle Selection</h1>
        <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6'>
          <div className="flex">
            <SubtitlesDropDown data={subtitlesData as any[]} />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search subtitles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div></div>)}
      <AnimatePresence mode="wait">
        {selectedSub ? (
          <motion.div
            key="selected-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className='m-0 sm:mx-5 pb-8'
          >
            <Card className='border-none'>
              <CardHeader>
                <CardTitle>{selectedSub.subtitleTitle}</CardTitle>
                <CardDescription>{selectedSub.episode ? `Episode: ${selectedSub.episode}` : 'No episode information'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Video URL:</p>
                <p className='select-text mb-4'>{selectedSub.youtubeUrl || 'Video from private storage'}</p>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <TranslateSubtitle selectedSubtitle={selectedSub} />
                  <SwapTranslationButton selectedSubtitle={selectedSub} />
                  <MostUsedWordsButton selectedSubtitle={selectedSub} />
                  <UpdateSubtitles selectedSubtitle={selectedSub} />
                  <DeleteSubtitle SubtitleId={selectedSub.SubtitleId} />
                </div>
                {totalEpisodes > 1 && (
                  <SubtitleNavigator selectedSub={selectedSub} groupedSubtitles={groupedSubtitles} />
                )}
              </CardContent>
              <CardFooter>
                <Button className='p-5' onClick={() => dispatch(setSelectedSubtitle(null))}>Go Back</Button>
              </CardFooter>
            </Card>
            {selectedSub.subtitleData && selectedSub.subtitleData.length > 0 && (
              <div className='mt-5'>
                <DataTable captions={selectedSub.subtitleData as Caption[]} height="1000px" />
              </div>
            )}
          </motion.div>
        ) : (
          isClient && (
            <motion.div
              key="subtitle-list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='container mx-auto h-full'
            >
              <Tabs defaultValue="all" className="w-full h-[84vh]">
                <TabsList>
                  <TabsTrigger value="all">{isMobile ? 'All' : "All Subtitles"}</TabsTrigger>
                  <TabsTrigger value="recent">{isMobile ? 'Recent' : "Recently Added"}</TabsTrigger>
                  <TabsTrigger value="episode">{isMobile ? 'Episodes' : "Episodes number"}</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ScrollArea className="h-full">
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5 ">
                        {filteredSubtitles.map(([title, subtitles]) => (
                          <SubtitleCards key={title} groupedSubtitles={{ [title]: subtitles }} />
                        ))}
                      </div>
                    )}
                    {viewMode === 'list' && (
                      <SubtitleListView groupedSubtitles={groupedSubtitles} />
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="recent">
                  <ScrollArea className="h-full">
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5">
                        {recentlyAddedFiltered.map(([title, subtitles]) => (
                          <SubtitleCards key={title} groupedSubtitles={{ [title]: subtitles }} />
                        ))}
                      </div>
                    )}
                    {viewMode === 'list' && (
                      <SubtitleListView groupedSubtitles={groupedSubtitles} />
                    )}
                  </ScrollArea>

                </TabsContent>
                <TabsContent value="episode">
                  <ScrollArea className="h-full">
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5">
                        {episodesFiltered.map(([title, subtitles]) => (
                          <SubtitleCards key={title} groupedSubtitles={{ [title]: subtitles }} />
                        ))}
                      </div>
                    )}
                    {viewMode === 'list' && (
                      <div className=''>
                        <SubtitleListView groupedSubtitles={groupedSubtitles} />
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}