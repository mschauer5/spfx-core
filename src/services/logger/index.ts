import pnp from '../pnp';
import { ActionType } from '../../enums/actionType.enum';
import { toDateFileName } from '../format';
import '@pnp/sp/fields/list';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import { IFieldInfo } from '@pnp/sp/fields/types';
import { global } from '../global';

let _shouldConsoleLog = false;
let _siteUrl = '';
let _listTitle = '';
let _shouldDebug = false;
let _debuggerSet = false;
let _listIsReady = false;

const init = (shouldConsoleLog = false, shouldDebug = false, siteUrl = '.', listTitle = 'Logs') => {
  _shouldConsoleLog = shouldConsoleLog;
  _siteUrl = siteUrl === '.' ? undefined : siteUrl;
  _listTitle = listTitle;
  _shouldDebug = shouldDebug;
  _debuggerSet = false;
  _listIsReady = false;
};

const objToJSONFile = (obj: any, fileName = '') => {
  if (fileName) {
    if (fileName.indexOf('.json') === -1) {
      fileName += '.json';
    }
  } else {
    fileName = toDateFileName();
    fileName += '.json';
  }

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const checkIfListExist = async (identity: string) => {
  try {
    const list = pnp.sp(_siteUrl).web().lists.getByTitle(_listTitle);
    const fields = await list.fields();
    let allRequiredFieldsExist = true;
    const columns = ['Title', 'Value', 'ActionType', 'Session', 'ReleaseVersion'];

    columns.every((col) => {
      const colMatch = fields.find((fld: IFieldInfo) => {
        return fld.InternalName === col;
      });

      if (!colMatch) {
        console.log(`${global.Web_Id} | ${identity} (Logging Error)`, {
          Error: `List - '${_listTitle}' - field '${col}' does not exist! Unable to write to list, app will not try again to write to list`,
          ActionType: ActionType.Error
        });
        allRequiredFieldsExist = false;
        return false;
      } else {
        return true;
      }
    });

    _listIsReady = allRequiredFieldsExist;
  } catch (error) {
    console.log(`${global.Web_Id()} | ${identity} (Logging Error)`, {
      Error: `List - '${_listTitle}' does not exist!`,
      ActionType: ActionType.Error
    });
  }
};

const add = async (identity: string, payload: any, actionType: ActionType): Promise<void> => {
  // Ignore if coming from test cases
  if (identity.startsWith('[test]') || identity.startsWith('[Test]')) {
    return;
  }

  if (_shouldConsoleLog) {
    console.log(`${global.Web_Id()} | ${identity}`, {
      pagyload: payload,
      ActionType: ActionType[actionType]
    });
  }

  const shouldLog = _shouldDebug ? true : actionType === ActionType.Error || actionType === ActionType.Warning ? true : false;
  if (shouldLog && !_debuggerSet) {
    await checkIfListExist(identity);
    // eslint-disable-next-line require-atomic-updates
    _debuggerSet = true;
  }
  if (_listIsReady) {
    const logItem = {
      Title: identity,
      Value: JSON.stringify(payload),
      ActionType: ActionType[actionType],
      Session: global.Session_Id(),
      ReleaseVersion: global.Release_Version()
    };

    try {
      await pnp.sp(_siteUrl).list(_listTitle).items().add(logItem);
    } catch (error) {
      console.log(`${identity} ${global.Web_Id()}_Logging Error`, {
        payload: { ...logItem, Error: error },
        ActionType: ActionType.Error
      });
    }
  }
};

export const logger = {
  init,
  objToJSONFile,
  add
};
