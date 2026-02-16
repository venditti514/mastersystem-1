"use client";

import { useThemeStore } from "@/lib/store-theme";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-8">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Configurações
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Aparência, contas bancárias, categorias e integrações
        </p>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Aparência</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Escolha o tema claro ou escuro da interface
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                theme === "light"
                  ? "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              <Sun className="h-4 w-4" />
              Claro
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                theme === "dark"
                  ? "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              <Moon className="h-4 w-4" />
              Escuro
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Contas bancárias</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gerencie contas correntes, caixa e aplicações
          </p>
          <button className="mt-4 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Configurar →
          </button>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Categorias de receitas e despesas</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Classificação de lançamentos financeiros
          </p>
          <button className="mt-4 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Configurar →
          </button>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Formas de pagamento</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            PIX, boleto, transferência, cartão, dinheiro
          </p>
          <button className="mt-4 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Configurar →
          </button>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Integração bancária</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Importação automática de extratos
          </p>
          <button className="mt-4 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Configurar →
          </button>
        </div>
      </div>
    </div>
  );
}
