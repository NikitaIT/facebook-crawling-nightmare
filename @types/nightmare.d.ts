//import * as Nightmare from "nightmare";
//версия 2.4.1+ или около того, сейчас актуальная 3.0.1 надо переписать типы
// они написаны на скорую руку, чтобы смотреть на них и плакать

	
declare class Nightmare {
	constructor(options?: Nightmare.NightmareOptions);
    constructor(options?: Nightmare.IConstructorOptions);
	engineVersions(): Nightmare;
	authentication(user: string, password: string): Nightmare;
	useragent(useragent: string): Nightmare;
	end(): Nightmare;
	goto(url: string, headers?: Object): Nightmare;
	back(): Nightmare;
	forward(): Nightmare;
	refresh(): Nightmare;
	click(selector: string): Nightmare;
	mousedown(selector: string): Nightmare;
	type(selector: string, text: string): Nightmare;
	insert(selector: string, text: string): Nightmare;
	check(selector: string): Nightmare;
	uncheck(selector: string): Nightmare;
	select(selector: string, option: string): Nightmare;
	scrollTo(top: number, left: number): Nightmare;
	viewport(width: number, height: number): Nightmare;
	inject(type: string, file: string): Nightmare;
	evaluate<T>(fn: (...values: T[]) => any, ...values: T[]): Nightmare;
	wait(ms: number): Nightmare;
	wait(selector: string): Nightmare;
	wait<T>(fn: (...values: T[]) => boolean, ...values: T[]): Nightmare;
	header(header: string, value: string): Nightmare;
	exists(selector: string): Nightmare;
	visible(selector: string): Nightmare;
	screenshot(path: string): Nightmare;
	html(path: string, saveType: 'HTMLOnly' | 'HTMLComplete' | 'MHTML'): Nightmare;
	pdf(path: string, options?: Nightmare.PrintToPDFOptions): Nightmare;
	title(): Nightmare;
	url(): Nightmare;
	use(plugin: (nightmare: Nightmare) => void): Nightmare;
	then<T>(fulfill?: (value: any) => T, reject?: (value: any) => T): Promise<T>;
	catch<T>(reject?: (error: any) => T): Promise<T>;

	////////////////OLD START//////////////////////////
	// Interact
    end(): Nightmare;
    then<T, R>(fn: (value: T) => R): Promise<R>;
    halt(error: string, cb: () => void): Nightmare;
    goto(url: string): Nightmare;
    goto(url: string, headers: Object): Nightmare;
    back(): Nightmare;
    forward(): Nightmare;
    refresh(): Nightmare;
    click(selector: string): Nightmare;
    mousedown(selector: string): Nightmare;
    mouseup(selector: string): Nightmare;
    mouseover(selector: string): Nightmare;
    type(selector: string, text: string): Nightmare;
    insert(selector: string, text: string): Nightmare;
    check(seletor: string): Nightmare;
    uncheck(seletor: string): Nightmare;
    select(seletor: string, option: string): Nightmare;
    upload(selector: string, path: string): Nightmare;
    download(path:string): Nightmare;
    download(action: "cancel" | "continue"): Nightmare;
    scrollTo(top: number, left: number): Nightmare;
    viewport(width: number, height: number): Nightmare;
    inject(type: string, file: string): Nightmare;
    wait(fn: () => any, value: any, delay?: number): Nightmare;
    wait(fn: () => any): Nightmare;
    wait(ms: number): Nightmare;
    wait(selector: string): Nightmare;
    wait(): Nightmare;
    header(header: string, value: string): Nightmare;
    use(plugin: (nightmare: Nightmare) => void): Nightmare;
    run(cb?: (err: any, nightmare: Nightmare) => void): Nightmare;

