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

export function getProductFinalPrice(product: {
  price: number;
  quantity: number;
  discount?: number;
  discount_type?: number;
}) {
  let finalPrice =
    product.price && product.quantity ? product.price * product.quantity : 0;

  if (product.discount) {
    switch (product.discount_type) {
      case 1:
        finalPrice = finalPrice - finalPrice * (+product.discount / 100);
        break;
      case 2:
        finalPrice = finalPrice - +product.discount;
        break;
      case 3:
        finalPrice = finalPrice - +product.discount * product.quantity;
        break;
    }
  }
  return finalPrice >= 0 ? finalPrice : 0;
}
