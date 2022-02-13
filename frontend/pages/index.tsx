import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>MusicType</title>
        <meta name="description" content="MusicType" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl text-white">MusicType</h1>
      </main>
    </div>
  );
}
