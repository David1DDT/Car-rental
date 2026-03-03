import { IStaticMethods } from "flyonui/flyonui";

declare module "flyonui" {
  const flyonui: any;
  export default flyonui;
}

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export { };
