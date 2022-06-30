import list from './list';
import { SPFI } from '@pnp/sp';
import web from './web';

const sp = (spfi: SPFI) => {
  return { list: (title: string) => list(title, spfi), web: () => web(spfi) };
};

/** @internal */
export default sp;
