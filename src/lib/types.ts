// helper types (re)written for extendscript

export type Exclude<T, U> = T extends U ? never : T;

export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

export type ConstructorParameters<T> = T extends new (...args: infer P) => any
	? P
	: never;

export type InstanceType<T extends { new (...args: any[]): any }> = T extends {
	new (...args: any[]): infer R;
}
	? R
	: never;

export type NonFunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type OnlyProperties<T> = Pick<T, NonFunctionKeys<T>>;

export type InstanceProps<T extends { new (...args: any[]): any }> =
	OnlyProperties<InstanceType<T>>;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
