import { spfi, SPFI, SPFx } from '@pnp/sp';
import { AadHttpClientFactory, MSGraphClientFactory } from '@microsoft/sp-http';
import { AssignFrom } from '@pnp/core';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

import sp from './sp.service';

let _sp: SPFI;
let _factory: AadHttpClientFactory;
let _graph: MSGraphClientFactory;

const setup = (ctx: any) => {
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

// eslint-disable-next-line @typescript-eslint/typedef
const pnp = {
  setup: (ctx: any) => setup(ctx),
  getFactory: () => _factory,
  getGraph: () => _graph,
  getSP: (url?: string) => getSP(url),
  sp: (url?: string) => sp(getSP(url))
};

export default pnp;
