# QuebraDev API

API de serviços do QuebraDev

URL do serviço online: `http://`

# Rodando

Para rodar este projeto você precisa do docker e docker compose. Baixe-os e em seguida rode o comando:

```sh
docker-compose up --build -d
```

Alguns containers serão criados:

| Nome                 | Portas     | Descrição                                                |
| -------------------- | ---------- | -------------------------------------------------------- |
| quebradev-api        | 3000       | API responsável pela geração e validação de certificados |
| quebradev-localstack | 4566, 4572 | Responsável por simular o comportamento do S3 localmente |
| quebradev-mongodb    | 27017      | MongoDB responsável por armazenar dados dos certificados |

Para rodar os buckets local voce precisa ter instalado o `awslocal` e então executar os seguintes comandos:

```sh
awslocal s3 mb s3://certificados
awslocal s3 mb s3://certificados/bases
awslocal s3 mb s3://certificados/certificados
```

O comando a seguir sobe a base de fundo do certificado, caso voce queira adicionar outra base deve modificar esse arquivo:

```sh
awslocal s3 cp src/images/certificado-base.png s3://certificados/bases/certificado-base.png
```

E o upload abaixo copia seu arquivo de assinatura para a base, para cada responsável ou professor que irá assinar os certificados eles precisam conter o arquivo no s3 com o seguinte padrão `{nome}-assinatura.png` onde nome é o nome do responsável.

```sh
awslocal s3 cp src/images/teste-assinatura.png s3://certificados/bases/teste-assinatura.png
```

# Serviços

## Auth

A autenticação é feita por basic auth, localmente as credenciais são: `admin` e a senha `password`. Esses dados são definidos no [docker-compose.yaml](./docker-compose.yaml).

## Certificados

### POST \[/certified\]

Para criar um novo certificado utilize o curl abaixo com o basic auth:

```sh
curl --location -u admin:password 'http://localhost:3000/certified' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Lorem Ipsum",
    "documents": {
        "rg": "12345678"
    },
    "type": {
        "name": "student"
    },
    "period": {
        "totalHours": "12",
        "dates": [
            {
                "date": "2019-04-07"
            },
            {
                "date": "2019-04-14"
            },
            {
                "date": "2019-04-21"
            },
            {
                "date": "2019-04-28"
            }
        ]
    },
    "course": {
        "name": "Workshop de Desenvolvimento Web",
        "type": "WorkShop",
        "responsibles": [
            {
                "name": "teste"
            }
        ]
    },
    "location": {
        "name": "Teste",
        "zipcode": "0800000",
        "address": "Rua Teste",
        "neighboohood": "Teste",
        "city": "São Paulo",
        "state": "SP",
        "telephone": "0800000",
        "responsible": "0800000"
    }
}'
```

Ao enviar o retorno será um `201` com os dados criados, inclusive o `hash` número único do certificado ou um `400` com as informações de quais campos estão com erro.

### GET \[/certified/{hashId}\]

Para obter um certificado basta passar a `hash` do certificado e o JSON retornado terá todas informações deste certificado e do seu dono. Não é necessário passar os dados de basic auth nesta chamada.

Exemplo de curl:

```sh
curl --location 'http://localhost:3000/certified/E52FEEF8'
```
