import pnp from '../pnp';
import { EnvironmentType } from '../../enums/environmentType.enum';
import { getElementByClassFirst, getElementById } from '../element';
import { v4 as uuidv4 } from 'uuid';
import { SPUser } from '@microsoft/sp-page-context';

const gVariable: any = {};

/** @internal */
export const global_init = async (releaseVersion: string) => {
  const context = pnp.getContext();
  gVariable.user = pnp.getContext().pageContext.user;

  gVariable.web_Id = pnp.getContext().pageContext.web.id.toString();

  gVariable.web_Url = context.pageContext.web.absoluteUrl;
  gVariable.web_Relative_Url = context.pageContext.web.serverRelativeUrl;
  gVariable.domain_Url = gVariable.web_Url.replace(gVariable.web_Relative_Url, '');
  gVariable.session_id = uuidv4();
  gVariable.release_Version = releaseVersion;

  if (window.location.href.indexOf('/_layouts/15/workbench.aspx') > -1 || window.location.href.indexOf('loadSPFX=true&customActions=') > -1) {
    gVariable.env_type = EnvironmentType.Local;
    gVariable.web_Url = window.location.href.substring(0, window.location.href.indexOf('#'));
    const workbenchPageContent = await getElementById('workbenchPageContent');
    if (workbenchPageContent) {
      workbenchPageContent.style.maxWidth = '100%';
    }

    const canvasZone = await getElementByClassFirst('CanvasZone');
    if (canvasZone) {
      canvasZone.style.maxWidth = '100%';
    }
  }
};

export const setSPAUrl = (url) => {
  gVariable.spa_url = url;
};

export const setHistory = (useHistory: any) => {
  history = useHistory;
};

export const global = {
  setHistory,
  Web_Id: () => gVariable.web_Id as string,
  Domain_Url: () => gVariable.domain_Url as string,
  Web_Url: () => gVariable.web_Url as string,
  Web_Relative_Url: () => gVariable.web_Relative_Url as string,
  Release_Version: () => gVariable.release_Version as string,
  Env_Type: () => gVariable.env_type as EnvironmentType,
  User: () => gVariable.user as SPUser,
  History: () => gVariable.history,
  Session_Id: () => gVariable.session_id as string,
  SPA_Url: () => gVariable.spa_url as string
};
