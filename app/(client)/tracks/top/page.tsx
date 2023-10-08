import { getTracksAudioFeatures, getUsersTopItems } from '@/lib/spotify';
import { Suspense } from 'react';
import Loading from './loading';
import TrackList from '../components/TrackList';
import ExportPlaylistButton from '../components/ExportPlaylistButton';
import useUserTop from '../hooks/useUserTop';

interface Props {
  params: { slug: string };
  searchParams: { timeRange: 'short_term' | 'medium_term' | 'long_term' };
}

export default async function TracksPageWrapper(props: Props) {
  // As of Next.js 13.4.1, modifying searchParams doesn't trigger the page's file-based suspense boundary to re-fallback.
  // So to bypass that until there's a fix, we'll make our manage our own suspense boundary with params as a unique key.

  // The "dialog" search param shouldn't trigger a re-fetch
  const key = JSON.stringify({ ...props.searchParams });

  return (
    <Suspense key={key} fallback={<Loading />}>
      <TracksPage {...props} />
    </Suspense>
  );
}

export async function TracksPage({ searchParams }: Props) {
  const { timeRange } = searchParams;

  let headerText = 'Top Tracks: last 4 weeks';

  switch (timeRange) {
    case 'short_term':
      headerText = 'Top Tracks: last 4 weeks';
      break;
    case 'medium_term':
      headerText = 'Top Tracks: last 6 months';
      break;
    case 'long_term':
      headerText = 'Top Tracks: all time';
      break;
    default:
      break;
  }

  const { tracks, trackUris } = await useUserTop(timeRange, 'tracks');

  return (
    <main className="flex flex-col justify-center items-center gap-20">
      <h2 className="text-3xl">{headerText}</h2>
      <TrackList tracks={tracks} />
      <ExportPlaylistButton headerText={headerText} uris={trackUris} />
    </main>
  );
}
