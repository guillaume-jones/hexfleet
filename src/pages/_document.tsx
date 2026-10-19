import Document, { Head, Html, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="HexFleet is a simple, balanced, online game for 2 to 6 players. Send out your fleet to conquer a galaxy of hexagonal tiles!"
          />
          <link
            rel="icon"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo/apple-touch-icon.png`}
          />

          {/* Facebook */}
          <meta name="og:title" content="HexFleet - Hex-based tile conquest." />
          <meta
            name="og:description"
            content="HexFleet is a simple, balanced, online game for 2 to 6 players. Send out your fleet to conquer a galaxy of hexagonal tiles!"
          />
          <meta name="og:url" content="https://guillaumejones.com/hexfleet/" />
          <meta name="og:type" content="website" />
          {/* <meta
            name="og:image"
            content="https://guillaumejones.com/hexfleet/sharing/og-image.png"
          />
          <meta name="og:image:type" content="image/png" />
          <meta name="og:image:width" content="1200" />
          <meta name="og:image:height" content="630" /> */}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="HexFleet - Hex-based tile conquest."
          />
          <meta
            name="twitter:description"
            content="HexFleet is a simple, balanced, online game for 2 to 6 players. Send out your fleet to conquer a galaxy of hexagonal tiles."
          />
          {/* <meta
            name="twitter:image"
            content="https://guillaumejones.com/hexfleet/sharing/og-image.png"
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
