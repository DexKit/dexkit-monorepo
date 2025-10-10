import createEmotionServer from '@emotion/server/create-instance';

import Document, { Head, Html, Main, NextScript } from 'next/document';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Script from 'next/script';
import createEmotionCache from '../src/createEmotionCache';
import '../src/polyfills/react-polyfills';

export default class MyDocument extends Document {
  props: any;
  render() {
    const { appConfig } = ((this as any).props?.pageProps as {
      appConfig: AppConfig;
    }) || { appConfig: {} };

    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          {(appConfig as any)?.font && (
            <link
              href={`https://fonts.googleapis.com/css2?family=${(appConfig as any).font.family}&display=swap`}
              rel="stylesheet"
            />
          )}
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" />
          {(this as any).props?.emotionStyleTags || null}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined' && typeof require !== 'undefined') {
                  try {
                    const originalRequire = require;
                    const Module = require('module');
                    const originalResolveFilename = Module._resolveFilename;
                    
                    Module._resolveFilename = function (request, parent, isMain) {
                      if (request === 'react-dom') {
                        const reactDom = originalRequire('react-dom');
                        
                        if (!reactDom.findDOMNode) {
                          const React = originalRequire('react');
                          
                          reactDom.findDOMNode = (instance) => {
                            if (instance == null) {
                              return null;
                            }
                            
                            if (instance.nodeType === 1) {
                              return instance;
                            }
                            
                            if (instance._reactInternalFiber || instance._reactInternalInstance) {
                              const fiber = instance._reactInternalFiber || instance._reactInternalInstance;
                              if (fiber && fiber.stateNode) {
                                return fiber.stateNode;
                              }
                            }
                            
                            if (instance.refs && instance.refs.current) {
                              return instance.refs.current;
                            }
                            
                            if (typeof instance.getDOMNode === 'function') {
                              return instance.getDOMNode();
                            }
                            
                            return null;
                          };
                        }
                        
                        return 'react-dom';
                      }
                      
                      return originalResolveFilename.call(this, request, parent, isMain);
                    };
                  } catch (e) {
                    console.warn('React polyfill failed:', e);
                  }
                }
              `,
            }}
          />
          <Script
            id="google-analytics-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${(appConfig as any)?.analytics?.gtag || 'G-LYRHJH7JLJ'
              }`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());    
              gtag('config', '${(appConfig as any)?.analytics?.gtag || 'G-LYRHJH7JLJ'}');
          
        `}
          </Script>
        </Head>
        <body>
          <InitColorSchemeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;
  let pageProps = null;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        (function EnhanceApp(props: any) {
          pageProps = props.pageProps;
          return <App emotionCache={cache} {...props} />;
        }),
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
    pageProps,
  };
};
