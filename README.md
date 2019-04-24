# QuebraDev API

API de serviços do QuebraDev

URL do serviço online: `http://`

# Rodando

Para rodar este projeto, é simples. Baixe-o e rode os seguintes comandos.

` npm i `

` npm run dev `

O serviço está como padrão para rodar na porta 3000.

# Serviços

## Auth

A autenticação é feita por authbasic, para configurar um usuário você precisa exportar as seguintes variaveis de ambiente na sua máquina.

` export PASS_ADMIN=pass `

## Certificados

### POST [/certified]

Para criar um novo certificado utilize o método de autenticação basic e envie o seguinte JSON no body.

```
    {
        "name": "Lorem Ipsum",
        "documents": {
            "rg": "11111111111"
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
            "teachers": [
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

