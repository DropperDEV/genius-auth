# Genius Auth

Este projeto é um servidor backend para autenticação e busca de músicas na API do Genius, utilizando Node.js, Express, e OAuth2 para autenticação.

## Tecnologias Utilizadas
- Node.js
- Express
- Axios
- Cors
- Cookie-Parser
- Dotenv

## Configuração

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### Instalação
1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/genius-auth.git
   ```
2. Navegue até o diretório do projeto:
   ```sh
   cd genius-auth
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```

### Configuração das Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```env
CLIENT_ID=seu_client_id
CLIENT_SECRET=seu_client_secret
REDIRECT_URI=seu_redirect_uri
PORT=5000
FRONTEND_URL=http://localhost:5173/reactSongs
BACKEND_URL=http://localhost:5000
```

## Como Usar

### Iniciando o Servidor
Execute o seguinte comando:
```sh
node index.js
```
O servidor será iniciado na porta 5000 (ou na definida no `.env`).

### Endpoints

#### Autenticação
- `GET /login` - Redireciona para a página de login do Genius.
- `GET /callback` - Processa o código de autorização e obtém o token de acesso.
- `GET /logout` - Limpa o cookie do token de acesso.
- `GET /check-auth` - Verifica se o usuário está autenticado.

#### Funcionalidades
- `GET /search?q={termo}` - Busca músicas pelo termo fornecido (requer autenticação).
- `GET /account-info` - Obtém informações da conta do usuário autenticado.

### Personalização de URLs
Para adaptar o projeto a diferentes ambientes, modifique as variáveis `FRONTEND_URL` e `BACKEND_URL` no arquivo `.env`.

## Segurança
- O token de acesso é armazenado em um cookie HTTP-only e seguro.
- O CORS permite requisições apenas de origens permitidas.

## Melhorias Futuras
- Implementação de refresh token.
- Melhor tratamento de erros e logs.
- Frontend para facilitar a autenticação.

## Licença
Este projeto é de código aberto e está sob a licença MIT.

