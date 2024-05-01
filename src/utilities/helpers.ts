export function clsx(...args: any) {
  args = args.filter((value: any) => typeof value === "string");
  return String(args).replaceAll(",", " ");
}
