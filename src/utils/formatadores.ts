export function formatarData(dataString: string): string {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

export function formatarTelefone(value: string): string {
  const nums = value.replace(/\D/g, "");
  if (nums.length <= 2) return `(${nums}`;
  if (nums.length <= 6)
    return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 10)
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(
      6
    )}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(
    7,
    11
  )}`;
}
