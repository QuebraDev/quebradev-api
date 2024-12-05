# QuebraDev API

API de serviços do QuebraDev

URL do serviço online: `http://`

# Rodando

Para rodar este projeto voce precisa do node e yarn instalado em sua máquina, além do Docker e Docker Compose. Baixe-os e em seguida rode os seguintes comandos.

` docker-compose up -d localstack mongo `

Para rodar os buckets local voce precisa ter instalado o `awslocal` e então executar os seguintes comandos:

`awslocal s3 mb s3://certificados`
`awslocal s3 mb s3://certificados/bases`
`awslocal s3 mb s3://certificados/certificados`

O comando a seguir sobe a base de fundo do certificado, caso voce queira adicionar outra base deve modificar esse arquivo:

`awslocal s3 cp src/images/certificado-base.png s3://certificados/bases/certificado-base.png`

E o upload abaixo copia seu arquivo de assinatura para a base, para cada responsável ou professor que irá assinar os certificados eles precisam conter o arquivo no s3 com o seguinte padrão `{nome}-assinatura.png` onde nome é o nome do responsável.

`awslocal s3 cp src/images/teste-assinatura.png s3://certificados/bases/teste-assinatura.png`

E então executar o código da aplicação

` yarn install `

` yarn run dev `

O serviço está como padrão para rodar na porta 3000.

# Serviços

## Auth

A autenticação é feita por authbasic, para configurar um usuário você precisa exportar as seguintes variaveis de ambiente na sua máquina.

` export PASS_ADMIN=pass `

O username é `admin`

## Certificados

### POST [/certified]

Para criar um novo certificado utilize o método de autenticação basic e envie o seguinte JSON no body.

```
    {
        "name": "Lorem Ipsum",
        "documents": {
            "rg": "11111111111"
        },
        "type": {
            "name": "student" # ou teacher, speaker, author
        },
        "period": {
            "totalHours": "12",
            "dates": [
                {"date": "2019-04-07"},
                {"date": "2019-04-14"},
                {"date": "2019-04-21"},
                {"date": "2019-04-28"}
            ]
        },
        "course": {
            "name": "Workshop de Desenvolvimento Web",
            "type": "WorkShop",
            "responsibles": [
                {"name": "Miguel"},
                {"name": "Willian"}
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
    }
```

Ao enviar o retorno será um ` 201 ` com os dados criados, inclusive o ` hash ` número único do certificado ou um ` 400 ` com as informações de quais campos estão com erro.

### GET [/certified/{hashId}]

Para obter um certificado basta passar a ` hash ` do certificado e o JSON retornado terá todas informações deste certificado e do seu dono. Não é necessário 
passar os dados de Basic Auth nesta chamada.

