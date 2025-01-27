# Application NestJS - Metrics API

Este repositório contém uma aplicação NestJS para gerenciar métricas. Ele oferece endpoints para processar, listar, agrupar e gerar relatórios de métricas.

## Funcionalidades

- **Processamento de Métricas:** Processa um arquivo de métricas e insere os dados no banco de dados.
- **Listagem de Métricas:** Recupera métricas com base em parâmetros de consulta.
- **Agrupamento de Métricas:** Agrupa as métricas com base em critérios e retorna as agregações.
- **Relatório de Métricas Agrupadas:** Gera um relatório no formato XLSX com as métricas agrupadas.

## Endpoints da API

### **Documentação Swagger**
- **Método:** `GET`
- **Rota:** `/docs`
- **Descrição:** Disponibiliza pagina web com a documentação dos endpoints.

## Abaixo estão os principais endpoints configurados para a aplicação.

### 1. **Processar Métricas**
- **Método:** `POST`
- **Rota:** `/metrics/process-metrics`
- **Descrição:** Processa métricas a partir de um arquivo enviado. Utiliza a lógica de negócios para manipular os dados e persistir no banco de dados.

### 2. **Listar Métricas**
- **Método:** `GET`
- **Rota:** `/metrics`
- **Descrição:** Retorna uma lista de métricas. Você pode adicionar parâmetros de consulta para filtrar ou paginar os resultados.

### 3. **Agrupar Métricas**
- **Método:** `GET`
- **Rota:** `/metrics/group`
- **Descrição:** Agrupa as métricas com base nos parâmetros definidos, retornando agregações como totais diários, mensais e anuais.

### 4. **Relatório de Métricas Agrupadas**
- **Método:** `GET`
- **Rota:** `/metrics/group/report`
- **Descrição:** Gera um relatório das métricas agrupadas no formato XLSX. Retorna um link para o arquivo gerado e armazenado no S3.

## Estrutura do Projeto

- **AppModule:** Módulo raiz da aplicação.
- **ClientsModule:** Módulo responsável pela comunicação com outros serviços ou APIs.
- **SharedModule:** Módulo compartilhado que contém utilitários gerais e contratos.
- **DatabaseModule:** Módulo para configurar a conexão com o banco de dados.
- **MetricsModule:** Módulo que contém toda a lógica de métricas, incluindo repositórios e use cases.

## Como Rodar a Aplicação

### Requisitos

- Node.js (versão >= 16.x)
- PostgreSQL (ou outro banco de dados compatível)
- AWS S3 para armazenar os relatórios

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/OpusJoao/desafio_greenyellow
   cd desafio_greenyellow
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (arquivo `.env`):

   Exemplo:
   ```bash
    RABBITMQ_URL='amqp://guest:guest@host.docker.internal:5672?heartbeat=0'
    RABBITMQ_CUSTOMER_PREFETCH_COUNT=10
    DB_HOST=host.docker.internal
    DB_PORT=5432
    DB_USERNAME=myuser
    DB_PASSWORD=mypassword
    DB_NAME=mydatabase
   ```

4. Inicie o servidor:

   ```bash
   npm run start
   ```

5. Acesse a aplicação via:

   ```
   http://localhost:3000
   ```

## Testes

Para rodar os testes unitários sobre a camada de negocios com o Jest:

```bash
npm run check
```



## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções para este projeto! Se você encontrar algum bug ou tiver sugestões, abra uma **issue** ou envie um **pull request**.