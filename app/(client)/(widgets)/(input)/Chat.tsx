'use client';
import { useState, useRef } from 'react';
import {
  streamResponse,
  demoStreamResponse,
} from '../../(services)/openai-service';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@/components/ui/button';

type SimplifiedTrack = {
  name: string;
  artists: string;
  album: string;
};

interface Props {
  simplifiedTracks: SimplifiedTrack[];
  demo: boolean;
  placeholder: string;
}

export default function Chat({ simplifiedTracks, demo, placeholder }: Props) {
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [results, setResults] = useState(placeholder);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(
    event: React.SyntheticEvent,
    simplifiedTracks: SimplifiedTrack[]
  ) {
    // clear results on subsquent clicks
    setResults('');
    event.preventDefault();
    // disable the button to prevent users from sending a request while one is currently active
    setIsGeneratingResponse(true);

    let res: Response | null = null;

    // demo flag calls same route but with hardcoded data
    if (!demo) {
      res = await streamResponse(simplifiedTracks);
    } else {
      res = await demoStreamResponse(simplifiedTracks, 'this demo user');
    }

    // double click does nothing because of our rate limited backend
    if (res.status === 429) {
      setResults('');
      return;
    }

    const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader?.read();
      done = doneReading;
      if (value != undefined) {
        setResults((prev) => prev + value);
        // scroll to the bottom when new content is added
        if (chatBoxRef.current) {
          // type guard to prevent ts error for null ref
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }
    }

    // allow user to click the button again
    setIsGeneratingResponse(false);
  }

  return (
    <section className=" w-full flex flex-col items-center gap-4">
      <div
        className="h-52 lg:h-64 p-4 whitespace-break-spaces md:w-5/6 lg:w-1/2 overflow-y-scroll rounded-xl bg-secondary dark:bg-zinc-800 dark:text-white"
        ref={chatBoxRef}
      >
        <p className="text-sm leading-relaxed">{results}</p>
      </div>
      <form
        className="w-80"
        onSubmit={(e) => handleSubmit(e, simplifiedTracks)}
      >
        <Button
          type="submit"
          className="justify-center items-center hover:underline hover mt-2 p-2 md:mt-4 md:p-4 rounded-lg w-full text-white dark:text-black bg-green-600"
          disabled={isGeneratingResponse}
          aria-describedby="judge-button"
          aria-busy={isGeneratingResponse}
        >
          {isGeneratingResponse ? (
            <LinearProgress
              sx={{
                width: '100%',
              }}
            />
          ) : (
            'Judge your music taste'
          )}
        </Button>
      </form>
    </section>
  );
}
