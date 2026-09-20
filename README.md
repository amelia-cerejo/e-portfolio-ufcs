# E-Portefólio Digital

Site reutilizável para uma ou várias UFCD, independentemente da ação de formação.

- `/` apresenta o guia e a estrutura do e-portefólio.
- `/app/` abre a aplicação de criação e edição.

Os dados introduzidos na aplicação ficam no armazenamento do navegador utilizado. O formando deve descarregar o projeto `.eportfolio` para o conservar no computador. A aplicação não publica os projetos nem disponibiliza os dados de um formando a outros visitantes. O ZIP de leitura só é partilhado quando o formando o enviar por sua iniciativa.

## Desenvolvimento

Na pasta `editor`, instalar as dependências com `npm ci` e iniciar a aplicação com `npm run dev`.

## Publicação

O Netlify executa `npm --prefix editor ci && npm --prefix editor run build` e publica apenas `site`. A página principal está em `site/index.html` e a aplicação é gerada em `site/app/` com os recursos apontados para `/app/`.

Endereço público: https://e-portfolio-ufcs.netlify.app/
