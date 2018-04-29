import { Either, EitherType, First } from '@totemish/core';
import { ActionInterface } from './interface/action.interface';

/**
 * @class ActionPipeline
 */
export class ActionPipeline {
  public static for = (action: ActionInterface) => ActionPipeline.from([], action, []);
  public static empty = () => ActionPipeline.from([], null, []);
  public static from = (before: ActionInterface[], action: ActionInterface, after: ActionInterface[]) =>
    new ActionPipeline(before, First.of(<any> Either.fromNullable(action)), after)

  private readonly _action: First<EitherType<ActionInterface>>;
  private _before: ActionInterface[] = [];
  private _after: ActionInterface[] = [];

  public constructor(before: ActionInterface[], action: First<EitherType<ActionInterface>>, after: ActionInterface[]) {
    this._action = action;
    this._after = after;
    this._before = before;
  }

  public concat = ({ before, rawAction, after }: ActionPipeline) =>
    new ActionPipeline(this._before.concat(before), this._action.concat(rawAction), this._after.concat(after))

  public get action(): ActionInterface {
    return <any> this._action.get();
  }

  public get before(): ActionInterface[] {
    return this._before;
  }

  public get after(): ActionInterface[] {
    return this._after;
  }

  public setAction = (action: ActionInterface) =>
    this.concat(ActionPipeline.from(this._before.concat([]), action, this._after.concat([])))

  public addBefore = (middleware: ActionInterface | ActionInterface[]) =>
    this._before = Array.isArray(middleware) ? middleware : [ middleware ]

  public addAfter = (middleware: ActionInterface | ActionInterface[]) =>
    this._after = Array.isArray(middleware) ? middleware : [ middleware ]

  public toString = (): string =>
    `ActionPipeline([${this._before.toString()}] => ${this._action.toString()} => [${this._after}])`

  public toPipeline = (): ActionInterface[] =>
    this._before.concat([this.action]).concat(this._after)

  private get rawAction(): First<EitherType<ActionInterface>> {
    return this._action;
  }
}
