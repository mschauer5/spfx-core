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
    const cssLoaders = this.getCssLoaders();
    if (cssLoaders) {
      cssLoaders.forEach((css) => {
        SPComponentLoader.loadCss(css);
      });
    }
  }

  protected getCssLoaders?(): string[];
  protected abstract getDomElement(): JSX.Element | any;
  protected async getCustomTheme?(): Promise<any>;
  protected async getVersion?(): Promise<string>;

  private renderPlaceHolders = (): void => {
    // Handling the top placeholder
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

      // The extension should not assume that the expected placeholder is available.
      if (!this.topPlaceholder) {
        return;
      }

      const element: React.ReactElement = React.createElement(this.getDomElement(), {});

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

    this.context.placeholderProvider.changedEvent.add(this, this.renderPlaceHolders);

    return super.onInit();
  }
}
