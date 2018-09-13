import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from '../components/Html';
import { APP_INIT } from '../graphql/config.gql';

// eslint-disable-next-line
const assets = process.env.RAZZLE_ASSETS_MANIFEST && require(process.env.RAZZLE_ASSETS_MANIFEST);

function extractI18nextState(ctx) {
  if (ctx.i18next) {
    const { i18next } = ctx;
    const { i18nextFilteredStore } = ctx.state;

    return {
      language: i18next.language,
      data: i18nextFilteredStore
    };
  }

  return {};
}

/**
 * Application shell renderer middleware.
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default () => async ctx => {
  const { client, App, asyncContext, serverTiming } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });

  const renderTimer = serverTiming.start('HTML renderToString()');

  const htmlDocument = renderToString(
    <Html
      assets={assets}
      asyncContext={asyncContext}
      state={client.extract()}
      i18nextState={extractI18nextState(ctx)}
      config={config}
    >
      {App}
    </Html>
  );

  serverTiming.stop(renderTimer);

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
