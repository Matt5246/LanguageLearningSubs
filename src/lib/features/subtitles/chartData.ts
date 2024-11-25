import { SubtitlesState } from './subtitleSlice';
import { createSelector } from '@reduxjs/toolkit';
import { getWeekNumber } from '@/lib/utils';


const generateChartData = (
    allHardWords: HardWord[],
    period: 'day' | 'week' | 'month'
) => {
    const groupedData: { [key: string]: { hardWords: number; learned: number } } = {};
    allHardWords.forEach(hardWord => {
        const createdDate = new Date(hardWord.createdAt!);
        const learnedDate = hardWord.learnedAt ? new Date(hardWord.learnedAt) : null;
        const getPeriodKey = (date: Date): string => {
            switch (period) {
                case 'day':
                    return date.toISOString().split('T')[0]; // YYYY-MM-DD
                case 'week':
                    return getWeekNumber(date); // YYYY-Www
                case 'month':
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
                default:
                    return '';
            }
        };
        const createdPeriodKey = getPeriodKey(createdDate);
        if (!groupedData[createdPeriodKey]) {
            groupedData[createdPeriodKey] = { hardWords: 0, learned: 0 };
        }
        groupedData[createdPeriodKey].hardWords += 1;
        if (learnedDate) {
            const learnedPeriodKey = getPeriodKey(learnedDate);

            if (!groupedData[learnedPeriodKey]) {
                groupedData[learnedPeriodKey] = { hardWords: 0, learned: 0 };
            }

            groupedData[learnedPeriodKey].learned += 1;
        }
    });
    return Object.entries(groupedData).map(([date, counts]) => ({
        date,
        ...counts,
    }));
};

export const selectChartData = createSelector(
    (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles,
    (_: any, period: 'day' | 'week' | 'month') => period,
    (subtitles, period) => {
        const allHardWords = subtitles.reduce(
            (acc: HardWord[], subtitle) => [...acc, ...(subtitle.hardWords as HardWord[] || [])],
            []
        );
        return generateChartData(allHardWords, period);
    }
);