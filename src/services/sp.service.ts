import list from './list.service';
import { SPFI } from '@pnp/sp';
import web from './web.service';

const sp = (spfi: SPFI) => {
  return { list: (title: string) => list(title, spfi), web: () => web(spfi) };
};

export default sp;
