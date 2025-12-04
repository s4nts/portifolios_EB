# Site Documental de Artigos

Site simples e minimalista para exibição de artigos documentais, construído com Next.js 13, React, Tailwind CSS e TypeScript.

## Características

- Design minimalista com predominância de tons brancos e claros
- Tipografia profissional usando a fonte Inter
- Layout responsivo e acessível
- Sistema de roteamento dinâmico para artigos
- SEO otimizado com metadados automáticos
- Estrutura simples: Página inicial → Lista de artigos → Página do artigo

## Estrutura do Projeto

```
/
├── app/
│   ├── layout.tsx          # Layout principal com configuração da fonte
│   ├── page.tsx             # Página inicial com listagem de artigos
│   └── articles/
│       └── [slug]/
│           └── page.tsx     # Página de artigo dinâmica
├── components/
│   ├── Header.tsx           # Cabeçalho com logo centralizada
│   ├── ArticleLayout.tsx    # Layout para páginas de artigo
│   ├── ArticleSection.tsx   # Componente de seção de artigo
│   ├── ArticleListItem.tsx  # Item da lista de artigos
│   └── BackButton.tsx       # Botão de voltar
├── lib/
│   └── contentLoader.ts     # Utilitário para carregar artigos
├── content/
│   └── articles/
│       └── modelo-1.json    # Primeiro artigo (30 seções)
└── public/
    └── images/
        ├── logo.png         # Logo do site
        └── modelo1-sec*.jpg # Imagens das seções
```

## Formato dos Artigos

Os artigos são armazenados em arquivos JSON na pasta `content/articles/` com a seguinte estrutura:

```json
{
  "title": "Título do Artigo",
  "slug": "slug-do-artigo",
  "sections": [
    {
      "heading": "Título da Seção",
      "body": "Conteúdo da seção com o objetivo ou descrição.",
      "image": "/images/imagem.jpg"
    }
  ]
}
```

## Como Adicionar Novos Artigos

1. Crie um novo arquivo JSON em `content/articles/`
2. Siga o formato especificado acima
3. Adicione as imagens referenciadas em `public/images/`
4. O artigo aparecerá automaticamente na página inicial

## Instalação e Uso

### Pré-requisitos

- Node.js 18.x ou superior
- NPM

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

### Iniciar Servidor de Produção

```bash
npm start
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run typecheck
```

## CI/CD

O projeto inclui um workflow do GitHub Actions (`.github/workflows/ci.yml`) que executa automaticamente:

- Instalação de dependências
- Verificação de lint
- Verificação de tipos (TypeScript)
- Build do projeto

O workflow é acionado em push ou pull request para as branches `main` ou `master`.

## Tecnologias Utilizadas

- **Next.js 13** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Lucide React** - Ícones
- **Google Fonts (Inter)** - Tipografia

## Personalização

### Alterar Cores

Edite as variáveis CSS em `app/globals.css` na seção `:root`.

### Alterar Fonte

Modifique a importação em `app/layout.tsx` e a configuração em `tailwind.config.ts`.

### Alterar Logo

Substitua o arquivo em `public/images/logo.png` (recomendado: 80x80px).

### Alterar Tamanho das Imagens

Edite as classes em `components/ArticleSection.tsx`:
- Desktop: `w-[320px] h-[200px]`
- Mobile: largura total responsiva

## Estrutura de Páginas

### Página Inicial (`/`)
- Header com logo centralizada (80x80px)
- Lista de artigos com título e subtítulo opcional
- Cards clicáveis minimalistas

### Página de Artigo (`/articles/[slug]`)
- Header com botão "Voltar" e logo pequena (48x48px)
- Título do artigo (H1)
- Seções com heading (H2), corpo de texto e imagem
- Imagens com dimensões fixas e `object-cover`

## SEO

Os metadados (title e description) são gerados automaticamente a partir do conteúdo dos artigos usando a função `generateMetadata` do Next.js 13.

## Licença

Este projeto é de código aberto e está disponível para uso livre.
# portifolios_EB
