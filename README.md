# QuebraDev API

API de serviços do QuebraDev

URL do serviço online: `http://`

# Rodando

Para rodar este projeto, é simples. Baixe-o e rode os seguintes comandos.

` npm i `

` node bin/server.js `

O serviço está como padrão para rodar na porta 3000.

# Serviços

## Auth

A autenticação é feita por authbasic, para configurar um usuário você precisa exportar as seguintes variaveis de ambiente na sua máquina.

` export USER=quebradev_user `

` export PASSWORD=quebradev_password `

## Certificados

### POST [/certified]

Para criar um novo certificado utilize o método de autenticação basic e envie o seguinte JSON no body.

```
    name: { type: String, required: true },
    birthday: Date,
    documents: {
        rg: { type: String, required: true, unique: true },
        cpf: { type: String, unique: true },
    },
    period: {
        totalHours: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    course: {
        name: { type: String, required: true },
        type: { type: String, enum: ['WorkShop', 'BootCamp'] },
        teacher: { type: String, required: true },
    },
    location: {
        name: { type: String, required: true },
        zipcode: { type: String, required: true },
        address: { type: String, required: true },
        neighboohood: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        telephone: { type: String, required: true },
        responsible: { type: String, required: true },
    }
}
```

Ao enviar o retorno será um ` 201 ` com os dados criados, inclusive o ` hash ` número único do certificado ou um ` 400 ` com as informações de quais campos estão com erro.

### GET [/certified/{hashId}]

Para obter um certificado basta passar a ` hash ` do certificado e o JSON retornado terá todas informações deste certificado e do seu dono.

