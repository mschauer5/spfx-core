import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IItemAddResult } from '@pnp/sp/items';

const getById = async <T>(listTitle: string, id: number, spfi: SPFI, fields?: string[], expands?: string[]): Promise<T> => {
  let item: any;

  if (fields && expands) {
    item = await spfi.web.lists
      .getByTitle(listTitle)
      .items.getById(id)
      .select(...fields)
      .expand(...expands)();
  } else if (fields) {
    item = await spfi.web.lists
      .getByTitle(listTitle)
      .items.getById(id)
      .select(...fields)();
  } else if (expands) {
    item = await spfi.web.lists
      .getByTitle(listTitle)
      .items.getById(id)
      .expand(...expands)();
  } else {
    item = await spfi.web.lists.getByTitle(listTitle).items.getById(id)();
  }

  if (item && fields) {
    let itemSelectFields: any = {};
    fields.forEach((fld: string) => {
      itemSelectFields[fld] = item[fld];
    });

    item = itemSelectFields;
  }

  return item;
};

const getAll = async <T>(listTitle: string, spfi: SPFI, fields?: string[], expands?: string[]): Promise<T[]> => {
  let items: any;

  if (fields && expands) {
    items = await spfi.web.lists
      .getByTitle(listTitle)
      .items.select(...fields)
      .expand(...expands)();
  } else if (fields) {
    items = await spfi.web.lists.getByTitle(listTitle).items.select(...fields)();
  } else if (expands) {
    items = await spfi.web.lists.getByTitle(listTitle).items.expand(...expands)();
  } else {
    items = await spfi.web.lists.getByTitle(listTitle).items();
  }

  if (items && fields) {
    let itemSelectFields: any = [];
    items.forEach((item: any) => {
      let itemSelectField: any = {};
      fields.forEach((fld: string) => {
        itemSelectField[fld] = item[fld];
      });
      itemSelectFields.push(itemSelectField);
    });

    items = itemSelectFields;
  }

  return items;
};

const getAllWithFilter = async <T>(listTitle: string, spfi: SPFI, filter: string, fields?: string[], expands?: string[]): Promise<T[]> => {
  let items: any;

  if (fields && expands) {
    items = await spfi.web.lists
      .getByTitle(listTitle)
      .items.select(...fields)
      .filter(filter)
      .expand(...expands)();
  } else if (fields) {
    items = await spfi.web.lists
      .getByTitle(listTitle)
      .items.select(...fields)
      .filter(filter)();
  } else if (expands) {
    items = await spfi.web.lists
      .getByTitle(listTitle)
      .items.expand(...expands)
      .filter(filter)();
  } else {
    items = await spfi.web.lists.getByTitle(listTitle).items.filter(filter)();
  }

  if (items && fields) {
    let itemSelectFields: any = [];
    items.forEach((item: any) => {
      let itemSelectField: any = {};
      fields.forEach((fld: string) => {
        itemSelectField[fld] = item[fld];
      });
      itemSelectFields.push(itemSelectField);
    });

    items = itemSelectFields;
  }

  return items;
};

const deleteById = async (listTitle: string, id: number, spfi: SPFI): Promise<void> => {
  await spfi.web.lists.getByTitle(listTitle).items.getById(id).delete();
};

const add = async (listTitle: string, spfi: SPFI, payload: any): Promise<IItemAddResult> => {
  const iar: IItemAddResult = await spfi.web.lists.getByTitle(listTitle).items.add({
    ...payload
  });
  return iar;
};

const update = async (listTitle: string, spfi: SPFI, id: number, payload: any): Promise<IItemAddResult> => {
  const iar: IItemAddResult = await spfi.web.lists
    .getByTitle(listTitle)
    .items.getById(id)
    .update({
      ...payload
    });
  return iar;
};

const items = (listTitle: string, spfi: SPFI, fields?: string[], expands?: string[]) => {
  return {
    getAll: async <T>() => await getAll<T>(listTitle, spfi, fields, expands),
    getAllWithFilter: async <T>(filter: string) => await getAllWithFilter<T>(listTitle, spfi, filter, fields, expands),
    getById: async <T>(id: number) => await getById<T>(listTitle, id, spfi, fields, expands),
    deleteById: async (id: number) => await deleteById(listTitle, id, spfi),
    add: async (payload: any) => await add(listTitle, spfi, payload),
    update: async (id: number, payload: any) => await update(listTitle, spfi, id, payload)
  };
};

/** @internal */
export default items;
