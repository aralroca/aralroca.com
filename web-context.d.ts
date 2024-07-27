import "brisa";

declare module "brisa" {
  interface WebContext {
    params: Signal<{ [k: string]: string }>;
  }
}