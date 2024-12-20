import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { words } = await request.json()

    // Update each word in the database
    const updates = words.map(async (word: any) => {
      return prisma.hardWord.update({
        where: {
          word_SubtitleId: {
            word: word.word,
            SubtitleId: word.SubtitleId,
          },
        },
        data: {
          repetitions: word.repetitions,
        },
      })
    })

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating words:', error)
    return NextResponse.json(
      { error: 'Failed to update words' },
      { status: 500 }
    )
  }
}