    // Extract
    exists(selector: string, cb?: (result: boolean) => void): Nightmare;
    visible(selector: string, cb?: (result: boolean) => void): Nightmare;
    on(event: string, cb: () => void): Nightmare;
    on(event: 'initialized', cb: () => void): Nightmare;
    on(event: 'loadStarted', cb: () => void): Nightmare;
    on(event: 'loadFinished', cb: (status: string) => void): Nightmare;
    on(event: 'urlChanged', cb: (targetUrl: string) => void): Nightmare;
    on(event: 'navigationRequested', cb: (url: string, type: string, willNavigate: boolean, main: boolean) => void): Nightmare;
    on(event: 'resourceRequested', cb: (requestData: Nightmare.IRequest, networkRequest: Nightmare.INetwordRequest) => void): Nightmare;
    on(event: 'resourceReceived', cb: (response: Nightmare.IResponse) => void): Nightmare;
    on(event: 'resourceError', cb: (resourceError: Nightmare.IResourceError) => void): Nightmare;
    on(event: 'consoleMessage', cb: (msg: string, lineNumber: number, sourceId: number) => void): Nightmare;
    on(event: 'alert', cb: (msg: string) => void): Nightmare;
    on(event: 'confirm', cb: (msg: string) => void): Nightmare;
    on(event: 'prompt', cb: (msg: string, defaultValue?: string) => void): Nightmare;
    on(event: 'error', cb: (msg: string, trace?: Nightmare.IStackTrace[]) => void): Nightmare;
    on(event: 'timeout', cb: (msg: string) => void): Nightmare;
    once(event: string, cb: () => void): Nightmare;
    once(event: 'initialized', cb: () => void): Nightmare;
    once(event: 'loadStarted', cb: () => void): Nightmare;
    once(event: 'loadFinished', cb: (status: string) => void): Nightmare;
    once(event: 'urlChanged', cb: (targetUrl: string) => void): Nightmare;
    once(event: 'navigationRequested', cb: (url: string, type: string, willNavigate: boolean, main: boolean) => void): Nightmare;
    once(event: 'resourceRequested', cb: (requestData: Nightmare.IRequest, networkRequest: Nightmare.INetwordRequest) => void): Nightmare;
    once(event: 'resourceReceived', cb: (response: Nightmare.IResponse) => void): Nightmare;
    once(event: 'resourceError', cb: (resourceError: Nightmare.IResourceError) => void): Nightmare;
    once(event: 'consoleMessage', cb: (msg: string, lineNumber: number, sourceId: number) => void): Nightmare;
    once(event: 'alert', cb: (msg: string) => void): Nightmare;
    once(event: 'confirm', cb: (msg: string) => void): Nightmare;
    once(event: 'prompt', cb: (msg: string, defaultValue?: string) => void): Nightmare;
    once(event: 'error', cb: (msg: string, trace?: Nightmare.IStackTrace[]) => void): Nightmare;
    once(event: 'timeout', cb: (msg: string) => void): Nightmare;
    removeListener(event: string, cb: () => void): Nightmare;
    removeListener(event: 'initialized', cb: () => void): Nightmare;
    removeListener(event: 'loadStarted', cb: () => void): Nightmare;
    removeListener(event: 'loadFinished', cb: (status: string) => void): Nightmare;
    removeListener(event: 'urlChanged', cb: (targetUrl: string) => void): Nightmare;
    removeListener(event: 'navigationRequested', cb: (url: string, type: string, willNavigate: boolean, main: boolean) => void): Nightmare;
    removeListener(event: 'resourceRequested', cb: (requestData: Nightmare.IRequest, networkRequest: Nightmare.INetwordRequest) => void): Nightmare;
    removeListener(event: 'resourceReceived', cb: (response: Nightmare.IResponse) => void): Nightmare;
    removeListener(event: 'resourceError', cb: (resourceError: Nightmare.IResourceError) => void): Nightmare;
    removeListener(event: 'consoleMessage', cb: (msg: string, lineNumber: number, sourceId: number) => void): Nightmare;
    removeListener(event: 'alert', cb: (msg: string) => void): Nightmare;
    removeListener(event: 'confirm', cb: (msg: string) => void): Nightmare;
    removeListener(event: 'prompt', cb: (msg: string, defaultValue?: string) => void): Nightmare;
    removeListener(event: 'error', cb: (msg: string, trace?: Nightmare.IStackTrace[]) => void): Nightmare;
    removeListener(event: 'timeout', cb: (msg: string) => void): Nightmare;
    screenshot(done?: (err: any, buffer: Buffer) => void): Nightmare;
    screenshot(path: string, done?: (err: any) => void): Nightmare;
    screenshot(clip: { x: number, y: number, width: number, height: number }, done?: (err: any, buffer: Buffer) => void): Nightmare;
    screenshot(path: string, clip?: { x: number, y: number, width: number, height: number }, done?: (err: any) => void): Nightmare;
    html(path: string, saveType: string): Nightmare;
    html(path: string, saveType: 'HTMLOnly'): Nightmare;
    html(path: string, saveType: 'HTMLComplete'): Nightmare;
    html(path: string, saveType: 'MHTML'): Nightmare;
    pdf(path: string): Nightmare;
    pdf(path: string, options: Object): Nightmare;
    pdf(cb: (err: Error, data: Buffer) => void): Nightmare;
    title(): string;
    title(cb: (title: string) => void): Nightmare;
    url(cb: (url: string) => void): Nightmare;
    url(): string;
    path(): string;

