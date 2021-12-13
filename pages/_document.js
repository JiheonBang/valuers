import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="kor">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <meta property="og:url" content="valuers.me" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://res-console.cloudinary.com/valuers/thumbnails/v1/image/upload/v1639401500/R3JvdXBfMl9zZzg1OGc=/grid/"
          />
          <meta property="og:title" content="Valuers" />
          <meta
            property="og:description"
            content="노션 기반 포트폴리오 공유 서비스입니다."
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
