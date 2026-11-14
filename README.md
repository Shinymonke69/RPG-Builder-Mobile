# RPG Builder Mobile

Aplicativo mobile completo para criação, gerenciamento e sorteio de fichas de personagens de RPG (Dungeons & Dragons 5ª Edição), desenvolvido com **React Native** e **Expo**.

---

## Aluno
- **Nome:** Gabriel Braz da Costa
- **Disciplina:** Framework para Desenvolvimento para Dispositivos Móveis
- **Projeto Base:** RPG-Builder (D&D 5e Character Manager)

---

## Descrição do Projeto

O **RPG Builder Mobile** foi projetado para auxiliar jogadores e mestres de RPG de mesa a criarem e consultarem suas fichas de forma ágil, diretamente no smartphone. O aplicativo permite desde a autenticação e isolamento de contas até a criação manual detalhada (com cálculo automático de modificadores, HP, CA e iniciativa) e a geração aleatória de personagens com as regras do sistema D&D 5e (sorteio com a regra oficial de 4d6 descartando o menor resultado).

Todas as sessões de login e fichas geradas ou criadas são armazenadas localmente no aparelho do usuário através do **AsyncStorage**, permitindo consulta offline a qualquer momento.

---

## Telas do Aplicativo

O aplicativo conta com navegação estruturada via **Expo Router** (Auth, Tabs e Stack Modal), contendo as seguintes telas:

1. **Autenticação / Login (`/(auth)/sign-in`):**
   - Entrada no aplicativo com e-mail e senha.
   - Opção para recuperação de senha.
   - Validação de formato de e-mail e tamanho mínimo de senha.
   - Redirecionamento direto para o fluxo de cadastro ou para a Home.

2. **Cadastro de Usuário (`/(auth)/sign-up`):**
   - Formulário completo para novos aventureiros: Nome, E-mail, Senha e Confirmação de Senha.
   - Validação de correspondência de senhas e persistência da nova sessão.

3. **Início / Dashboard (`/(tabs)/home`):**
   - Apresenta métricas rápidas (quantidade total de fichas salvas).
   - Atalhos para criação manual e sorteio rápido.
   - Botão para deslogar da conta (`Sair`).
   - Pré-visualização da última ficha criada e atualização por arraste (*Pull to Refresh*).

4. **Criação Manual (`/(tabs)/create`):**
   - Formulário com campos de texto (`TextInput`) com validação de dados em tempo real.
   - Seleção interativa por chips de Raças, Classes e Antecedentes oficiais.
   - Definição dos 6 atributos fundamentais (FOR, DES, CON, INT, SAB, CAR) com cálculo de Pontos de Vida (HP), Classe de Armadura (CA) e Iniciativa.
   - Campo para anotações e histórico do personagem.

5. **Gerador Aleatório 1-Clique (`/(tabs)/quick-roll`):**
   - Gera um personagem completo instantaneamente.
   - Algoritmo que simula a rolagem de dados clássica de RPG (4d6 drop lowest) para os atributos.
   - Sorteio de nomes, raças e classes balanceadas.
   - Exibição imediata com opção de salvar no grimório local ou rolar novamente.

6. **Grimório de Fichas (`/(tabs)/characters`):**
   - Listagem fluida de personagens utilizando `FlatList`.
   - Exibição de cards com informações resumidas de combate (HP, CA e atributos).
   - Função de exclusão de fichas com diálogo de confirmação nativo.
   - Suporte a atualização puxando a tela (*Pull to Refresh*).

7. **Detalhes da Ficha (`/character/[id]`):**
   - Visualização completa de todos os dados do personagem.
   - Sistema interativo de testes: toque em qualquer atributo para rolar um teste com d20 somado ao modificador correspondente.

---

## Componentes Reutilizáveis

O projeto foi construído respeitando as boas práticas de componentização e reutilização de código:

- **`CustomButton`:** Botão com variantes visuais (primary, secondary, danger, outline), suporte a ícones e estado de loading com `ActivityIndicator`.
- **`CustomCard`:** Contêiner estilizado com elevação, bordas sutis e opções de destaque visual.
- **`CustomInput`:** Campo de formulário customizado com rótulo, tratamento de erros e foco.
- **`CustomHeader`:** Cabeçalho padrão com título, subtítulo, botão de retorno e ações secundárias.
- **`AttributeBadge`:** Selo visual para atributos de RPG, calculando e exibindo automaticamente o modificador de cada valor.

---

## Requisitos Obrigatórios e Diferenciais

- [x] Projeto criado com Expo e executável via Expo Go ou emulador.
- [x] Mínimo de 4 telas distintas com navegação fluida (Expo Router Auth, Tabs e Stack).
- [x] Fluxo completo de Login e Cadastro (baseado no projeto didático).
- [x] Componentes reutilizáveis próprios criados do zero.
- [x] Gerenciamento de estado com `useState`, `useEffect` e `useCallback`.
- [x] Listagem com `FlatList` otimizada.
- [x] Formulário com `TextInput` e validações completas (campos obrigatórios, limites de valores e mensagens de erro).
- [x] Estilização padronizada com `StyleSheet` seguindo identidade visual Dark Fantasy.
- [x] **Diferencial (Bônus):** Persistência local de sessões e dados com `@react-native-async-storage/async-storage`.

---

## Instruções para Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior) instalado na máquina.
- Gerenciador de pacotes **npm** ou **yarn**.
- Aplicativo **Expo Go** instalado no celular (Android ou iOS) ou um emulador configurado.

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd RpgBuilderMobile
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor do Expo:**
   ```bash
   npx expo start
   ```

4. **Abrir no dispositivo:**
   - **No celular:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.
   - **No navegador Web:** Pressione a tecla `w` no terminal para rodar no navegador.
   - **No Emulador Android:** Pressione `a`.
   - **No Simulador iOS:** Pressione `i`.