    readonly cookies: Nightmare.Cookies;

    // Settings
    authentication(user: string, password: string): Nightmare;
    useragent(useragent: string): Nightmare;
    viewport(width: number, height: number): Nightmare;
    zoom(zoomFactor: number): Nightmare;
	headers(headers: Object): Nightmare;
	
	////////////////OLD END//////////////////////////
}
declare namespace Nightmare {
	export class Cookies {
		get(): [ICookie] & Promise<[ICookie]>;
		get(name: string): ICookie;
		get(query: ICookieQuery): [ICookie];
		set(name: string, value: string): Nightmare;
		set(cookie: ICookie): Nightmare;
		set(cookies: [ICookie]): Nightmare;
		clear(): Nightmare;
		clear(name: string): Nightmare;
		clearAll(): Nightmare;
	}
	export interface NightmareOptions extends BrowserWindowOptions {
		gotoTimeout?: number;
		waitTimeout?: number;
		paths?: Paths;
		electronPath?: string;
		switches?: Switches;
		dock?: boolean;
		openDevTools?: boolean;
	}

	// https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
	export interface Paths {
		home?: string;
		appData?: string;
		userData?: string;
		temp?: string;
		exe?: string;
		module?: string;
		desktop?: string;
		documents?: string;
		downloads?: string;
		music?: string;
		pictures?: string;
		videos?: string;
	}

	// https://github.com/electron/electron/blob/master/docs/api/chrome-command-line-switches.md
	export interface Switches {
		'ignore-connection-limit'?: string;
		'disable-http-cache'?: boolean;
		'disable-http2'?: boolean;
		'remote-debugging-port'?: number;
		'js-flags'?: string;
		'proxy-server'?: string;
		'proxy-bypass-list'?: string;
		'proxy-pac-url'?: string;
		'no-proxy-server'?: boolean;
		'host-rules'?: string;
		'host-resolve-rules'?: string;
		'auth-server-whitelist'?: string;
		'auth-negotiate-delegate-whitelist'?: string;
		'ignore-certificate-errors'?: string;
		'ppapi-flash-path'?: string;
		'ppapi-flash-version'?: string;
		'log-net-log'?: string;
		'ssl-version-fallback-min'?: string;
		'cipher-suite-blacklist'?: string;
		'disable-renderer-backgrounding'?: string;
		'enable-logging'?: boolean;
		'v'?: string;
		'vmodule'?: string;
	}

	export interface BrowserWindowOptions extends Rectangle {
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		useContentSize?: boolean;
		center?: boolean;
		minWidth?: number;
		minHeight?: number;
		maxWidth?: number;
		maxHeight?: number;
		resizable?: boolean;
		movable?: boolean;
		minimizable?: boolean;
		maximizable?: boolean;
		closable?: boolean;
		alwaysOnTop?: boolean;
		fullscreen?: boolean;
		fullscreenable?: boolean;
		skipTaskbar?: boolean;
		kiosk?: boolean;
		title?: string;
		icon?: NativeImage | string;
		show?: boolean;
		frame?: boolean;
		acceptFirstMouse?: boolean;
		disableAutoHideCursor?: boolean;
		autoHideMenuBar?: boolean;
		enableLargerThanScreen?: boolean;
		backgroundColor?: string;
		hasShadow?: boolean;
		darkTheme?: boolean;
		transparent?: boolean;
		type?: BrowserWindowType;
		titleBarStyle?: 'default' | 'hidden' | 'hidden-inset';
		webPreferences?: WebPreferences;
	}

