import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const noteIcon = (
  <IconButton>
    <MusicNoteIcon color="info" />
  </IconButton>
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-full overflow-hidden">
      <Head>
        <title>MusicType</title>
        <meta name="description" content="MusicType" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full flex flex-col items-center relative">
        <header className="flex w-full items-center justify-center p-5 mb-5">
          <Link href={"/"}>
            <h1 className="flex text-3xl text-zinc-300 font-semibold tracking-wider cursor-pointer gap-x-3">
              {noteIcon}
              MusicType
              {noteIcon}
            </h1>
          </Link>
        </header>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
