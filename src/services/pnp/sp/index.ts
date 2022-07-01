import list from './list';
import web from './web';
import { SPFI } from '@pnp/sp';

/** @internal */
const sp = (spfi: SPFI) => {
  return { list: (title: string) => list(title, spfi), web: () => web(spfi) };
};

/** @internal */
export default sp;
