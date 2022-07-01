import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as ReactDom from 'react-dom';
import pnp from '../services/pnp';
import { global_init } from '../services/global';

import { theme_init } from '../services/theme';
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';

let _themeVariant;
let _customTheme;

export default abstract class WebPart<T> extends BaseClientSideWebPart<T> {
  public isDarkTheme: boolean = false;

  protected async getCustomTheme(): Promise<any> {
    return Promise.resolve(undefined);
  }

  protected async getVersion(): Promise<string> {
    return Promise.resolve('0.0.0');
  }

  protected async onInit(): Promise<void> {
    _customTheme = await this.getCustomTheme();
    const version = await this.getVersion();

    pnp.setup(this.context);

    // Consume the new ThemeProvider service
    const _themeProvider: ThemeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // // If it exists, get the theme variant
    // _themeVariant = _themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    _themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    global_init(version);

    await theme_init(_customTheme);

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private async handleThemeChangedEvent(args: ThemeChangedEventArgs): Promise<void> {
    _themeVariant = { ...args.theme, _customTheme };
    await theme_init(_themeVariant);
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
