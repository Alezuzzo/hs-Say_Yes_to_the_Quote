import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Servico } from "../types/types";

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  preco: yup
    .number()
    .required("Preço é obrigatório")
    .positive("Preço deve ser positivo"),
  tipo: yup
    .string()
    .required("Tipo é obrigatório")
    .oneOf(["produto", "servico"]),
});

interface EstoqueFormProps {
  onSubmit: (servico: Servico) => void;
  servico: Servico | null;
  onCancel: () => void;
}

const EstoqueForm: React.FC<EstoqueFormProps> = ({
  onSubmit,
  servico,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Servico>({
    resolver: yupResolver(schema),
    defaultValues: servico || {
      nome: "",
      preco: 0,
      tipo: "servico",
    },
  });

  useEffect(() => {
    if (servico) {
      reset(servico);
    } else {
      reset({
        nome: "",
        preco: 0,
        tipo: "servico",
      });
    }
  }, [servico, reset]);

  const handleFormSubmit = (data: Servico) => {
    onSubmit(data);
    if (!servico) {
      reset({
        nome: "",
        preco: 0,
        tipo: "servico",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome*
        </label>
        <input
          {...register("nome")}
          className={`mt-1 block w-full rounded-md border ${
            errors.nome ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-purple-500 focus:ring-purple-500`}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço*
        </label>
        <input
          type="number"
          step="0.01"
          {...register("preco")}
          className={`mt-1 block w-full rounded-md border ${
            errors.preco ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-purple-500 focus:ring-purple-500`}
        />
        {errors.preco && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preco.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo*
        </label>
        <select
          {...register("tipo")}
          className={`mt-1 block w-full rounded-md border ${
            errors.tipo ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-purple-500 focus:ring-purple-500`}
        >
          <option value="servico">Serviço</option>
          <option value="produto">Produto</option>
        </select>
        {errors.tipo && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tipo.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {servico && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {servico ? "Salvar Alterações" : "Adicionar Item"}
        </button>
      </div>
    </form>
  );
};

export default EstoqueForm;
