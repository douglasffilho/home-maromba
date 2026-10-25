# Exercícios Físicos BD (PT-BR)

Mais de **800 exercícios físicos** em português, organizados por categorias, músculos trabalhados e nível de dificuldade.

Este repositório é uma versão **traduzida** do projeto original [free-exercise-db](https://github.com/yuhonas/free-exercise-db).

---

## 📂 Estrutura do Dataset

O dataset está disponível em **3 versões**, de acordo com o nível de tradução:

---

### 1. `exercises-ptbr-minimal.json`

Tradução básica contendo apenas:

* `id`
* `name` (nome do exercício)
* `instructions` (passo a passo em português)

Exemplo:

```json
{
  "name": "Abdominal 3/4",
  "instructions": [
    "Deite-se no chão e prenda os pés. As pernas devem estar flexionadas nos joelhos.",
    "Coloque as mãos atrás ou ao lado da cabeça. Comece com as costas no chão. Esta é a posição inicial.",
    "Flexione os quadris e a coluna para levantar o tronco em direção aos joelhos.",
    "No topo da contração, o tronco deve estar perpendicular ao chão. Inverta o movimento, descendo apenas 3/4 do caminho.",
    "Repita para a quantidade recomendada de repetições."
  ],
  "id": "3_4_Sit-Up"
}
```

---

### 2. `exercises-ptbr-partial-translation.json`

Tradução **parcial**:

* `name` e `instructions` em português
* Outras propriedades (como `category`, `level`, `primaryMuscles`, etc.) **em inglês**

Exemplo:

```json
{
  "name": "Abdominal 3/4",
  "force": "pull",
  "level": "beginner",
  "mechanic": "compound",
  "equipment": "body only",
  "primaryMuscles": [
    "abdominals"
  ],
  "secondaryMuscles": [],
  "instructions": [
    "Deite-se no chão e prenda os pés. As pernas devem estar flexionadas nos joelhos.",
    "Coloque as mãos atrás ou ao lado da cabeça. Comece com as costas no chão. Esta é a posição inicial.",
    "Flexione os quadris e a coluna para levantar o tronco em direção aos joelhos.",
    "No topo da contração, o tronco deve estar perpendicular ao chão. Inverta o movimento, descendo apenas 3/4 do caminho.",
    "Repita para a quantidade recomendada de repetições."
  ],
  "category": "strength",
  "images": [
    "3_4_Sit-Up/0.jpg",
    "3_4_Sit-Up/1.jpg"
  ],
  "id": "3_4_Sit-Up"
}
```

---

### 3. `exercises-ptbr-full-translation.json`

Tradução **completa**, onde todas as propriedades foram adaptadas para o português:

Exemplo:

```json
{
  "name": "Abdominal 3/4",
  "force": "puxar",
  "level": "iniciante",
  "mechanic": "composto",
  "equipment": "peso-do-corpo",
  "primaryMuscles": [
    "abdominais"
  ],
  "secondaryMuscles": [],
  "instructions": [
    "Deite-se no chão e prenda os pés. As pernas devem estar flexionadas nos joelhos.",
    "Coloque as mãos atrás ou ao lado da cabeça. Comece com as costas no chão. Esta é a posição inicial.",
    "Flexione os quadris e a coluna para levantar o tronco em direção aos joelhos.",
    "No topo da contração, o tronco deve estar perpendicular ao chão. Inverta o movimento, descendo apenas 3/4 do caminho.",
    "Repita para a quantidade recomendada de repetições."
  ],
  "category": "força",
  "images": [
    "3_4_Sit-Up/0.jpg",
    "3_4_Sit-Up/1.jpg"
  ],
  "id": "3_4_Sit-Up"
}
```

---

⚠️ Sobre as imagens

Os caminhos para imagens (images) foram mantidos no dataset para referência, mas as imagens originais não estão incluídas neste repositório.
Isso evita problemas de direitos autorais, já que não temos permissão para redistribuí-las.

---

## 🚀 Como usar

* Escolha o arquivo que melhor se adapta ao seu caso (mínimo, parcial ou completo).
* Faça o parse do JSON no seu projeto e utilize os dados conforme necessário.

---

## 📱 App TreineSeuPvt0 (React Native + Expo)

O repositório inclui um aplicativo completo desenvolvido em **React Native + Expo**, com interface atlética inspirada na estética do **[GymRats](https://www.gymrats.app/pt)** exclusivamente em **Dark Mode (Tema Escuro)**, com paleta marcante com tons vibrantes de vermelho (`#E5173F`), amarelo canário (`#FFCC00`), verde e azul em contraste com fundo preto obsidiana (`#0B0D12`).

### ✨ Funcionalidades do App

1. **Catálogo & Busca de Exercícios**:
   * Busca instantânea por nome, músculo, aparelho ou dificuldade entre os **873 exercícios** traduzidos em PT-BR.
   * Filtros rápidos por grupo muscular (Peitoral, Dorsais, Quadríceps, Bíceps, Tríceps, Ombros, Abdômen, etc.).
   * Filtros avançados por nível, equipamento, mecânica (composto/isolado) e tipo de força (push/pull).
   * **Visualizador de Imagens & Loop Animado**: Alternador entre posição inicial (1/2) e pico de contração (2/2), com botão de loop animado contínuo para prévia do movimento.
   * **Demonstração em Vídeo HD**: Integração direta com tutoriais de execução correta e cadência recomendada no YouTube.
   * Favoritar exercícios salvos localmente.

2. **Montagem de Plano de Treino por Nível**:
   * **Níveis**:
     * 🟢 **Iniciante**: Base motora, adaptação neural, máquinas seguras, treinos AB e Full Body 3x.
     * 🟡 **Frequente**: Hipertrofia constante, sobrecarga progressiva, divisão ABC (Push/Pull/Legs) e Upper/Lower 4x.
     * 🔴 **Expert**: Divisão ABCDE especializada, powerbuilding, drop-sets e alta intensidade.
   * **Gerador Inteligente de Treino**: Cria planos sob medida com base no nível, objetivo (hipertrofia, definição, força), frequência semanal (2 a 6 dias) e equipamentos disponíveis (academia, halteres ou peso corporal).

3. **Modo Treino Ativo & Cronômetro de Descanso**:
   * Cronômetro de treino em tempo real.
   * Checklist interativo de séries com controle de repetições e carga (kg).
   * **Cronômetro de descanso automático** (com vibração/som, botões +15s e pular).
   * Tela de conquista e celebração GymRats ao concluir o treino.

4. **Progresso & Gamificação GymRats**:
   * Contador de dias seguidos (🔥 Streak).
   * Histórico de treinos completados e minutos acumulados.
   * Seletor rápido de nível do atleta.

---

### 🚀 Como executar o App

1. **Instale as dependências** (caso ainda não tenha instalado):
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento Expo**:
   ```bash
   npx expo start
   ```

3. **Para abrir diretamente em uma plataforma**:
   * **Web**:
     ```bash
     npm run web
     ```
   * **Android**:
     ```bash
     npm run android
     ```
   * **iOS** (no macOS com simulador ou Expo Go no iPhone):
     ```bash
     npm run ios
     ```

---

## 📌 Créditos

* Tradução e adaptação: **Este repositório**
* Base original: [free-exercise-db](https://github.com/yuhonas/free-exercise-db)
