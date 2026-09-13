Patas & Lares

Projeto acadêmico da disciplina Desenvolvimento Front-end (Experiência Prática I): um conjunto de páginas web para uma ONG fictícia de resgate, castração popular e adoção responsável de animais abandonados, construído com HTML5 semântico, CSS3 e JavaScript puro (sem frameworks ou bibliotecas).

## Estrutura de diretórios ##

patas-e-lares/
├── index.html          # Página inicial — apresentação da ONG
├── projetos.html         # Iniciativas: Resgate, Castramóvel, Feira de Adoção
├── cadastro.html          # Cadastro de voluntários/doadores (desafio principal)
├── css/
│   └── style.css        # Estilos globais e responsividade
├── js/
│   └── script.js         # Menu, máscaras, busca de CEP e validação do form
├── img/
│   ├── resgate.jpg
│   ├── castracao.jpg
│   └── adocao.jpg
└── README.md


## Tags semânticas ##

Tag	Onde
<header> / <nav>	Marca e menu, no topo de todas as páginas
<main>	Conteúdo principal de cada página
<section>	Hero, "Quem somos", pilares, CTA
<article>	Cards de pilares (index) e de projetos
<fieldset> / <legend>	Agrupamento dos campos do formulário (Dados pessoais, Endereço, Como ajudar)
<footer>	Rodapé institucional, igual em todas as páginas

<article> foi usado nos cards que fazem sentido isolados (pilares, projetos); blocos puramente estruturais (ex.: .hero-texto, usada só para o layout em flexbox) ficaram como <div>.

## Hierarquia de headings ## 

Um único <h1> por página:

index.html → "Cada resgate é um novo começo."
projetos.html → "O que fazemos, na prática"
cadastro.html → "Vamos começar essa parceria"

<h2> para as seções de cada página (Quem somos, Como atuamos, cada projeto, CTA); <h3> para subitens dentro de uma seção (cada pilar). Sem pular níveis.

Formulário de cadastro (cadastro.html)

O maior destaque técnico do projeto, dividido em 3 <fieldset>: Dados pessoais, Endereço e Como você quer ajudar.

Validações nativas HTML5: required, type="email", minlength, maxlength, com feedback visual via :invalid/:valid no CSS.
Máscaras de entrada em JavaScript puro, aplicadas a cada evento input, para CPF (000.000.000-00), telefone fixo/celular ((00) 0000-0000 / (00) 00000-0000) e CEP (00000-000).
Validação real de CPF: além da máscara, o CPF passa pelo algoritmo de dígitos verificadores (módulo 11) no envio do formulário — barra números aleatórios que só parecem um CPF válido.
Busca de endereço via API ViaCEP: um botão de lupa ao lado do campo de CEP dispara uma chamada fetch que preenche Rua, Bairro, Cidade e UF automaticamente. Número e Complemento continuam manuais, já que a API não tem como saber esses dados.
Campo condicional: "Área de interesse" só faz sentido para quem marca "Voluntário(a)" — ao marcar "Doador(a)", o campo é escondido com uma transição suave (max-height + opacity), sem uso de display: none abrupto.
Mensagens de erro customizadas: no envio, cada campo inválido recebe a classe .erro, exibindo uma mensagem específica embaixo dele e movendo o foco para o primeiro campo com problema.
Aviso de sucesso acessível: em vez de um alert() nativo, o envio bem sucedido exibe uma mensagem estilizada com role="status" e aria-live="polite", anunciada automaticamente por leitores de tela.
Responsividade

Abordagem desktop-first, com um breakpoint principal em 768px:

O hero (display: flex) muda de flex-direction: row para column, empilhando texto e imagem.
As grades de cards (display: grid, 3 colunas) colapsam para 1 coluna.
O menu de navegação vira um botão hambúrguer (#botaoMenu), que alterna a classe .aberto no <ul> via JavaScript e atualiza o atributo aria-expanded para acessibilidade.


## Possíveis evoluções ##

Persistir os cadastros em localStorage, simulando um banco de dados sem precisar de servidor.
Adicionar paginação/filtro caso a lista de projetos cresça.
Validar o CEP também contra a resposta da API antes de liberar o envio do formulário (hoje a busca é manual, pelo botão).