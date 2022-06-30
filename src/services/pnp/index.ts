import { spfi, SPFI, SPFx } from '@pnp/sp';
import { AadHttpClientFactory, MSGraphClientFactory } from '@microsoft/sp-http';
import { AssignFrom } from '@pnp/core';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

import sp from '../sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';

let _sp: SPFI;
let _factory: AadHttpClientFactory;
let _graph: MSGraphClientFactory;
let _context: ApplicationCustomizerContext | WebPartContext;

const setup = (ctx: any) => {
  _context = ctx;
  _sp = spfi().using(SPFx(ctx));
  _factory = ctx.aadHttpClientFactory;
  _graph = ctx.msGraphClientFactory;
};

const getSP = (url: string = undefined): SPFI => {
  if (url) {
    return spfi(url).using(AssignFrom(_sp.web));
  }
  return _sp;
};

const pnp = {
  setup: (ctx: any) => setup(ctx),
  getContext: () => _context,
  getFactory: () => _factory,
  getGraph: () => _graph,
  getSP: (url?: string) => getSP(url),
  sp: (url?: string) => sp(getSP(url))
};

export default pnp;
