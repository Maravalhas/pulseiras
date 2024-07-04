export function clsx(...args: any) {
  args = args.filter((value: any) => typeof value === "string");
  return String(args).replaceAll(",", " ");
}

export function collateString(string: string) {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const formatted = formatter.format(value);

  return formatted;
}
