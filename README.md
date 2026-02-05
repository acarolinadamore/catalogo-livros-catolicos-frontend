# Biblioteca Católica - Frontend

Frontend da plataforma de catalogação de livros religiosos católicos.

## Tecnologias

- React 18
- Vite
- TailwindCSS
- React Router

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

## Executar

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Build de produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

### Preview do build

```bash
npm run preview
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          # Cabeçalho da aplicação
│   │   │   ├── Footer.jsx          # Rodapé
│   │   │   └── Layout.jsx          # Layout wrapper
│   │   ├── home/
│   │   │   ├── Hero.jsx            # Hero com busca principal
│   │   │   └── Filters.jsx         # Filtros estruturados
│   │   └── books/
│   │       ├── BookCard.jsx        # Card de livro
│   │       └── BookList.jsx        # Lista de livros
│   ├── pages/
│   │   ├── Home.jsx                # Página inicial (catálogo)
│   │   ├── BookDetails.jsx         # Detalhes do livro
│   │   └── About.jsx               # Sobre
│   ├── config/
│   │   └── api.js                  # Configuração da API
│   ├── App.jsx                     # Componente principal
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Páginas

### 1. Home (Catálogo Público)

- Hero com busca centralizada (elemento principal)
- Filtros estruturados colapsáveis
- Lista de livros em grid responsivo
- Busca em tempo real

### 2. Detalhes do Livro

- Capa do livro (ou ícone)
- Informações bibliográficas completas
- Descrição
- Índice do livro
- Metadados pastorais

### 3. Sobre

- Informações institucionais
- Pe. Carlos Alberto Pereira
- Objetivo pastoral
- Nota sobre direitos autorais

## Deploy no Vercel

1. Faça login no Vercel: https://vercel.com
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione a variável de ambiente:
   - `VITE_API_URL`: URL da sua API no Render
5. Deploy!

## Design

### Paleta de Cores

- **Primary**: Tons de roxo/violeta (sóbrio e pastoral)
- **Background**: Cinza muito claro
- **Texto**: Cinza escuro (boa legibilidade)

### Tipografia

- **Sans-serif**: Inter (interface)
- **Serif**: Merriweather (títulos e conteúdo)

### Princípios

- Moderno, mas sóbrio
- Inspirado em bibliotecas
- Foco absoluto na busca
- Tipografia confortável para leitura
- Ícones discretos

---

**Feito para a glória de Deus** ✝️
