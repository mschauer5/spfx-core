import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as ReactDom from 'react-dom';
import pnp from '../services/pnp';
import { global_init } from '../services/global';

import { theme_init } from '../services/theme';
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';

let _themeVariant;
let _customTheme;
let _lookupTheme;

export default class MyBaseWebpart<T> extends BaseClientSideWebPart<T> {
  public isDarkTheme: boolean = false;

  public async wb_onInit(themeVariant: any, lookupTheme: boolean, version: string, fillWidth = false): Promise<void> {
    pnp.setup(this.context);
    _lookupTheme = lookupTheme;

    // Consume the new ThemeProvider service
    const _themeProvider: ThemeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    _themeVariant = _themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    _themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    global_init(version, fillWidth);

    await theme_init(themeVariant, lookupTheme);

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private async handleThemeChangedEvent(args: ThemeChangedEventArgs): Promise<void> {
    _themeVariant = { ...args.theme, _customTheme };
    await theme_init(_themeVariant, _lookupTheme);
    this.render();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this.isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);
  }

  public render(): void {}
}
