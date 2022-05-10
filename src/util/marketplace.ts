import { parseNearAmount } from "near-api-js/lib/utils/format";
import { Big } from "big.js";
const GAS = Big(3)
  .times(10 ** 13)
  .toFixed();
export function addclothe(product: {
  name: string;
  image: string;
  price: number;
  quantity: number;
}) {
  //@ts-ignore
  return window.contract.addclothe({
    name: product.name.toString(),
    image: product.image.toString(),
    price: product.price.toString(),
    quantity: product.quantity.toString(),
  });
}

export function getclothes() {
  //@ts-ignore
  return window.contract.getclothes();
}

export async function buy_clothe({ id, price }: { id: number; price: number }) {
  //@ts-ignore
  price = parseNearAmount(price.toString() + "");
  //@ts-ignore
  await window.contract.buy({ id: id.toString() }, GAS, price);
}
