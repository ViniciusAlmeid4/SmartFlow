# SmartFlow
## Projeto de TCC Senai CTM - Maringá - TDS09

### Todo o código se encontra na pasta código que seria a pasta base dos códigos

 O objetivo desse README é instruir o leitor a implementar o sistema web em node.js, utilizando uma máquina para rodá-lo localmente e dando os caminhos para que tudo seja executada com sucesso.

 O primeiro passo é a criação de um banco de dados **postgreslq 16** para que os dados sejam salvos e as operações do sistema aconteçam normalmente, pois sem ele o sistema não ira funcionar. O script sql se encontra nesse mesmo repositório com o nome de **scriptBancoTCC.sql**, basta criar um servidor postgresql padrão e utilizar o script para criar a database desejada. O usuário e senha podem ser até mesmo o usuário *postgre* que já vem normalmente com os servidores. Ao criar um usuário, **lembre-se de salvar suas informações** para que a aplicação possa se conectar ao banco usando-o. OBS: *garanta que ele tem as permissões necessárias para fazer um CRUD.*

 O segundo passo é a integração do serviço da Amazon Web Services do usuário, uma pasta com o nome */certificados* deve ser criada dentro da pasta */src* **(/src/certificados)**, dentro dele os certificados e chaves devem ser inseridos, sendo obrigatórios os arquivos: AmazonRootCA1.pem da amazon, a sua private key disponibilizada na criação da Thing, referente ao servidor node, no AWS e por fim o seu certificado pessoal disponibilizado também na criação da Thing. Após isso é necessário entrar no arquivo **/src/models/AWSThing.js** e atualizar as structure com os seus caminhos, importante ressaltar que o **client id é passado no** */src/app.js* de acordo com o parâmetro passado na instância do construtor ("var caminhos = new Thing('server')" - linha 51).

 Agora na pasta base, ou seja, uma antes da */src*, abra o prompt de comando da sua interface e use o comando "npm install" para baixar todos os módulos, por conta do arquivo *package.json* o Node Package Manager consegue identificar os modulos necessários. Após isso garanta que todos os modulos foram instalados corretamente, ou seja, na versão correta e sem problemas para garantir que não ocorram erros.

 Depois basta usar o comando "npm run start" e a aplicação deverá rodar sem problemas, caso ocorra um erro, busque informações no prompt de comando para resolvê-los ou entre em contato com o dono do repositório para solicitar assistência.
