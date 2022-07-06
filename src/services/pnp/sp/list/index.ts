import listItems from './list-item';
import { SPFI } from '@pnp/sp';

/** @internal */
const list = (title: string, spfi: SPFI) => {
  const getByTitle = async <T>(fields?: string[]): Promise<T> => {
    let list: any;

    try {
      if (fields) {
        list = await spfi.web.lists.getByTitle(title).select(...fields)();
      } else {
        list = await spfi.web.lists.getByTitle(title)();
      }

      if (list && fields) {
        const itemSelectFields: any = {};
        fields.forEach((fld: string) => {
          itemSelectFields[fld] = list[fld];
        });

        list = itemSelectFields;
      }

      return list;
    } catch (error) {
      return undefined;
    }
  };

  return {
    getByTitle: (fields?: string[]) => getByTitle(fields),
    items: (fields?: string[], expands?: string[]) => listItems(title, spfi, fields, expands)
  };
};

/** @internal */
export default list;
