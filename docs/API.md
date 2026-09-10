# API REST — CRM de Clientes

Documentação da API REST desenvolvida para o **CRM de Clientes**.

A API permite consultar, cadastrar, atualizar e excluir clientes e interações comerciais utilizando endpoints REST.

---

## Versão

- **API:** v1
- **CRM:** v3.0.0
- **Framework:** Next.js
- **Banco de dados:** PostgreSQL / Supabase
- **Autenticação:** Supabase Auth

---

# Autenticação

Os endpoints da API são protegidos pela autenticação do CRM utilizando **Supabase Auth**.

Para acessar os recursos protegidos, o usuário deve possuir uma sessão autenticada válida.

Tentativas de acesso sem autenticação são bloqueadas pela aplicação.

---

# Clientes

## Listar clientes

### GET

```text
/api/v1/clientes
```

Retorna os clientes cadastrados no CRM.

### Exemplo

```text
GET /api/v1/clientes
```

### Exemplo de resposta

```json
{
  "sucesso": true,
  "total": 6,
  "dados": [
    {
      "id": 10,
      "nome": "João Silva",
      "email": "joao.silva@gmail.com",
      "telefone": "(48) 99991-0001",
      "empresa": "Silva SA",
      "cargo": "Gerente",
      "cidade": "Palhoça",
      "estado": "SC",
      "status": "Ativo",
      "observacoes": "Cliente cadastrado no CRM"
    }
  ]
}
```

---

## Filtros de clientes

O endpoint de listagem permite utilizar parâmetros de consulta para filtrar os resultados.

### Filtrar por status

```text
GET /api/v1/clientes?status=Ativo
```

Status permitidos:

- `Ativo`
- `Prospect`
- `Inativo`

Um status não permitido retorna erro de validação.

Exemplo:

```text
GET /api/v1/clientes?status=Bloqueado
```

Resposta:

```json
{
  "sucesso": false,
  "erro": "Status inválido."
}
```

---

## Buscar clientes

A API permite pesquisar clientes utilizando os campos suportados pela rota de listagem.

Exemplo:

```text
GET /api/v1/clientes?busca=Silva
```

A busca pode localizar registros a partir das informações configuradas na API, como nome, e-mail ou empresa.

---

## Paginação

A listagem de clientes possui suporte a paginação.

Exemplo:

```text
GET /api/v1/clientes?pagina=1
```

Os parâmetros de paginação podem ser combinados com filtros e busca.

---

## Buscar cliente por ID

### GET

```text
/api/v1/clientes/:id
```

Retorna um cliente específico.

### Exemplo

```text
GET /api/v1/clientes/10
```

### Exemplo de resposta

```json
{
  "sucesso": true,
  "dados": {
    "id": 10,
    "nome": "João Silva",
    "email": "joao.silva@gmail.com",
    "telefone": "(48) 99991-0001",
    "empresa": "Silva SA",
    "cargo": "Gerente",
    "cidade": "Palhoça",
    "estado": "SC",
    "status": "Ativo",
    "observacoes": "Cliente cadastrado no CRM"
  }
}
```

Caso o cliente não exista, a API retorna um erro `404`.

---

# Criar cliente

## POST

```text
/api/v1/clientes
```

Cria um novo cliente no CRM.

### Exemplo de payload

```json
{
  "nome": "Cliente API",
  "email": "cliente@empresa.com",
  "telefone": "(48) 99999-0000",
  "empresa": "Empresa API",
  "cargo": "Gerente",
  "cidade": "Florianópolis",
  "estado": "SC",
  "status": "Prospect",
  "observacoes": "Cliente criado pela API"
}
```

O campo `nome` é obrigatório.

Os valores permitidos para `status` são:

- `Ativo`
- `Prospect`
- `Inativo`

### Resposta de sucesso

HTTP:

```text
201 Created
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Cliente criado com sucesso.",
  "dados": {
    "id": 11,
    "nome": "Cliente API",
    "email": "cliente@empresa.com",
    "telefone": "(48) 99999-0000",
    "empresa": "Empresa API",
    "cargo": "Gerente",
    "cidade": "Florianópolis",
    "estado": "SC",
    "status": "Prospect",
    "observacoes": "Cliente criado pela API"
  }
}
```

