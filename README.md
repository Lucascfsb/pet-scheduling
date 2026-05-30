# Pet Scheduling

Este projeto é um sistema de agendamento para pets, desenvolvido em JavaScript puro, com foco em simplicidade e usabilidade. Ele permite que usuários agendem horários para serviços relacionados a pets, visualizem e gerenciem esses agendamentos.

## Funcionalidades
- Cadastro de agendamentos para pets
- Listagem e gerenciamento de horários
- Interface amigável e responsiva
- Notificações de sucesso e erro
- Modularização do código para fácil manutenção

## Estrutura do Projeto
```
pet-scheduling/
├── index.html
├── package.json
├── server.json
├── webpack.config.js
└── src/
    ├── main.js
    ├── assets/
    ├── libs/
    ├── modules/
    │   ├── dom.js
    │   ├── errors.js
    │   ├── listeners.js
    │   ├── modal.js
    │   ├── scheduleList.js
    │   ├── timeOptions.js
    │   └── toast.js
    ├── services/
    │   ├── apiConfig.js
    │   └── scheduleApi.js
    ├── styles/
    │   ├── form.css
    │   ├── global.css
    │   └── schedule.css
    └── utils/
        ├── dateUtils.js
        ├── phoneUtils.js
        └── timeUtils.js
```

## Como rodar o projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Abra o navegador em `http://localhost:8080` (ou porta configurada).

## Tecnologias utilizadas
- JavaScript (ES6+)
- HTML5 & CSS3
- Webpack

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença
Este projeto está licenciado sob a licença MIT.
