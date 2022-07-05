import * as ReactDOM from 'react-dom';
import pnp from '../services/pnp';
import React from 'react';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { global_init } from '../services/global';
import { IReadonlyTheme, ThemeChangedEventArgs, ThemeProvider } from '@microsoft/sp-component-base';
import { PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { theme_init } from '../services/theme';

let _themeVariant;
let _customTheme;

export default abstract class RAC<T> extends BaseApplicationCustomizer<T> {
  private topPlaceholder: PlaceholderContent | undefined;
  public isDarkTheme: boolean = false;

  public constructor() {
    super();

    if (this.getCssLoaders) {
      this.getCssLoaders().forEach((css) => {
        SPComponentLoader.loadCss(css);
      });
    }
  }

  protected getCssLoaders?(): string[];

  protected abstract getDomElement(): React.ComponentType;

  protected getDomElementProps?(): any;

  protected async setCustomTheme(): Promise<any> {
    return Promise.resolve(undefined);
  }

  protected async onAfterInit(): Promise<void> {
    return Promise.resolve();
  }

  protected async setVersion(): Promise<string> {
    return Promise.resolve('0.0.0');
  }

  private renderPlaceHolders = (): void => {
    // Handling the top placeholder
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

      // The extension should not assume that the expected placeholder is available.
      if (!this.topPlaceholder) {
        return;
      }

      const props = this.getDomElementProps ? this.getDomElementProps() : {};

      const element: React.ReactElement = React.createElement(this.getDomElement(), props);

      ReactDOM.render(element, this.topPlaceholder.domElement);
    }
  };

  private async handleThemeChangedEvent(args: ThemeChangedEventArgs): Promise<void> {
    _themeVariant = { ...args.theme, _customTheme };
    await theme_init(_themeVariant);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this.isDarkTheme = !!currentTheme.isInverted;
  }

  public async onInit(): Promise<void> {
    _customTheme = await this.setCustomTheme();
    const version = await this.setVersion();

    pnp.setup(this.context);

    // Consume the new ThemeProvider service
    const _themeProvider: ThemeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // // If it exists, get the theme variant
    // _themeVariant = _themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    _themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    global_init(version);

    await theme_init(_customTheme);

    this.context.placeholderProvider.changedEvent.add(this, this.renderPlaceHolders);

    await super.onInit();

    await this.onAfterInit();
    return Promise.resolve();
  }
}
