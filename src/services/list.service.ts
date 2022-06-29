import listItems from './list-items.service';
import { SPFI } from '@pnp/sp';

const list = (title: string, spfi: SPFI) => {
  return { items: (fields?: string[], expands?: string[]) => listItems(title, spfi, fields, expands) };
};

export default list;
