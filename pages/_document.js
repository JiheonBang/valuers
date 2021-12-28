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
          <meta
            name="description"
            content="노션 기반 포트폴리오 공유 서비스, Valuers"
          />
          <meta
            name="keywords"
            content="노션, Notion, 템플릿, 스타트업, 포트폴리오, SaaS, 취업, 노션 포트폴리오, 노션폴리오"
          />
          <meta property="og:url" content="valuers.me" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/valuers/image/upload/v1639408745/userImage/Picture1_vpj5qf.png"
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
