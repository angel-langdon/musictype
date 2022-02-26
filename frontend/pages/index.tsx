import Head from "next/head";
import TypingTest from "components/TypingTest";
import SongProvider from "contexts/SongProvider";

export default function Home() {
  return (
    <SongProvider>
      <div className="h-full overflow-hidden">
        <Head>
          <title>MusicType</title>
          <meta name="description" content="MusicType" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="h-full flex flex-col items-center relative">
          <header className="flex w-full items-center justify-center p-5 mb-5">
            <h1 className="text-3xl text-zinc-300">MusicType</h1>
          </header>
          <TypingTest />
        </main>
      </div>
    </SongProvider>
  );
}
