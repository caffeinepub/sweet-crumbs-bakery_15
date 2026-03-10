import type { backendInterface } from "./backend";
import { createActorWithConfig } from "./config";

let _actor: backendInterface | null = null;
let _pending: Promise<backendInterface> | null = null;

async function getActor(): Promise<backendInterface> {
  if (_actor) return _actor;
  if (_pending) return _pending;
  _pending = createActorWithConfig().then((a) => {
    _actor = a;
    _pending = null;
    return a;
  });
  return _pending;
}

export const backend: backendInterface = new Proxy({} as backendInterface, {
  get(_target, prop: string) {
    return (...args: unknown[]) =>
      getActor().then((a) => (a as any)[prop](...args));
  },
});
