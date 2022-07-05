import { ActionType } from '../../enums/actionType.enum';
import { toDateFileName } from '../format';
import { Release_Version, Session_Id, Web_Id } from '../global';
import pnp from '../pnp';

let _shouldConsoleLog = false;
let _siteUrl = '';
let _listTitle = '';
let _shouldDebug = false;

export const logger_init = (shouldConsoleLog = false, shouldDebug = false, siteUrl = '.', listTitle = 'Logs') => {
  _shouldConsoleLog = shouldConsoleLog;
  _siteUrl = siteUrl === '.' ? undefined : siteUrl;
  _listTitle = listTitle;
  _shouldDebug = shouldDebug;
};

export const downloadObjAsJSON = (obj: any, fileName = '') => {
  if (fileName) {
    if (fileName.indexOf('.json') === -1) {
      fileName += '.json';
    }
  } else {
    fileName = toDateFileName();
  }

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const add = async (identity: string, payload: any, actionType: ActionType): Promise<void> => {
  // Ignore if coming from test cases
  if (identity.startsWith('[test]') || identity.startsWith('[Test]')) {
    return;
  }

  if (_shouldConsoleLog) {
    console.log(`${identity} ${Web_Id}`, {
      payload: payload,
      ActionType: ActionType[actionType]
    });
  }

  const shouldLog = _shouldDebug ? true : actionType === ActionType.Error || actionType === ActionType.Warning ? true : false;

  if (shouldLog) {
    const logItem = {
      Title: identity,
      Value: JSON.stringify(payload),
      ActionType: ActionType[actionType],
      Session: Session_Id,
      ReleaseVersion: Release_Version
    };

    try {
      await pnp.sp(_siteUrl).list(_listTitle).items().add(logItem);
    } catch (error) {
      console.log(`${identity} ${Web_Id}`, {
        payload: { ...logItem, Error: error },
        ActionType: ActionType.Error
      });
    }
  }
};
