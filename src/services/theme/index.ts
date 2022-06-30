import { createTheme, FontSizes, FontWeights } from '@fluentui/theme';
import IIThemeBase, { IIFontStyles, IIFontWeights } from '../../models/IITheme-base.model';
import pnp from '../pnp';

let _theme: any;

const getDefault = () => {
  return (window as any).__themeState__.theme;
};

const setTheme = (atheme: any) => {
  //#region tooltip
  if (!atheme.tooltip) {
    atheme.tooltip = {};
    atheme.tooltip.backgroundColor = atheme.palette.themeLighter;
    atheme.tooltip.borderColor = atheme.palette.themeSecondary;
  }
  //#endregion

  //#region alerts
  if (!atheme.alerts) {
    atheme.alerts = {};

    atheme.alerts.important = {
      backgroundColor: '#d7eaf8',
      borderColor: '#6fc0ff',
      boldColor: '#004173',
      iconName: 'Info'
    };
    atheme.alerts.tip = {
      backgroundColor: '#dff6dd',
      borderColor: '#35c329',
      boldColor: '#147a0b',
      iconName: 'Lightbulb'
    };
    atheme.alerts.note = {
      backgroundColor: '#efd9fd',
      borderColor: '#926fe1',
      boldColor: '#3b2e58',
      iconName: 'Error'
    };
  }

  //#endregion

  const _myTheme = createTheme({ ...atheme });

  const fontSizes: IIFontStyles = { ...(_myTheme.fonts as IIFontStyles) };
  fontSizes.size10 = FontSizes.size10;
  fontSizes.size12 = FontSizes.size12;
  fontSizes.size14 = FontSizes.size14;
  fontSizes.size16 = FontSizes.size16;
  fontSizes.size18 = FontSizes.size18;
  fontSizes.size20 = FontSizes.size20;
  fontSizes.size24 = FontSizes.size24;
  fontSizes.size28 = FontSizes.size28;
  fontSizes.size32 = FontSizes.size32;
  fontSizes.size42 = FontSizes.size42;
  fontSizes.size68 = FontSizes.size68;

  const fontWeights: IIFontWeights = {
    light: FontWeights.light,
    semilight: FontWeights.semilight,
    regular: FontWeights.regular,
    semibold: FontWeights.semibold,
    bold: FontWeights.bold
  };

  const myTheme = { ..._myTheme, palette: { ..._myTheme.palette }, fonts: fontSizes, fontWeights: fontWeights };

  _theme = { ...myTheme };
  return _theme;
};

const loadCustomTheme = async () => {
  try {
    const items = await pnp.sp().list('AppSettings').items(['Title', 'Value']).getAllWithFilter<any>("Title eq 'THEME'");
    if (items.length > 0) {
      const props = JSON.parse(items[0].Value);
      return props;
    }
  } catch (error) {}
  return undefined;
};

export const theme_init = async (themeVariant: any = undefined, lookupTheme: boolean = false) => {
  const atheme = lookupTheme ? await loadCustomTheme() : undefined;

  const appTheme = atheme ? atheme : getDefault();

  setTheme({
    palette: { ...appTheme },
    ...themeVariant
  });
};

export const theme = <T>(): T => {
  return {
    ..._theme
  };
};

export const baseTheme = (): IIThemeBase => {
  return {
    ..._theme
  };
};