	export type BrowserWindowType = BrowserWindowTypeLinux | BrowserWindowTypeMac;
	export type BrowserWindowTypeLinux = 'desktop' | 'dock' | 'toolbar' | 'splash' | 'notification';
	export type BrowserWindowTypeMac = 'desktop' | 'textured';

	export interface Rectangle {
		x?: number;
		y?: number;
		width?: number;
		height?: number;
	}

	export interface WebPreferences {
		nodeIntegration?: boolean;
		preload?: string;
		session?: string;
		partition?: string;
		zoomFactor?: number;
		javascript?: boolean;
		webSecurity?: boolean;
		allowDisplayingInsecureContent?: boolean;
		allowRunningInsecureContent?: boolean;
		images?: boolean;
		textAreasAreResizable?: boolean;
		webgl?: boolean;
		webaudio?: boolean;
		plugins?: boolean;
		experimentalFeatures?: boolean;
		experimentalCanvasFeatures?: boolean;
		directWrite?: boolean;
		blinkFeatures?: string;
		defaultFontFamily?: {
			standard?: string;
			serif?: string;
			sansSerif?: string;
			monospace?: string;
		};
		defaultFontSize?: number;
		defaultMonospaceFontSize?: number;
		minimumFontSize?: number;
		defaultEncoding?: string;
		backgroundThrottling?: boolean;
	}

	export class NativeImage {
		static createEmpty(): NativeImage;
		static createFromPath(path: string): NativeImage;
		static createFromBuffer(buffer: Buffer, scaleFactor?: number): NativeImage;
		static createFromDataURL(dataURL: string): NativeImage;
		toPng(): Buffer;
		toJpeg(quality: number): Buffer;
		toDataURL(): string;
		getNativeHandle(): Buffer;
		isEmpty(): boolean;
		getSize(): Dimension;
		setTemplateImage(option: boolean): void;
		isTemplateImage(): boolean;
	}

	export interface Dimension {
		width: number;
		height: number;
	}

	export interface PrintToPDFOptions {
		marginsType?: number;
		pageSize?: 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';
		printBackground?: boolean;
		printSelectionOnly?: boolean;
		landscape?: boolean;
	}

	export interface ICookieQuery {
        url?: string;
        name?: string;
        domain?: string;
        path?: string;
        secure?: boolean;
        session?: boolean;

    }
    export interface ICookie {
        name: string;
        value: string;
        url?: string
        domain?: string;
        hostOnly?: boolean;
        path?: string;
        secure?: boolean;
        httpOnly?: boolean;
        session?: boolean;
        expirationDate?: number;
	}
	export interface IConstructorOptions {
        timeout?: any;  // number | string;
        waitTimeout?:number //in ms
        gotoTimeout?:number
        pollInterval?:number
        executionTimeout?:number
        interval?: any; // number | string;
        port?: number;
        weak?: boolean;
        loadImages?: boolean;
        ignoreSslErrors?: boolean;
        sslProtocol?: string;
        webSecurity?: boolean;
        proxy?: string;
        proxyType?: string;
        proxyAuth?: string;
        cookiesFile?: string;
        phantomPath?: string;
        show?: boolean;
        paths?: {
            downloads?:string;
        };
        maxDownloadRequestWait?:number;
        ignoreDownloads?:boolean;
        typeInterval?: number;
        x?: number;
        y?: number;
        electronPath?: string;
        openDevTools?: {
            /**
             * Opens the devtools with specified dock state, can be right, bottom, undocked, detach.
             * https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentsopendevtoolsoptions
             */
            mode?: string;
        };
    }

    export interface IRequest {
        id: number;
        method: string;
        url: string;
        time: Date;
        headers: Object;
    }
    export interface INetwordRequest {
        abort(): void;
        changeUrl(url: string): void;
        setHeader(key: string, value: string): void;
    }
    export interface IResponse {
        id: number;
        url: string;
        time: Date;
        headers: Object;
        bodySize: number;
        contentType: string;
        redirectURL: string;
        stage: string;
        status: number;
        statusText: string;
    }
    export interface IResourceError {
        id: number;
        url: string;
        errorCode: number;
        errorString: string;
    }
    export interface IStackTrace {
        file: string;
        line: number;
        function?: string;
    }
}

export default Nightmare;
export as namespace Nightmare;


//declare module 'nightmare' {
    //export = Nightmare
//}