export function clsx(...args: any) {
  args = args.filter((value: any) => typeof value === "string");
  return String(args).replaceAll(",", " ");
}

export function collateString(string: string) {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
