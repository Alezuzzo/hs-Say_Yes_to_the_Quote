// src/utils/formatadores.ts

// Formata datas no padrão brasileiro (dd/mm/aaaa)
export const formatarData = (dataString: string | Date): string => {
  // Se já for um objeto Date, usa diretamente
  if (dataString instanceof Date) {
    return dataString.toLocaleDateString("pt-BR");
  }

  // Se for string, tenta converter para Date
  const data = new Date(dataString);

  // Verifica se a data é válida
  if (isNaN(data.getTime())) {
    console.error("Data inválida:", dataString);
    return "Data inválida";
  }

  return data.toLocaleDateString("pt-BR");
};

// Formata valores monetários no padrão brasileiro (R$ 1.234,56)
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Opcional: função para formatar números com casas decimais
export const formatarNumero = (
  valor: number,
  casasDecimais = 2
): string => {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
};

export function formatarTelefone(telefone: string): string {
  // Remove all non-digit characters
  const cleaned = telefone.replace(/\D/g, "");
  // Format as (XX) XXXXX-XXXX
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
    2,
    7
  )}-${cleaned.slice(7, 11)}`;
}
