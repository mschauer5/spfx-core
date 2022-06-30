import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/files';
import '@pnp/sp/folders';

/** @internal */
const web = (spfi: SPFI) => {
  const _getFileByServerRelativePath = (relativePath: string, spfi: SPFI) => {
    return {
      getBlob: async () => await spfi.web.getFileByServerRelativePath(relativePath).getBlob(),
      getBuffer: async () => await spfi.web.getFileByServerRelativePath(relativePath).getBuffer(),
      text: async () => await spfi.web.getFileByServerRelativePath(relativePath).getText(),
      json: async () => await spfi.web.getFileByServerRelativePath(relativePath).getJSON()
    };
  };

  return { getFileByServerRelativePath: (relativePath: string) => _getFileByServerRelativePath(relativePath, spfi) };
};

/** @internal */
export default web;
