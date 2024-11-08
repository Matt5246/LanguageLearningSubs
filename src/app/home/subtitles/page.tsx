'use client';

import { useSelector, useDispatch } from 'react-redux';
import { SubtitlesState, setSelectedSubtitle, selectedSubtitle } from '@/lib/features/subtitles/subtitleSlice';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtitlesDropDown } from './SubtitlesDropDown';
import { DataTable } from '@/components/Subtitles/SubtitlesListTanstack';
import UpdateSubtitles from './UpdateSubtitles';
import DeleteSubtitle from './DeleteSubtitles';
import TranslateSubtitle from './TranslateSubtitle';
import SwapTranslationButton from './SwapTranslationButton';
import { MostUsedWordsButton } from './MostUsedWords';
import { SubtitleCards } from './SubtitleCards';
import { SubtitleNavigator } from './SubtitleNavigator';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Grid, List, Clock } from 'lucide-react';
import SubtitleListView from './SubtitleListView';



export default function Home() {
  const dispatch = useDispatch();
  const subtitlesData: Subtitle[] = useSelector((state: { subtitle: SubtitlesState }) => state.subtitle.subtitles);
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

  }, [groupedSubtitles]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalEpisodes = groupedSubtitles[selectedSub?.subtitleTitle || '']?.length || 0;

  const filteredSubtitles = Object.entries(groupedSubtitles).filter(([title]) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=''>
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
            className='m-0 sm:m-5'
          >
            <Card>
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
              className='container mx-auto'
            >
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Subtitles</TabsTrigger>
                  <TabsTrigger value="recent">Recently Added</TabsTrigger>
                  <TabsTrigger value="popular">Most Popular</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ScrollArea className="h-full">
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {recentlyAddedFiltered.map(([title, subtitles]) => (
                          <SubtitleCards key={title} groupedSubtitles={{ [title]: subtitles }} />
                        ))}
                      </div>
                    )}
                    {viewMode === 'list' && (
                      <SubtitleListView groupedSubtitles={groupedSubtitles} />
                    )}
                  </ScrollArea>
                  {/* <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {recentlyAddedSubtitles.map((subtitle) => (
                        <Card key={subtitle.SubtitleId} className="hover:shadow-md transition-shadow duration-200">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                              {subtitle.subtitleTitle}
                            </CardTitle>
                            <CardDescription>
                              {subtitle.episode ? `Episode: ${subtitle.episode}` : 'No episode information'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Added: {new Date(subtitle.createdAt!).toLocaleString()}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button onClick={() => dispatch(setSelectedSubtitle(subtitle?.SubtitleId || null))}>
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea> */}
                </TabsContent>
                <TabsContent value="popular">
                  <p>Most popular subtitles will be displayed here.</p>
                </TabsContent>
              </Tabs>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}