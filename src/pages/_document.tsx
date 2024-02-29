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
            href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          <link rel="icon" href="favicon.ico" />
          <link rel="apple-touch-icon" href="logo/apple-touch-icon.png" />

          {/* Facebook */}
          <meta
            name="og:title"
            content="Instant Header - Great images for your content, in a flash"
          />
          <meta
            name="og:description"
            content="Instant Header is your one-stop shop for getting beautiful, attention grabbing images to go with your newsletter, blog, article or more!"
          />
          <meta name="og:url" content="www.instantheader.com" />
          <meta name="og:type" content="website" />
          <meta
            name="og:image"
            content="https://www.instantheader.com/sharing/og-image.png"
          />
          <meta name="og:image:type" content="image/png" />
          <meta name="og:image:width" content="1200" />
          <meta name="og:image:height" content="630" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Instant Header - Great images for your content, in a flash"
          />
          <meta name="twitter:site" content="@instantheader" />
          <meta
            name="twitter:description"
            content="Instant Header is your one-stop shop for beautiful images to go with your articles."
          />
          <meta
            name="twitter:image"
            content="https://www.instantheader.com/sharing/og-image.png"
          />
          <meta
            name="twitter:image:alt"
            content="Multitude of photos generated from a single article using Instant Header"
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

export default CustomDocument;
