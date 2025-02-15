Projeto Web Backend 02
Este é um projeto de sistema de venda de ingressos com funcionalidades de cadastro de usuários, autenticação, controle de permissões e compra de ingressos. Ele foi desenvolvido utilizando Node.js, Express e MongoDB para gerenciar as informações e fornecer uma API segura e eficiente.

Funcionalidades
Cadastro e login de usuários: Permite que usuários se registrem e façam login para acessar o sistema.

Perfil de usuário: Os usuários podem visualizar e editar seus dados, além de consultar o histórico de compras.

Compra de ingressos: Usuários logados podem comprar ingressos, com controle de estoque.

Controle de permissões: Admins podem adicionar, editar ou excluir ingressos, enquanto usuários normais podem apenas visualizar o histórico de compras.

Histórico de compras: Os usuários podem visualizar todos os ingressos que compraram ao longo do tempo.

Clonando o repositório
Clone este repositório para o seu ambiente local:

git clone https://github.com/joaogabrielsilvacp/PROJETO-WEB-BACKEND-02.git

Instruções para Iniciar

Instalar dependências: No diretório do projeto, execute o seguinte comando para instalar todas as dependências:
npm install

Iniciar a aplicação: Para iniciar a aplicação, utilize o comando:
node app.js

Configuração do MongoDB: Certifique-se de ter o MongoDB configurado em sua máquina ou utilize um banco de dados na nuvem como o MongoDB Atlas. Crie um arquivo .env com as variáveis necessárias (como MONGO_URI).

