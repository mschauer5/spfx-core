import list from './list';
import web from './web';
import { SPFI } from '@pnp/sp';
import { theme_init } from '../../theme';
/** @internal */
const sp = (spfi: SPFI) => {
  return { list: (title: string) => list(title, spfi), web: () => web(spfi), setCustomTheme: (themeVariant: any) => theme_init(themeVariant) };
};

/** @internal */
export default sp;
