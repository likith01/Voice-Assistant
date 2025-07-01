import { CORE_CUSTOM_CONFIG, WINDOW } from "./services/config.service";
import { ModuleWithProviders, NgModule, Optional, SkipSelf, FactoryProvider } from '@angular/core';

const windowProvider: FactoryProvider = {
	provide: WINDOW,
	useFactory: () => window,
};

@NgModule()
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Import CoreModule in the AppModule only');
    }
  }

  static forRoot(config :any): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: CORE_CUSTOM_CONFIG,
          useValue: config
        },
        windowProvider,
      ]
    };
  }
}