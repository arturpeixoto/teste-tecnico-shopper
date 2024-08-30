# Teste Técnico Shopper.com

## Apresentação

Este documento descreve o resultado do teste técnico na Shopper.com. O projeto foi desenvolvido utilizando TypeScript como linguagem principal, com o Sequelize como ORM para interação com o banco de dados MySQL. O backend foi construído usando Express.js e TS-Node.

## Como Executar

Para executar o projeto localmente, siga estes passos:

1. Navegue até o diretório do backend:
```cd backend/```


2. Instale as dependências necessárias:
```npm install```


3. Retorne à raiz do projeto:
```cd ..```


4. Execute o Docker Compose para iniciar os serviços:
```docker compose up -d```


5. Faça as seguintes requisições:
   - GET /upload: Mostra todos os dados salvos no banco de dados. Alterei um pouco o objeto salvo no banco para unificar todos os requerimentos do teste
   - POST /upload: Realiza o primeiro requisito de analisar a foto e salvar no banco de dados (já deixei um txt com uma imagem em base64 para facilitar);
   - PATCH /confirm: Realiza o segundo requisito de confirmar as leituras através do body correto;
   - GET /<:customerCode>/list: Realiza o terceiro requisito de listar por customerCode e se houver measureType 'WATER' ou 'GAS';

## Objeto de retorno
No banco, a tabela Measurements, está no estilo snake case (exemplo_exemplo). No código e na url, como é mais padrão do TypeScript, está no camel case (exemploExemplo). O objeto json dos retornos fica assim:
```
{
    "measureDatetime": "2024-08-30T12:34:56.000Z",
    "measureUuid": "exemplo-a666-43ce-a322-exemplo",
    "measureValue": 123,
    "id": 1,
    "imageUrl": "URL QUE O GOOGLE FORNECE",
    "customerCode": "user1",
    "measureType": "WATER",
    "hasConfirmed": false
}
```

## Considerações Finais

Agradeço à Shopper.com pela oportunidade de participar deste processo seletivo. Aguardo receber qualquer atualização sobre o próximo passo do processo.

Artur Peixoto

