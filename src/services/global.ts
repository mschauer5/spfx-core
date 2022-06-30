import pnp from './pnp';
import { EnvironmentType } from '../enums/environmentType.enum';
import { getElementByClassFirst, getElementById } from './element';

let domain_Url = '';
let web_Url = '';
let web_Relative_Url = '';
let release_Version = '';
let env_type = EnvironmentType.Other;

export const global_init = async (releaseVersion: string, fillWidth: boolean = false) => {
  const context = pnp.getContext();
  web_Url = context.pageContext.web.absoluteUrl;
  web_Relative_Url = context.pageContext.web.serverRelativeUrl;
  domain_Url = web_Url.replace(web_Relative_Url, '');

  release_Version = releaseVersion;

  if (window.location.href.indexOf('/_layouts/15/workbench.aspx') > -1 || window.location.href.indexOf('loadSPFX=true&customActions=') > -1) {
    env_type = EnvironmentType.Local;
    web_Url = window.location.href.substring(0, window.location.href.indexOf('#'));
    if (fillWidth) {
      const workbenchPageContent = await getElementById('workbenchPageContent');
      workbenchPageContent.style.maxWidth = '100%';

      const canvasZone = await getElementByClassFirst('CanvasZone');
      canvasZone.style.maxWidth = '100%';
    }
  }
};

export const Domain_Url = domain_Url;
export const Web_Url = web_Url;
export const Web_Relative_Url = web_Relative_Url;
export const Release_Version = release_Version;
export const Env_Type = env_type;
