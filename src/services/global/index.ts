import pnp from '../pnp';
import { EnvironmentType } from '../../enums/environmentType.enum';
import { getElementByClassFirst, getElementById } from '../element';
import { SPUser } from '@microsoft/sp-page-context';
import { v4 as uuidv4 } from 'uuid';

let domain_Url = '';
let web_Url = '';
let web_id = '';
let web_Relative_Url = '';
let release_Version = '';
let env_type = EnvironmentType.Other;
let user: SPUser;
let history: any;
let session_id = '';

/** @internal */
export const global_init = async (releaseVersion: string) => {
  const context = pnp.getContext();
  user = pnp.getContext().pageContext.user;
  web_id = pnp.getContext().pageContext.web.id.toString();
  web_Url = context.pageContext.web.absoluteUrl;
  web_Relative_Url = context.pageContext.web.serverRelativeUrl;
  domain_Url = web_Url.replace(web_Relative_Url, '');
  session_id = uuidv4();
  release_Version = releaseVersion;

  if (window.location.href.indexOf('/_layouts/15/workbench.aspx') > -1 || window.location.href.indexOf('loadSPFX=true&customActions=') > -1) {
    env_type = EnvironmentType.Local;
    web_Url = window.location.href.substring(0, window.location.href.indexOf('#'));
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

export const setHistory = (useHistory: any) => {
  history = useHistory;
};

export const Domain_Url = domain_Url;
export const Web_Url = web_Url;
export const Web_Id = web_id;
export const Web_Relative_Url = web_Relative_Url;
export const Release_Version = release_Version;
export const Env_Type = env_type;
export const User = user;
export const History = history;
export const Session_Id = session_id;
