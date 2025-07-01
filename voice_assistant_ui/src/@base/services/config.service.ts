import { Inject, Injectable, InjectionToken } from "@angular/core";
import { ResolveEnd, Router } from "@angular/router";

import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { cloneDeep, merge, isEqual } from 'lodash';

// Injection token for the core custom settings
export const CORE_CUSTOM_CONFIG = new InjectionToken("coreCustomConfig");
export const WINDOW = new InjectionToken<Window>("window");

@Injectable({
    providedIn: "root"
})

export class BaseConfigService {
    public localConfig: any;
    private readonly _defaultConfig: any;
    private _configSubject!: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param _config
     * @param {Router} _router
     */
    constructor(
        @Inject(CORE_CUSTOM_CONFIG) private _config: any,
        @Inject(WINDOW) private _window: Window,
        private _router: Router,
    ) {
        // Get the config from local storage
        if (_config.layout.enableLocalStorage) {
            const configString = localStorage.getItem("config");
            this.localConfig = JSON.parse(configString ?? '{}');
        } else {
            localStorage.removeItem("config");
        }

        // Set the defaultConfig to localConfig if we have else appConfig (app-config.ts)
        this._defaultConfig = this.localConfig ? this.localConfig : _config;

        // Initialize the config service
        this._initConfig();
    }



	// Set the config
	set config(data) {
		let config;

		// Set config = localConfig, If we have else defaultConfig
		if (this.localConfig) {
			config = this.localConfig;
		} else {
			config = this._configSubject.getValue();
		}

		// Merge provided data with config, and create new merged config
		config = merge({}, config, data);

		// Set config to local storage if enableLocalStorage parameter is true
		if (config.layout.enableLocalStorage) {
			localStorage.setItem("config", JSON.stringify(config));
			localStorage.setItem("themeColor", config?.layout?.themeColor || "default");
			localStorage.setItem("layoutStyle", config?.layout?.layoutStyle || "fixed");
		}

		// Inform the observers
		this._configSubject.next(config);
	}

    /**
	 * Initialize
	 *
	 * @private
	 */
	private _initConfig(): void {
		// Set the config from the default config
		this._configSubject = new BehaviorSubject(cloneDeep(this._defaultConfig));

		// On every RoutesRecognized event
		// Check if localDefault (localStorage if we have else defaultConfig) is different form the default one
		this._router.events.pipe(filter((event) => event instanceof ResolveEnd)).subscribe(() => {
			// Get the local config from local storage
			this.localConfig = JSON.parse(localStorage.getItem("config") ?? '{}');

			// Set localDefault to localConfig if we have else defaultConfig
			let localDefault = this.localConfig ? this.localConfig : this._defaultConfig;

			// If localDefault is different form the provided config (page config)
			if (!isEqual(this._configSubject.getValue().layout, localDefault.layout)) {
				// Clone the current config
				const config = cloneDeep(this._configSubject.getValue());

				// Reset the layout from the default config
				config.layout = cloneDeep(localDefault.layout);

				// Set the config
				this._configSubject.next(config);
			}
		});
	}

    /**
	 * Set config
	 *
	 * @param data
	 * @param {{emitEvent: boolean}} param
	 */
	setConfig(data : any, param = { emitEvent: true }): void {
		let config;
		// Set config = localConfig, If we have else defaultConfig
		this.localConfig = JSON.parse(localStorage.getItem("config") ?? '{}');
		if (this.localConfig) {
			config = this.localConfig;
		} else {
			config = this._configSubject.getValue();
		}
		// Merge provided value with config, and create new merged config
		config = merge({}, config, data);
		// Set config to local storage if enableLocalStorage parameter is true
		if (config.layout.enableLocalStorage) {
			localStorage.setItem("config", JSON.stringify(config));
			localStorage.setItem("themeColor", config?.layout?.themeColor || "default");
			localStorage.setItem("layoutStyle", config?.layout?.layoutStyle || "fixed");
		}

		// If emitEvent option is true...
		if (param.emitEvent === true) {
			// Inform the observers
			this._configSubject.next(config);
		}
	}

	// Get the config
	get config(): any | Observable<any> {
		return this._configSubject.asObservable();
	}

	/**
	 * Get default config
	 *
	 * @returns {any}
	 */
	get defaultConfig(): any {
		return this._defaultConfig;
	}

	/**
	 * Get config
	 *
	 * @returns {Observable<any>}
	 */
	getConfig(): Observable<any> {
		return this._configSubject.asObservable();
	}

	/**
	 * Reset to the default config
	 */
	resetConfig(): void {
		this._configSubject.next(cloneDeep(this._defaultConfig));
	}

	getHostname(): string {
		return this._window.location.hostname;
	}

	getDomain(): string {
		return this._window.location.host;
	}

	getBaseURL(): string {
		return this._window.location.origin;
	}

	getHREF(): string {
		return this._window.location.href;
	}
}