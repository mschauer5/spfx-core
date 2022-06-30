import { IPalette } from '@fluentui/theme/lib/types/IPalette';
import { ITheme } from '@fluentui/theme/lib/types/ITheme';
import { IFontStyles } from '@fluentui/theme/lib/types/IFontStyles';
import { ISemanticColors } from '@fluentui/theme/lib/types/ISemanticColors';
import { IEffects } from '@fluentui/theme/lib/types/IEffects';
import { IFontWeight } from '@fluentui/react/lib/Styling';

export interface IIToolTip {
  backgroundColor: string;
  borderColor: string;
}

export interface IIAlert {
  backgroundColor: string;
  borderColor: string;
  boldColor: string;
  iconName: string;
}

export default interface IIThemeBase extends ITheme {
  palette: IIPalette;
  fonts: IIFontStyles;
  semanticColors: IISemanticColors;
  effects: IEffects;
  fontWeights: IIFontWeights;
  tooltip: IIToolTip;
  alerts: {
    important: IIAlert;
    tip: IIAlert;
    note: IIAlert;
  };
}

export interface IIPalette extends IPalette {
  SuiteBarBackground: string;
  SuiteBarHoverBackground: string;
  SuiteBarHoverText: string;
  SuiteBarText: string;
  SuiteBarDisabledText: string;
  bodyText: string;
}

export interface IISemanticColors extends ISemanticColors {
  messageText: string;
  bodyText: string;
}

export interface IIFontStyles extends IFontStyles {
  size10: string;
  size12: string;
  size14: string;
  size16: string;
  size18: string;
  size20: string;
  size24: string;
  size28: string;
  size32: string;
  size42: string;
  size68: string;
}

export interface IIFontWeights {
  light: IFontWeight;
  semilight: IFontWeight;
  regular: IFontWeight;
  semibold: IFontWeight;
  bold: IFontWeight;
}
