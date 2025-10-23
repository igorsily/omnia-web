# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos Essenciais

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor de desenvolvimento na porta 3001
pnpm build            # Compila o projeto para produção
pnpm serve            # Preview da build de produção
pnpm check-types      # Verifica tipos TypeScript sem emitir arquivos

# Linting e Formatação
npx ultracite fix     # Formata e corrige código automaticamente
npx ultracite check   # Verifica problemas sem corrigir
```

## Arquitetura do Projeto

### Stack Principal
- **React 19** com TypeScript
- **Vite** como bundler
- **TanStack Router** para roteamento (file-based routing)
- **TanStack Query** para gerenciamento de estado do servidor
- **Better Auth** para autenticação
- **Zustand** para estado global
- **Tailwind CSS v4** para estilização
- **Radix UI** como base de componentes
- **Biome** com **Ultracite** para linting/formatação

### Estrutura de Roteamento

O projeto usa TanStack Router com **file-based routing**:

- `src/routes/__root.tsx` - Layout raiz com ThemeProvider, Toaster e **auth context global**
- `src/routes/_authenticated.tsx` - Layout para rotas autenticadas (com sidebar)
- `src/routes/_public.tsx` - Layout para rotas públicas
- `src/routeTree.gen.ts` - Árvore de rotas gerada automaticamente

**Route Guards (Sistema Global):**

O auth guard é centralizado e funciona através do **Router Context**:

1. **`src/guards/route-guard.ts`** - Guard centralizado
   - `createAuthContext()` - Busca sessão e retorna contexto de autenticação
   - `authGuard()` - Valida autenticação baseado em meta da rota

2. **`__root.tsx`** - Injeta auth context via `beforeLoad`
   - Executa `createAuthContext()` antes de cada navegação
   - Atualiza o contexto do router com estado de autenticação

3. **Rotas protegidas** - Acessam `context.auth` no `beforeLoad`
   - `_authenticated.tsx` - Redireciona para `/login` se não autenticado
   - `_public.tsx` - Redireciona para `/dashboard` se autenticado

**Exemplo de uso em novas rotas:**
```typescript
export const Route = createFileRoute("/minha-rota")({
  beforeLoad: ({ context }) => {
    // Contexto de autenticação disponível globalmente
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: MinhaRota,
});
```

### Sistema de Autenticação

**Better Auth Client** (`src/lib/auth-client.ts`):
- Base URL configurada via `VITE_SERVER_URL` (.env)
- Plugin de username habilitado
- Credentials included para cookies

**Auth Store** (`src/stores/auth-store.ts`):
- Zustand store com persist middleware
- Métodos principais: `fetchSession()`, `login()`, `logout()`, `refresh()`
- Toast notifications via Sonner (sucesso e erro)
- **Usado diretamente como hook nos componentes** - não há camada adicional de abstração
- **Não gerencia navegação** - componentes são responsáveis por navegar após login/logout

**Uso do Auth Store em componentes:**
```typescript
// Acessar usuário e métodos diretamente do store
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Navegação é responsabilidade do componente
const navigate = useNavigate();
const response = await login(username, password);
if (response.success) {
  navigate({ to: "/dashboard" });
}
```

### Componentes UI

Todos os componentes UI estão em `src/components/ui/` baseados em Radix UI:
- Avatar, Button, Card, Checkbox, Dialog, Input, Label, etc.
- Sidebar com AppSidebar, NavMain, NavUser, TeamSwitcher
- Theme toggle com next-themes

### Configurações Importantes

**Path Alias:**
```typescript
"@/*" -> "./src/*"
```

**TypeScript:**
- `strict: true` e `strictNullChecks: true`
- Nunca use `any` ou `as`
- Deixe o compilador inferir tipos sempre que possível

**Vite Config:**
- Plugins: TailwindCSS, TanStack Router, React
- Porta padrão: 3001

### Ultracite Rules

O projeto usa **Ultracite** (configurado via `biome.jsonc`) que estende regras rigorosas de acessibilidade, qualidade de código, e boas práticas. Principais pontos:

- Accessibility (a11y) - WCAG 2.0 compliance
- Zero `any`, evite `as`, prefira inferência de tipos
- Proibido: enums TS, namespaces, non-null assertions (`!`)
- Use `export type` e `import type` para tipos
- React: hooks no top-level, evite index keys, use fragments shorthand
- Prefira `for...of` ao invés de `forEach`
- Use arrow functions ao invés de function expressions
- Nunca use `console`, `debugger`, ou `eval` em produção

Consulte `.rules` para a lista completa de regras de linting e boas práticas.

### Padrões de Código

**Nomenclatura:**
- Componentes: PascalCase
- Arquivos: kebab-case
- Funções/variáveis: camelCase
- Constantes: SNAKE_CAPS
- Named exports (nunca default exports)

**React:**
- Não declare funções/constantes dentro de componentes
- Use React Query ao invés de useEffect para fetch
- Prefira `<Suspense>` e `useSuspenseQuery`
- Use enum para cache keys do React Query

**Error Handling:**
```typescript
// Tipo customizado AppError em src/types/error.ts
import { toAppError } from "@/types/error";

try {
  // operação
} catch (err: unknown) {
  const error: AppError = toAppError(err);
  // tratar error.message
}
```

## Variáveis de Ambiente

Copie `.env.example` para `.env`:
```bash
VITE_SERVER_URL=  # URL do servidor de autenticação
```
