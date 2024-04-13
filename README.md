# Benefits Ease

Este projeto visa compartilhar meus conhecimentos em desenvolvimento front-end, além de servir como um espaço para prática de novas abordagens, ferramentas e técnicas. A aplicação é um cenário hipotético que envolve o gerenciamento de benefícios de emprego.

## Pré-requisitos

Para começar, certifique-se de ter os seguintes itens instalados:

- [Node.js](package.json#L4)
- [NPM](package.json#L5)
- [PNPM](package.json#L6)

## Comandos

#### Instalação

```sh
pnpm install
```

#### Compilação

```sh
pnpm build
```

#### Desenvolvimento

```sh
pnpm dev
```

#### Testes

```sh
pnpm test
```

#### Uso

```sh
pnpm start
```

## Visão geral

Este projeto está estruturado nos seguintes diretórios:

#### `apps/web`

Neste diretório está a aplicação voltada para a perspectiva do usuário dos benefícios. Aqui, é possível:

- Criar uma conta de usuário.
- Realizar login.
- Atualizar informações da conta.
- Excluir a conta.
- Visualizar o extrato de transações.

#### `apps/admin`

Este diretório abriga a aplicação destinada à visão administrativa dos benefícios. Aqui, é possível:

- Cadastrar novos benefícios.
- Registrar contas de benefício.
- Registrar transações.

#### `packages/*`

Os pacotes são concebidos para serem simples e devem ser utilizados somente quando um módulo é compartilhado por duas ou mais aplicações.
