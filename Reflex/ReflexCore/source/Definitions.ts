
namespace Reflex
{
	/** */
	export enum mutation
	{
		any = "mutation-any",
		branch = "mutation-branch",
		branchAdd = "mutation-branch-add",
		branchRemove = "mutation-branch-remove",
		content = "mutation-content",
		contentAdd = "mutation-content-add",
		contentRemove = "mutation-content-remove"
	}
}

declare namespace Reflex.Core
{
	/** */
	export type Voidable<T> = 
		T |
		false |
		void;
	
	/**
	 * Marker interface that defines an object that can have
	 * reflexive values attached to it.
	 * (For example: HTMLElement or NSWindow)
	 */
	export interface IBranch extends Object { }
	
	/**
	 * Marker interface that defines an object that represents
	 * a block of visible content in the tree.
	 * (For example: the W3C DOM's Text object)
	 */
	export interface IContent extends Object { }
	
	/**
	 * A type that identifies the primitive types that can exist
	 * in any reflexive arguments list.
	 */
	export type Primitive<TMeta = object, TBranch = object, TAdditionals = unknown> =
		Voidable<TMeta | TAdditionals> |
		Iterable<TMeta | TAdditionals> |
		AsyncIterable<TMeta | TAdditionals> |
		Promise<TMeta | TAdditionals> |
		((branch: TBranch, children: TMeta[]) => Primitives<TMeta, TBranch, TAdditionals>) |
		Recurrent | 
		IAttributes;
	
	/**
	 * 
	 */
	export type Primitives<N = object, B = object, A = unknown> =
		N |
		B |
		A |
		Primitive<N, B, A> |
		Primitive<N, B, Primitive<N, B, A>> |
		Primitive<N, B, Primitive<N, B, Primitive<N, B, A>>> |
		Primitive<N, B, Primitive<N, B, Primitive<N, B, Primitive<N, B, A>>>>;
	
	/** */
	export interface IAttributes<T = string | number | bigint | boolean>
	{
		[attributeName: string]: Voidable<T> | StatefulForce<Voidable<T>>;
	}
	
	/**
	 * Abstract definition of the content variant of the top-level
	 * namespace function.
	 */
	export interface IContentNamespace<TPreparedContent, TContent>
	{
		(
			template:
				TemplateStringsArray | 
				Voidable<TContent> | 
				StatefulForce<Voidable<TContent>>,
			
			...values: (
				IBranch | 
				Voidable<TContent> | 
				StatefulForce<Voidable<TContent>>)[]
		): TPreparedContent;
	}
	
	/**
	 * Abstract definition of the container variant of the top-level
	 * namespace function.
	 */
	export interface IContainerNamespace<P extends Primitives, TResult = object>
	{
		(...primitives: P[]): TResult;
	}
	
	/**
	 * Defines a relative or specific meta reference, used for indicating
	 * an insertion position of a new meta within a Reflexive tree.
	 */
	export type Ref = IBranch | IContent | "prepend" | "append";
	
	/**
	 * Generic function definition for callback functions provided to
	 * the global on() function.
	 */
	export type RecurrentCallback<T extends Primitives = Primitives> = (...args: any[]) => T;
	
	/**
	 * 
	 */
	export type ObjectForce<T> = {
		[P in keyof T]:
			T[P] extends (string | number | bigint | boolean | null) ? StatefulForce<T[P]> :
			T[P] extends Array<infer U> ? ArrayForce<U> :
			T[P];
	}
	
	/**
	 * A mapped type that extracts the names of the methods and
	 * function-valued fields out of the specified type.
	 */
	export type MethodNames<T> = {
		[K in keyof T]: T[K] extends ((...args: any[]) => any) ? K : never;
	}[keyof T];

	/**
	 * Extracts any return type from the specified type, in the case
	 * when the type specified is a function.
	 */
	export type MaybeReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
	
	/**
	 * Extracts the methods out of the type, and returns a mapped object type
	 * whose members are transformed into branch creation methods.
	 */
	export type AsBranchMethods<T> = {
		[M in Reflex.Core.MethodNames<T>]: 
			(...primitives: Primitives[]) =>
				Reflex.Core.MaybeReturnType<T[M]>
	};
}