---

# Atualizar cliente

## PUT

```text
/api/v1/clientes/:id
```

Atualiza os dados de um cliente existente.

### Exemplo

```text
PUT /api/v1/clientes/11
```

### Exemplo de payload

```json
{
  "nome": "Cliente API Atualizado",
  "email": "cliente.api@teste.com",
  "telefone": "(48) 99999-0000",
  "empresa": "Empresa API Atualizada",
  "cargo": "Gerente",
  "cidade": "Florianópolis",
  "estado": "SC",
  "status": "Ativo",
  "observacoes": "Atualizado via API V3"
}
```

### Resposta de sucesso

```text
200 OK
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Cliente atualizado com sucesso.",
  "dados": {
    "id": 11,
    "nome": "Cliente API Atualizado",
    "status": "Ativo"
  }
}
```

---

# Excluir cliente

## DELETE

```text
/api/v1/clientes/:id
```

Exclui definitivamente um cliente pelo ID.

### Exemplo

```text
DELETE /api/v1/clientes/11
```

### Resposta de sucesso

```text
200 OK
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Cliente excluído com sucesso.",
  "dados": {
    "id": 11,
    "nome": "Cliente API Atualizado"
  }
}
```

Caso o cliente não exista, a API retorna:

```text
404 Not Found
```

---

# Interações

As interações representam os contatos e atividades comerciais realizados com os clientes.

Os tipos de interação atualmente suportados são:

- `Ligação`
- `E-mail`
- `Reunião`
- `WhatsApp`
- `Proposta`
- `Outro`

---

# Listar interações de um cliente

## GET

```text
/api/v1/clientes/:id/interacoes
```

Retorna o histórico de interações de determinado cliente.

### Exemplo

```text
GET /api/v1/clientes/4/interacoes
```

### Exemplo de resposta

```json
{
  "sucesso": true,
  "clienteId": 4,
  "total": 1,
  "dados": [
    {
      "id": 12,
      "cliente_id": 4,
      "tipo": "Reunião",
      "descricao": "Reunião com cliente",
      "data_interacao": "2026-09-08T23:17:00+00:00",
      "criado_em": "2026-09-07T23:20:30.066114+00:00",
      "proximo_contato": "2026-09-10T13:30:00+00:00",
      "concluido": false,
      "concluido_em": null
    }
  ]
}
```

Caso o cliente consultado não possua interações:

```json
{
  "sucesso": true,
  "clienteId": 999,
  "total": 0,
  "dados": []
}
```

---

# Criar interação

## POST

```text
/api/v1/clientes/:id/interacoes
```

Cria uma nova interação para determinado cliente.

### Exemplo

```text
POST /api/v1/clientes/4/interacoes
```

### Exemplo de payload

```json
{
  "tipo": "Ligação",
  "descricao": "Contato realizado com o cliente",
  "data_interacao": "2026-09-09T18:30:00",
  "proximo_contato": "2026-09-10T10:00:00"
}
```

### Campos

| Campo | Descrição |
|---|---|
| `tipo` | Tipo da interação |
| `descricao` | Descrição do contato realizado |
| `data_interacao` | Data e hora da interação |
| `proximo_contato` | Data e hora do próximo contato, quando aplicável |

### Tipos permitidos

```text
Ligação
E-mail
Reunião
WhatsApp
Proposta
Outro
```

### Resposta de sucesso

```text
201 Created
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Interação criada com sucesso.",
  "cliente": {
    "id": 4,
    "nome": "Cliente"
  },
  "dados": {
    "id": 13,
    "cliente_id": 4,
    "tipo": "Ligação",
    "descricao": "Contato realizado com o cliente",
    "concluido": false
  }
}
```

A API verifica se o cliente informado existe antes de cadastrar a interação.

Caso o cliente não exista:

```text
404 Not Found
```

---

# Atualizar interação

## PUT

```text
/api/v1/interacoes/:id
```

Atualiza uma interação existente.

### Exemplo

```text
PUT /api/v1/interacoes/13
```

