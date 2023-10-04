'use client';
import { createPlaylist, addItemsToPlaylist } from '@/lib/spotify';
interface Props {
  headerText: string;
  uris: string[];
}

export default function ExportPlaylistButton({ headerText, uris }: Props) {
  const exportPlaylist = async (headerText: string, uris: string[]) => {
    const res: SpotifyApi.CreatePlaylistResponse = await createPlaylist(
      headerText
    );
    const { id: playlistId } = res;
    await addItemsToPlaylist(playlistId, uris);
  };

  return (
    <button onClick={() => exportPlaylist(headerText, uris)}>
      create playlist
    </button>
  );
}
