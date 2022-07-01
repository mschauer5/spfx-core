import listItems from './list-item';
import { SPFI } from '@pnp/sp';

/** @internal */
const list = (title: string, spfi: SPFI) => {
  return { items: (fields?: string[], expands?: string[]) => listItems(title, spfi, fields, expands) };
};

/** @internal */
export default list;