### Exemplo de payload

```json
{
  "tipo": "E-mail",
  "descricao": "Interação atualizada pela API V3",
  "data_interacao": "2026-09-09T22:39:59.655Z",
  "proximo_contato": null,
  "concluido": true
}
```

Quando uma interação é marcada como concluída, o campo `concluido_em` recebe a data e hora da conclusão.

### Resposta de sucesso

```text
200 OK
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Interação atualizada com sucesso.",
  "dados": {
    "id": 13,
    "tipo": "E-mail",
    "descricao": "Interação atualizada pela API V3",
    "concluido": true,
    "concluido_em": "2026-09-09T22:40:01.179Z"
  }
}
```

Caso a interação não exista:

```text
404 Not Found
```

---

# Excluir interação

## DELETE

```text
/api/v1/interacoes/:id
```

Exclui definitivamente uma interação.

### Exemplo

```text
DELETE /api/v1/interacoes/13
```

### Resposta de sucesso

```text
200 OK
```

Exemplo:

```json
{
  "sucesso": true,
  "mensagem": "Interação excluída com sucesso.",
  "dados": {
    "id": 13,
    "cliente_id": 4,
    "tipo": "E-mail",
    "descricao": "Interação atualizada pela API V3"
  }
}
```

Se a interação já tiver sido excluída ou não existir:

```text
404 Not Found
```

---

# Estrutura dos endpoints

## Clientes

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/clientes` | Lista clientes |
| GET | `/api/v1/clientes/:id` | Busca cliente por ID |
| POST | `/api/v1/clientes` | Cria cliente |
| PUT | `/api/v1/clientes/:id` | Atualiza cliente |
| DELETE | `/api/v1/clientes/:id` | Exclui cliente |

## Interações

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/clientes/:id/interacoes` | Lista interações de um cliente |
| POST | `/api/v1/clientes/:id/interacoes` | Cria interação |
| PUT | `/api/v1/interacoes/:id` | Atualiza interação |
| DELETE | `/api/v1/interacoes/:id` | Exclui interação |

---

# Códigos HTTP

| Código | Significado |
|---|---|
| `200` | Operação realizada com sucesso |
| `201` | Recurso criado com sucesso |
| `400` | Dados da requisição inválidos |
| `401` | Usuário não autenticado |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

# Estrutura de resposta

As respostas da API utilizam JSON.

Uma operação realizada com sucesso normalmente utiliza a propriedade:

```json
{
  "sucesso": true
}
```

Quando ocorre um erro:

```json
{
  "sucesso": false,
  "erro": "Descrição do erro."
}
```

Dependendo da operação, a resposta também pode conter:

```text
mensagem
dados
total
clienteId
```

---

# Segurança

A API utiliza a infraestrutura de autenticação do **Supabase Auth**.

As rotas protegidas exigem uma sessão autenticada válida.

As credenciais e chaves utilizadas pela aplicação são configuradas através de variáveis de ambiente e não devem ser armazenadas diretamente no código-fonte.

---

# Tecnologias

A API foi desenvolvida utilizando:

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Supabase Auth
- REST API
- Vercel

---

# Ambiente de testes

Durante o desenvolvimento da V3 foi criada uma interface interna para validação dos endpoints:

```text
/testes-api
```

Essa página é destinada ao desenvolvimento e permite testar operações da API e visualizar:

- método HTTP;
- código de status;
- corpo da resposta JSON;
- criação de clientes;
- atualização de clientes;
- exclusão de clientes.

---

# Próximas evoluções

Entre as evoluções planejadas para a V3 estão:

- relatórios;
- exportação CSV;
- exportação XLSX;
- exportação PDF;
- oportunidades e funil comercial;
- perfis e permissões de usuários;
- integrações externas;
- webhooks;
- integração com WhatsApp Business;
- campanhas de comunicação com múltiplos clientes;
- registro automático das comunicações no histórico do CRM.

---

# CRM de Clientes

**Versão 3.0.0**

Projeto desenvolvido como aplicação de CRM e portfólio técnico utilizando Next.js, TypeScript, Supabase e Vercel.