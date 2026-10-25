// Artigos educativos do app — conteúdo em português do Brasil.
// Baseado em meta-análises, posicionamentos (ACSM, ISSN, NSCA) e educadores baseados em evidência.
// Revisado em outubro de 2026. Ver docs/base-de-conhecimento.md para detalhes e incertezas.

export interface ArticleSource { title: string; url: string }
export interface Article { id: string; title: string; category: 'Fisiologia' | 'Hipertrofia' | 'Força' | 'Programação' | 'Nutrição' | 'Recuperação' | 'Cardio' | 'Técnica' | 'Saúde'; minutes: number; summary: string; body: string; sources: ArticleSource[] }

export const ARTICLES: Article[] = [
  {
    id: 'como-o-musculo-cresce',
    title: 'Como o músculo cresce: tensão, pump e dano muscular',
    category: 'Fisiologia',
    minutes: 4,
    summary: 'Entenda por que a tensão mecânica é o principal motor da hipertrofia e por que dor muscular e pump não são bons termômetros do seu treino.',
    body: `## O que é hipertrofia

Hipertrofia é o aumento do tamanho das fibras musculares. Ela acontece quando, ao longo de semanas e meses, o corpo fabrica mais proteína muscular do que degrada. O treino de força é o sinal que diz ao músculo "você precisa ficar maior e mais forte", e a alimentação (principalmente proteína e calorias suficientes) fornece a matéria-prima.

Durante anos, falou-se em três "mecanismos" da hipertrofia: tensão mecânica, estresse metabólico e dano muscular. A ciência evoluiu, e hoje sabemos que eles não têm o mesmo peso.

## 1. Tensão mecânica: o protagonista

A **tensão mecânica** é a força que as fibras musculares produzem e suportam enquanto se contraem contra uma resistência. As células musculares têm sensores que "percebem" essa tensão e ativam vias de sinalização (como a mTOR) que aumentam a síntese de proteínas.

Na prática, isso significa que o que mais importa é:

- Usar uma carga desafiadora em relação à sua capacidade
- Levar as séries **perto da falha** (quando você não conseguiria fazer muito mais repetições)
- Controlar o movimento, especialmente na parte em que o músculo está alongado

Curiosamente, cargas leves também geram muita tensão nas fibras quando a série vai perto da falha: à medida que você cansa, o corpo recruta fibras cada vez maiores para continuar. Por isso, séries de 8 ou de 25 repetições, levadas perto da falha, geram crescimento parecido.

## 2. Estresse metabólico: coadjuvante

O **estresse metabólico** é o acúmulo de substâncias como lactato e íons de hidrogênio durante séries longas, que gera a queimação e o famoso **pump** (músculo "inchado"). Por muito tempo se acreditou que ele causava crescimento por conta própria.

Hoje, a visão mais aceita é que ele tem papel **secundário**: a fadiga metabólica provavelmente ajuda a recrutar mais fibras, o que aumenta a tensão nelas. Não há boa evidência de que buscar o pump por si só faça você crescer mais. O pump é uma sensação agradável, mas não é a meta.

## 3. Dano muscular: não é necessário

Durante muito tempo, o dano muscular (microlesões) foi visto como algo desejável. Pesquisas como a de Damas e colaboradores (2016) mostraram o contrário: nas primeiras semanas de treino, boa parte da síntese de proteína é usada para **reparar** o dano, e não para construir músculo novo. A hipertrofia de verdade aparece quando o dano diminui, à medida que o corpo se adapta.

Isso traz uma lição importante: **dor muscular tardia** (aquela dor de 24 a 72 horas depois do treino) **não é sinal de bom treino**. Ela aparece mais quando você faz algo novo, muito volume ou muitas excêntricas, e diminui com a adaptação, mesmo quando você continua crescendo.

## O que isso muda no seu treino

- Meça seu progresso por **carga e repetições** ao longo das semanas, não por dor, suor ou pump.
- Priorize séries com esforço real: termine a maioria delas sobrando de **0 a 3 repetições** no "tanque".
- Faça o movimento completo e controlado, sem pressa na descida.
- Evite mudar todo o treino toda semana só para "sentir dor": isso aumenta o dano e atrapalha a progressão.
- Dê ao músculo tempo de recuperação (em geral 48 a 72 horas entre sessões duras do mesmo grupo).

## Resumo

O músculo cresce principalmente por **tensão mecânica** aplicada de forma progressiva ao longo do tempo. Pump e dor muscular podem acontecer, mas são efeitos colaterais, não objetivos. Treine duro, com boa técnica, coma proteína suficiente, durma bem e seja consistente: esse é o caminho.`,
    sources: [
      { title: 'Schoenfeld (2010) — The mechanisms of muscle hypertrophy and their application to resistance training', url: 'https://pubmed.ncbi.nlm.nih.gov/20847704/' },
      { title: 'Damas et al. (2016) — Dano muscular e síntese proteica no início do treino', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Damas+2016+resistance+training-induced+changes+in+integrated+myofibrillar+protein+synthesis+muscle+damage' },
      { title: 'Lopez et al. (2021) — Cargas e hipertrofia (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/33433148/' },
    ],
  },
  {
    id: 'fibras-e-recrutamento',
    title: 'Tipos de fibra e recrutamento: por que a última repetição importa',
    category: 'Fisiologia',
    minutes: 4,
    summary: 'Fibras lentas, rápidas e o princípio do tamanho de Henneman explicam por que tanto cargas pesadas quanto leves funcionam quando o esforço é alto.',
    body: `## Os tipos de fibra muscular

Seus músculos são formados por milhares de fibras, que podem ser agrupadas em três tipos principais:

- **Tipo I (lentas):** produzem menos força, mas resistem muito à fadiga. São ótimas para atividades longas, como caminhar ou manter a postura.
- **Tipo IIa (rápidas intermediárias):** produzem bastante força e têm resistência moderada.
- **Tipo IIx (rápidas):** produzem muita força e potência, mas cansam rápido.

A maioria dos músculos humanos é uma mistura. O quadríceps, por exemplo, costuma ter algo entre 40% e 60% de fibras lentas. A proporção varia entre pessoas e é, em parte, genética. O treino de força tende a transformar fibras IIx em IIa, que são fortes e um pouco mais resistentes.

As fibras rápidas costumam ter maior potencial de crescimento, mas as lentas também crescem com treino. Não existe boa evidência de que você precise de faixas de repetição específicas para cada músculo com base no "tipo de fibra predominante".

## Unidades motoras e o princípio do tamanho

Cada fibra é controlada por um neurônio motor. O conjunto "neurônio + fibras que ele controla" se chama **unidade motora**. Pequenas unidades motoras controlam poucas fibras, geralmente lentas. Grandes unidades motoras controlam muitas fibras, geralmente rápidas, e são as que têm mais potencial de crescimento.

O **princípio do tamanho de Henneman** diz que o corpo recruta as unidades motoras em ordem: primeiro as pequenas, depois as maiores, conforme a força exigida aumenta. Isso é econômico: para pegar um copo, você não precisa ativar o músculo inteiro.

## Duas formas de chegar às fibras grandes

- **Carga pesada:** quando você levanta algo próximo do seu máximo, o corpo precisa recrutar as unidades grandes logo na primeira repetição.
- **Carga leve até perto da falha:** com um peso leve, no começo só as unidades pequenas trabalham. Conforme elas cansam, o sistema nervoso recruta unidades cada vez maiores para manter o movimento. Nas últimas repetições difíceis, as fibras grandes estão trabalhando a todo vapor.

É por isso que estudos mostram hipertrofia semelhante com cargas de 30% a 80% ou mais do máximo, **desde que as séries cheguem perto da falha**. Por outro lado, uma série leve interrompida muito cedo (por exemplo, 15 repetições quando você conseguiria fazer 40) deixa as fibras grandes praticamente de fora.

## O conceito de "repetições efetivas"

Alguns educadores chamam as últimas cerca de 5 repetições antes da falha de "repetições efetivas", porque é nelas que as fibras grandes estão recrutadas e se contraindo devagar (o que aumenta a tensão em cada fibra). É uma ideia útil para entender a importância do esforço, mas ainda é uma **hipótese**, não um fato comprovado com precisão.

## Como aplicar

- Seja qual for a carga, a série precisa ser **desafiadora**: termine sobrando de 0 a 3 repetições.
- Cargas mais pesadas (até cerca de 12 repetições) são mais "eficientes": chegam às fibras grandes com menos repetições e menos cansaço geral.
- Cargas leves (15 a 30 repetições) funcionam, mas são mais desconfortáveis e é mais difícil saber o quão perto da falha você está.
- Para **força máxima**, cargas pesadas continuam sendo superiores, porque também treinam a habilidade de produzir força máxima.
- Prefira repetições com **intenção de velocidade** na subida: mesmo que a barra suba devagar no final da série, tentar empurrar com força ajuda a recrutar mais unidades motoras.

## Resumo

Seu corpo recruta as fibras em ordem de tamanho. Para estimular as fibras com maior potencial de crescimento, use carga pesada ou leve a série perto da falha. O esforço, e não o número exato de repetições, é o que faz a diferença para a hipertrofia.`,
    sources: [
      { title: 'Henneman (1957) — Relation between size of neurons and their susceptibility to discharge', url: 'https://pubmed.ncbi.nlm.nih.gov/13466313/' },
      { title: 'Schoenfeld et al. (2017) — Cargas baixas vs altas: força e hipertrofia (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/28834797/' },
      { title: 'Lopez et al. (2021) — Resistance training load effects on muscle hypertrophy and strength gain', url: 'https://pubmed.ncbi.nlm.nih.gov/33433148/' },
    ],
  },
  {
    id: 'volume-semanal',
    title: 'Quantas séries por semana para crescer?',
    category: 'Hipertrofia',
    minutes: 5,
    summary: 'As meta-análises mais recentes mostram que mais séries trazem mais músculo, mas com retornos decrescentes. Veja as faixas por nível de experiência.',
    body: `## Volume: a variável mais estudada

Em musculação, **volume** costuma ser medido como o número de **séries difíceis** (perto da falha) que cada músculo recebe por semana. Séries de aquecimento não contam.

A pergunta "quantas séries eu preciso?" tem resposta cada vez mais clara graças a grandes análises de dados.

## O que dizem os estudos

- **Schoenfeld e colaboradores (2017)** reuniram vários estudos e encontraram uma relação de dose-resposta: cada série semanal a mais adicionou um pouco de hipertrofia, e fazer 10 ou mais séries por semana foi melhor do que menos de 5.
- **Pelland e colaboradores (2024/2025)**, com 67 estudos e mais de 2 mil participantes, confirmaram que **mais volume gera mais hipertrofia**, mas com **retornos decrescentes**: as primeiras séries trazem muito resultado; as seguintes, cada vez menos. Eles não encontraram um "teto" claro até cerca de 40 séries semanais, mas há poucos estudos acima de 25.
- Segundo essa análise, cerca de **4 séries por semana** já produzem crescimento detectável. Entre 5 e 10 séries, o "custo-benefício" é altíssimo. De 11 a 18, ainda vale bastante. Acima de 20, você precisa de muitas séries extras para ganhar um pouquinho mais.
- Para **força**, o platô chega bem antes: poucas séries semanais por exercício (algo como 4 a 5) já capturam a maior parte do ganho.
- O **posicionamento do ACSM de 2026** usa cerca de **10 séries por grupo muscular por semana** como referência prática para hipertrofia.

## Faixas recomendadas no app

As faixas abaixo usam séries "fracionadas" (veja o artigo sobre contagem de séries):

- **Iniciante (até ~1 ano):** 6 a 10 séries por músculo por semana. Você vai crescer com quase qualquer volume razoável; o foco é aprender a técnica e progredir carga.
- **Intermediário (1 a 3 anos):** 10 a 16 séries.
- **Avançado (3+ anos):** 14 a 22 séries na maioria dos músculos. Em fases de "especialização" para um músculo atrasado, até 25 a 30 por algumas semanas, reduzindo outros músculos para manutenção.
- **Manutenção:** cerca de 1/3 a 1/2 do seu volume normal (mínimo de ~4 séries), mantendo a intensidade, preserva a massa muscular por meses.

## Não adianta tudo no mesmo dia

Uma análise de 2025 (ainda não revisada por pares) sugere que, **em uma única sessão**, o benefício de séries extras para hipertrofia deixa de ser detectável por volta de **11 séries fracionadas** (cerca de 8 séries diretas) para o mesmo músculo. Por isso, se você quer fazer 16 séries de peito na semana, é melhor dividir em 2 sessões de 8 do que fazer 16 de uma vez.

## Mais volume não é sempre melhor para você

A média dos estudos não é a sua resposta individual. Sinais de que o volume passou do que você recupera:

- Desempenho caindo por duas sessões seguidas nos mesmos exercícios
- Dores articulares persistentes
- Dor muscular que ainda não passou na hora do próximo treino daquele músculo
- Sono ruim, irritabilidade e falta de vontade de treinar

Se isso acontecer, reduza 20% a 30% das séries ou faça uma semana de deload.

## Como progredir o volume

Uma estratégia comum (popularizada pela Renaissance Periodization) é começar o ciclo de treino perto do volume mínimo e adicionar 1 a 2 séries por músculo por semana, enquanto a recuperação permitir, até uma semana de deload. Depois, recomeçar.

## Resumo

- Entre 10 e 20 séries por músculo por semana atende a maioria das pessoas.
- Comece mais baixo, suba aos poucos e observe a sua recuperação.
- Distribua o volume em pelo menos 2 sessões por semana.
- Qualidade importa: séries "de mentirinha", longe da falha, quase não contam.`,
    sources: [
      { title: 'Schoenfeld, Ogborn, Krieger (2017) — Dose-response relationship between weekly resistance training volume and increases in muscle mass', url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/' },
      { title: 'Pelland et al. — The Resistance Training Dose-Response (preprint)', url: 'https://sportrxiv.org/index.php/server/preprint/view/460' },
      { title: 'Pelland et al. (2025) — versão publicada em Sports Medicine', url: 'https://doi.org/10.1007/s40279-025-02344-w' },
      { title: 'Remmert et al. (2025) — Volume por sessão (preprint)', url: 'https://sportrxiv.org/index.php/server/preprint/view/537' },
      { title: 'ACSM (2026) — Resistance training guidelines update', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
    ],
  },
  {
    id: 'contagem-de-series',
    title: 'Como contar séries: diretas, indiretas e fracionadas',
    category: 'Programação',
    minutes: 4,
    summary: 'Supino também treina tríceps? Sim, mas não conta como uma série inteira. Aprenda a regra das séries fracionadas usada pelo app.',
    body: `## O problema

Quando você faz supino, o peito é o músculo principal, mas o tríceps e a parte da frente do ombro também trabalham bastante. Se você contar isso como uma série completa de tríceps, pode achar que está fazendo muito volume de braço quando não está. Se não contar nada, pode exagerar no volume de tríceps somando exercícios isolados.

## A solução: séries fracionadas

A grande meta-análise de Pelland e colaboradores (2024/2025) testou três formas de contar:

- **Total:** séries indiretas contam como 1
- **Direta:** séries indiretas contam como 0
- **Fracionada:** séries indiretas contam como **0,5**

A forma **fracionada** foi a que melhor explicou os resultados de hipertrofia nos estudos. Por isso, o app usa esta regra:

- **Músculo principal do exercício:** conta **1 série**
- **Músculo auxiliar importante (sinergista):** conta **0,5 série**
- **Músculos que só estabilizam** (por exemplo, abdômen no agachamento, antebraço na remada): contam **0**

## Exemplos práticos

- **Supino reto ou inclinado, flexão de braço:** peito 1; tríceps 0,5; ombro anterior 0,5
- **Desenvolvimento (press de ombro):** ombro anterior 1; ombro lateral 0,5; tríceps 0,5
- **Remada e puxada (pulldown, barra fixa):** costas 1; bíceps 0,5; ombro posterior 0,5
- **Agachamento e leg press:** quadríceps 1; glúteos 0,5; adutores 0,5
- **Stiff, levantamento terra romeno:** posteriores de coxa 1; glúteos 1 (ou 0,5); lombar 0,5
- **Elevação pélvica (hip thrust):** glúteos 1; posteriores 0,5
- **Afundo e agachamento búlgaro:** quadríceps 1; glúteos 1
- **Mergulho nas paralelas:** peito 1 e tríceps 0,5 (tronco inclinado) ou tríceps 1 e peito 0,5 (tronco reto)
- **Exercícios isolados** (rosca, tríceps na polia, cadeira extensora, elevação lateral, panturrilha): só o músculo alvo, 1 série

## Fazendo a conta da semana

Imagine esta semana de treino para tríceps:

- Supino reto: 4 séries → 4 × 0,5 = 2
- Desenvolvimento: 3 séries → 3 × 0,5 = 1,5
- Tríceps na polia: 3 séries → 3
- Extensão de tríceps acima da cabeça: 3 séries → 3

Total: **9,5 séries fracionadas** de tríceps na semana. Um bom número para um intermediário, sem precisar de mais exercícios isolados.

## O que não conta como série

- Séries de aquecimento e de aproximação
- Séries muito longe da falha (sobrando 5 ou mais repetições)
- Alongamentos e mobilidade

## Por que isso importa

- **Evita excesso de volume** em músculos que já recebem muito trabalho indireto (tríceps, ombro anterior, glúteos).
- **Evita falta de volume** em músculos que recebem pouco trabalho indireto (ombro lateral, panturrilhas, posteriores de coxa em quem só faz agachamento).
- Torna mais fácil seguir as faixas de séries semanais recomendadas.

## Limitações

A divisão entre "direto" e "indireto" tem um pouco de subjetividade, e a contribuição real de cada músculo varia com a técnica e a anatomia de cada um. A regra 1 / 0,5 / 0 é uma aproximação prática, apoiada pelos dados disponíveis, não uma medida exata.

## Resumo

Conte **1** para o músculo principal, **0,5** para os auxiliares importantes e **0** para estabilizadores. Some ao longo da semana e compare com a faixa recomendada para o seu nível.`,
    sources: [
      { title: 'Pelland et al. — Meta-regressões de volume e frequência (preprint, método fracionado)', url: 'https://sportrxiv.org/index.php/server/preprint/view/460' },
      { title: 'Pelland et al. (2025) — Sports Medicine', url: 'https://doi.org/10.1007/s40279-025-02344-w' },
      { title: 'Stronger By Science — artigos sobre volume de treino', url: 'https://www.strongerbyscience.com/' },
    ],
  },
  {
    id: 'frequencia-de-treino',
    title: 'Quantas vezes por semana treinar cada músculo?',
    category: 'Programação',
    minutes: 4,
    summary: 'Para hipertrofia, o volume semanal importa mais que a frequência. Mesmo assim, treinar cada músculo pelo menos 2 vezes por semana é a melhor aposta.',
    body: `## Frequência é distribuição de volume

**Frequência** é quantas vezes por semana você treina um mesmo músculo (ou exercício). A dúvida clássica: treinar peito uma vez por semana com muitas séries, ou duas a três vezes com menos séries em cada dia?

## O que dizem os estudos

- **Schoenfeld, Grgic e Krieger (2019):** quando o volume semanal é o mesmo, treinar o músculo 1, 2 ou 3 vezes por semana gera **hipertrofia semelhante**.
- **Pelland e colaboradores (2024/2025):** confirmaram que, ajustando pelo volume, a frequência tem efeito **desprezível na hipertrofia**, mas tem efeito **positivo na força**, principalmente ao passar de 1 para 2 sessões por semana.
- **ACSM 2026:** recomenda treinar todos os grandes grupos musculares **pelo menos 2 vezes por semana**.

## Então por que não treinar tudo uma vez por semana?

Porque há limite para o quanto você aproveita em uma única sessão. Com muitas séries seguidas, a fadiga acumula, a carga cai e as últimas séries rendem pouco. Uma análise de 2025 sugere que, por sessão, os ganhos de hipertrofia deixam de ser detectáveis acima de cerca de 8 séries diretas para o mesmo músculo.

Na prática, a frequência é uma **ferramenta para distribuir o volume** com qualidade:

- Até ~8 séries semanais de um músculo: 1 a 2 sessões funcionam bem.
- De 10 a 16 séries: divida em 2 sessões.
- Acima de 16 séries: 3 sessões tendem a ser melhores.

## E para força?

Força é, em parte, uma **habilidade**. Praticar o agachamento, o supino ou o levantamento terra 2 a 3 vezes por semana melhora a técnica e a coordenação, e os estudos mostram ganhos maiores de força com frequências mais altas, mesmo com o mesmo volume total.

## Divisões de treino sugeridas

- **2 a 3 dias por semana:** corpo inteiro (full body) em todos os treinos. Ótimo para iniciantes e para quem tem pouco tempo.
- **4 dias:** superior/inferior (upper/lower), duas vezes cada. Cada músculo é treinado 2 vezes.
- **5 dias:** superior/inferior + empurrar/puxar/pernas, ou uma combinação full body.
- **6 dias:** empurrar/puxar/pernas (push/pull/legs) duas vezes.

A tradicional divisão "um músculo por dia" (peito na segunda, costas na terça...) não é proibida, mas costuma concentrar volume demais em uma sessão e deixar o músculo 6 dias sem estímulo. Para a maioria das pessoas, ela não é a escolha mais eficiente.

## Recuperação entre sessões

Depois de um treino duro, o músculo precisa em geral de **48 a 72 horas** para recuperar o desempenho. Por isso, uma frequência de 2 a 3 vezes por semana encaixa bem. Músculos menores e exercícios menos cansativos (panturrilhas, elevações laterais, abdômen) costumam recuperar mais rápido.

## Escolha pelo que cabe na sua rotina

O melhor plano é o que você consegue seguir. Se você só pode treinar 3 vezes por semana, um full body bem montado entrega excelentes resultados. Se gosta de treinar 6 vezes, distribua o volume para que nenhuma sessão fique longa demais.

## Resumo

- Para crescer, o mais importante é o **total de séries semanais**.
- Treine cada músculo **pelo menos 2 vezes por semana**.
- Para força, pratique os levantamentos principais **2 a 3 vezes por semana**.
- Limite o volume por sessão a cerca de 6 a 10 séries por músculo.`,
    sources: [
      { title: 'Schoenfeld, Grgic, Krieger (2019) — How many times per week should a muscle be trained to maximize hypertrophy?', url: 'https://pubmed.ncbi.nlm.nih.gov/30558493/' },
      { title: 'Pelland et al. — Volume e frequência: meta-regressões (preprint)', url: 'https://sportrxiv.org/index.php/server/preprint/view/460' },
      { title: 'ACSM (2026) — Position Stand on resistance training', url: 'https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx' },
    ],
  },
  {
    id: 'falha-e-rir',
    title: 'Treinar até a falha? Entenda o RIR',
    category: 'Hipertrofia',
    minutes: 5,
    summary: 'Ir perto da falha é importante para crescer, mas chegar à falha total raramente é necessário. Veja como usar as repetições em reserva (RIR).',
    body: `## O que é falha e o que é RIR

**Falha muscular** é o ponto em que você não consegue completar mais uma repetição com boa técnica. **RIR** (do inglês "repetitions in reserve", repetições em reserva) é quantas repetições você ainda conseguiria fazer quando termina a série.

- **0 RIR:** falha, não sairia mais nenhuma
- **1 RIR:** sairia mais uma
- **2 RIR:** sairiam mais duas
- **3 RIR:** sairiam mais três
- **5 RIR ou mais:** série fácil, pouco estímulo

## O que mostram as pesquisas recentes

- **Refalo e colaboradores (2023)**, meta-análise: treinar até a falha teve, no máximo, uma vantagem pequena para hipertrofia em relação a parar antes.
- **Robinson e colaboradores (2024)**, com análises de dose-resposta: a **hipertrofia aumenta conforme as séries terminam mais perto da falha**, enquanto a **força quase não depende** do RIR (ganhos parecidos em uma ampla faixa).
- **Refalo e colaboradores (2024)**, com pessoas treinadas: uma perna treinou até a falha e a outra parou com 1 a 2 RIR. Após 8 semanas, o **crescimento foi semelhante**, mas a falha gerou **mais fadiga**.
- **ACSM 2026:** treinar até a falha não é necessário; 1 a 2 RIR dá resultados semelhantes quando o volume é parecido.

Conclusão: **chegar perto da falha importa; ir sempre até a falha total, não.** A zona de 0 a 3 RIR concentra a maior parte do estímulo.

## Quando a falha faz mais sentido

- Em **exercícios isolados e máquinas** (rosca, cadeira extensora, elevação lateral), onde o risco é baixo e a fadiga geral é pequena
- Na **última série** de um exercício
- Na **última semana** de um ciclo de treino, antes do deload
- Para **calibrar a percepção**: de vez em quando, levar uma série até a falha mostra o quanto você realmente aguentava

## Quando evitar a falha

- Em compostos pesados com barra livre (agachamento, levantamento terra, supino sem ajudante): a técnica degrada e o risco aumenta. Prefira 1 a 3 RIR.
- No início de um ciclo de treino
- Quando o treino de força é o foco: a fadiga extra atrapalha a qualidade das séries seguintes sem trazer mais força

## Aprenda a estimar o RIR

Quase todo mundo, especialmente iniciantes, **subestima** o quanto aguenta. É comum achar que estava a 2 RIR quando, na verdade, sobravam 5 ou 6. Dicas:

- A velocidade da barra cai bastante nas últimas 2 a 3 repetições antes da falha
- Teste a falha em máquinas seguras e compare com sua estimativa
- Séries mais curtas (6 a 12 repetições) são mais fáceis de estimar do que séries de 20+
- Registre o RIR no app: com o tempo, sua precisão melhora

## Como o app usa o RIR em um ciclo

Uma progressão típica de 4 semanas para hipertrofia:

- **Semana 1:** 3 RIR
- **Semana 2:** 2 RIR
- **Semana 3:** 1 a 2 RIR
- **Semana 4:** 0 a 1 RIR (falha só em isolados)
- **Semana de deload:** 3 a 5 RIR, com metade das séries

Assim você acumula estímulo de forma gradual e chega ao pico de esforço quando o corpo está adaptado, sem acumular fadiga demais desde o início.

## Resumo

- Para crescer: maioria das séries entre **0 e 3 RIR**.
- Compostos pesados: **1 a 3 RIR**. Isolados: podem ir a **0 a 1 RIR**.
- Para força: **1 a 4 RIR** é suficiente.
- A falha é uma ferramenta, não uma obrigação.`,
    sources: [
      { title: 'Refalo et al. (2023) — Influence of proximity-to-failure on hypertrophy (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Refalo+2023+influence+of+resistance+training+proximity-to-failure+on+skeletal+muscle+hypertrophy' },
      { title: 'Robinson et al. (2024) — Dose-response between proximity to failure, strength and hypertrophy', url: 'https://doi.org/10.1007/s40279-024-02069-2' },
      { title: 'Refalo et al. (2024) — Similar muscle hypertrophy training to failure or with RIR', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Refalo+2024+similar+muscle+hypertrophy+eight+weeks+momentary+muscular+failure+repetitions-in-reserve' },
      { title: 'Zourdos et al. (2016) — Escala de RPE baseada em repetições em reserva', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Zourdos+2016+novel+resistance+training+specific+RPE+scale+repetitions+in+reserve' },
    ],
  },
  {
    id: 'repeticoes-e-carga',
    title: 'Faixas de repetições: força, hipertrofia e resistência',
    category: 'Força',
    minutes: 5,
    summary: 'Para crescer, de 5 a 30 repetições funcionam se a série for perto da falha. Para força máxima, cargas acima de 80% do máximo são superiores.',
    body: `## O mito das "8 a 12 repetições"

Durante décadas, ensinou-se que hipertrofia só acontecia entre 8 e 12 repetições, força entre 1 e 5 e resistência acima de 15. A ciência mostrou que essa divisão é rígida demais, principalmente para hipertrofia.

## O que dizem as meta-análises

- **Schoenfeld e colaboradores (2017):** cargas baixas (até 60% do máximo) e altas (acima de 60%) geraram **hipertrofia semelhante** quando as séries iam perto da falha. Já a **força máxima** cresceu mais com cargas altas.
- **Lopez e colaboradores (2021):** mesma conclusão comparando cargas baixas, moderadas e altas.
- **ACSM 2026:** para força, cerca de **80% de 1RM ou mais**, com 2 a 3 séries por exercício. Para hipertrofia, uma **ampla faixa de cargas** funciona. Para potência, 30% a 70% de 1RM com máxima velocidade.

(1RM é a carga máxima que você consegue levantar uma única vez.)

## Por que então não treinar tudo com 30 repetições?

Funciona, mas tem desvantagens:

- É **mais desconfortável** (muita queimação e cansaço)
- É **mais difícil saber o quão perto da falha** você está
- O cansaço cardiovascular ou a dor podem fazer você parar antes do músculo realmente chegar ao limite
- As sessões ficam mais longas

E cargas muito pesadas (1 a 5 repetições) para hipertrofia também têm desvantagens: exigem mais das articulações, mais aquecimento e mais descanso, e geram muita fadiga para pouco volume.

## Faixas recomendadas pelo app

- **Hipertrofia:** 6 a 12 repetições em exercícios compostos (agachamento, supino, remada) e 10 a 20 em isolados e máquinas. Sempre a 0 a 3 RIR.
- **Força máxima:** 1 a 6 repetições com 80% a 90%+ do máximo, 1 a 4 RIR, descanso longo. Inclua a prática do levantamento que você quer melhorar.
- **Resistência muscular:** 15 a 30 repetições, descansos curtos (30 a 90 segundos).
- **Potência:** 3 a 6 repetições com 30% a 70% do máximo, levantando o mais rápido possível, longe da falha.
- **Saúde geral e iniciantes:** 8 a 15 repetições, sobrando 2 a 3.

Misturar faixas é uma ótima estratégia: por exemplo, agachamento com 5 a 8 repetições e cadeira extensora com 12 a 20.

## Tabela mental: % do máximo e repetições

Aproximadamente (varia entre pessoas e exercícios):

- 100% → 1 repetição
- 90% → 4 repetições
- 85% → 6 repetições
- 80% → 8 repetições
- 75% → 10 repetições
- 70% → 12 repetições
- 65% → 15 repetições
- 60% → cerca de 20 repetições

## Como estimar seu máximo sem testar

A fórmula de Epley é simples: **1RM ≈ carga × (1 + repetições ÷ 30)**. Exemplo: 80 kg por 8 repetições até perto da falha → 80 × (1 + 8/30) ≈ 101 kg. Ela é mais confiável com até 10 repetições.

## Resumo

- Para **crescer**, o esforço importa mais do que o número exato de repetições. Fique entre 5 e 30, de preferência entre 6 e 20.
- Para **ficar mais forte**, inclua cargas pesadas (acima de 80% do máximo).
- Use faixas diferentes para exercícios diferentes, conforme o conforto e a segurança.`,
    sources: [
      { title: 'Schoenfeld et al. (2017) — Strength and hypertrophy adaptations between low- vs high-load resistance training', url: 'https://pubmed.ncbi.nlm.nih.gov/28834797/' },
      { title: 'Lopez et al. (2021) — Resistance training load effects on muscle hypertrophy and strength gain', url: 'https://pubmed.ncbi.nlm.nih.gov/33433148/' },
      { title: 'ACSM (2026) — Resistance training guidelines update', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
    ],
  },
  {
    id: 'descanso-entre-series',
    title: 'Quanto descansar entre as séries?',
    category: 'Hipertrofia',
    minutes: 4,
    summary: 'Descansos muito curtos reduzem as repetições e atrapalham o crescimento. Para hipertrofia, descanse pelo menos 1 a 2 minutos; para força, 2 a 5 minutos.',
    body: `## Por que o descanso importa

O descanso entre séries permite que o músculo recupere energia (principalmente fosfocreatina) e que o sistema nervoso se recupere. Com pouco descanso, você faz menos repetições ou precisa usar menos carga na série seguinte. Isso reduz o estímulo total do treino.

Por muito tempo se recomendou descanso curto (30 a 60 segundos) para hipertrofia, com a ideia de aumentar o "estresse metabólico" e os hormônios. Essa recomendação não se sustentou.

## O que dizem os estudos

- **Schoenfeld e colaboradores (2016):** em pessoas treinadas, descansar **3 minutos** gerou mais hipertrofia nas coxas e mais força do que descansar 1 minuto, com o mesmo número de séries.
- **Singer e colaboradores (2024)**, meta-análise: há um pequeno benefício para a hipertrofia em descansar **mais de 60 segundos**, provavelmente porque se mantém mais repetições e carga. **Acima de 90 segundos**, não houve diferença apreciável.
- Para **força máxima**, descansos mais longos (2 a 5 minutos) são consistentemente melhores, especialmente em séries pesadas.

## Recomendações do app

- **Exercícios compostos para hipertrofia** (agachamento, supino, remada, levantamento terra romeno): **2 a 3 minutos**
- **Exercícios isolados e máquinas** (rosca, elevação lateral, extensora): **60 a 120 segundos**
- **Força máxima** (séries de 1 a 6 repetições pesadas): **3 a 5 minutos**
- **Resistência muscular e condicionamento:** 30 a 90 segundos

Uma regra simples: descanse até sentir que consegue repetir o desempenho da série anterior (mais ou menos uma repetição), respeitando um mínimo de 1 minuto.

## "Mas eu não tenho tempo"

Se o tempo é curto, há formas melhores de economizar do que cortar o descanso:

- **Superséries antagonistas:** alterne exercícios de músculos opostos (por exemplo, supino e remada). Enquanto um músculo trabalha, o outro descansa. Uma meta-análise de 2025 mostrou que superséries reduzem bastante o tempo da sessão sem perder resultados.
- **Alterne membros superiores e inferiores** (por exemplo, cadeira flexora e elevação lateral).
- **Drop set na última série** de exercícios isolados.
- **Escolha menos exercícios** e mantenha as séries de qualidade.

## Descansar demais atrapalha?

Não do ponto de vista muscular, mas pode deixar o treino longo demais, você esfria e perde o foco. Descansos acima de 5 minutos raramente são necessários fora de tentativas de recorde em força.

## Use o cronômetro

É muito comum subestimar o tempo de descanso (achar que passaram 2 minutos quando passou 1) ou se distrair no celular e descansar 6. Use o cronômetro de descanso do app para manter a consistência entre as sessões e comparar seu progresso de forma justa.

## Resumo

- Hipertrofia: **pelo menos 60 a 90 segundos**; 2 a 3 minutos em compostos.
- Força: **3 a 5 minutos** em séries pesadas.
- Para economizar tempo, prefira **superséries** em vez de cortar o descanso.`,
    sources: [
      { title: 'Schoenfeld et al. (2016) — Longer interset rest periods enhance muscle strength and hypertrophy in resistance-trained men', url: 'https://pubmed.ncbi.nlm.nih.gov/26605807/' },
      { title: 'Singer et al. (2024) — Give it a rest: rest interval duration and hypertrophy (meta-análise bayesiana)', url: 'https://pubmed.ncbi.nlm.nih.gov/39205815/' },
      { title: 'Zhang et al. (2025) — Superset versus traditional resistance training (meta-análise)', url: 'https://doi.org/10.1007/s40279-025-02176-8' },
    ],
  },
  {
    id: 'amplitude-e-alongamento',
    title: 'Amplitude de movimento e treino com o músculo alongado',
    category: 'Técnica',
    minutes: 5,
    summary: 'A parte do movimento em que o músculo está alongado parece ser a mais importante para crescer. Veja como escolher exercícios e usar parciais alongadas.',
    body: `## Amplitude completa ou parcial?

**Amplitude de movimento** é o quanto a articulação se move durante o exercício. No agachamento, por exemplo, descer até as coxas ficarem paralelas ao chão ou abaixo disso é uma amplitude maior do que fazer apenas um quarto do movimento.

Pesquisas dos últimos anos mudaram a forma como vemos essa questão. A pergunta deixou de ser "completa ou parcial?" e passou a ser "**em que comprimento o músculo está trabalhando**?".

## O que dizem os estudos

- **Wolf e colaboradores (2023)**, meta-análise: amplitude completa e parcial deram resultados parecidos em média, mas as **parciais feitas na parte alongada** do movimento mostraram uma possível vantagem (ainda incerta).
- **Pedrosa e colaboradores (2022):** na cadeira extensora, treinar na parte em que o quadríceps está mais alongado gerou mais crescimento do que treinar só na parte encurtada.
- **Maeo e colaboradores (2021):** a **mesa flexora sentada** (com o quadril dobrado, deixando os posteriores mais alongados) gerou bem mais hipertrofia do que a mesa flexora deitada.
- **Maeo e colaboradores (2023):** a **extensão de tríceps acima da cabeça** gerou cerca de 40% a 50% mais crescimento do tríceps do que o tríceps na polia com o braço ao lado do corpo, mesmo com cargas menores.
- **Kassiano e colaboradores (2023):** na panturrilha, repetições parciais na parte alongada (calcanhar lá embaixo) geraram o maior crescimento do gastrocnêmio; as parciais na parte de cima, o menor.
- **Wolf e colaboradores (2025)**, com pessoas treinadas: **parciais alongadas e amplitude completa deram resultados semelhantes**. Um estudo maior, em vários centros (ainda em pré-publicação), encontrou o mesmo.

## Interpretação atual

O consenso que vem se formando entre pesquisadores e educadores (como Milo Wolf, Jeff Nippard e Menno Henselmans):

- **Não corte a parte alongada** do movimento. Ela parece ser a mais estimulante.
- **Amplitude completa** continua sendo uma ótima escolha padrão.
- **Parciais alongadas** são uma alternativa válida, não necessariamente superior.
- Exercícios que **desafiam o músculo quando ele está alongado** tendem a ser boas escolhas.

## Exercícios que exploram o alongamento

- **Quadríceps:** agachamento profundo, agachamento búlgaro, hack squat com boa profundidade, cadeira extensora com o banco reclinado
- **Posteriores de coxa:** mesa flexora sentada, stiff e levantamento terra romeno
- **Glúteos:** búlgaro, afundo com passo longo, agachamento profundo
- **Peito:** crucifixo com halteres ou na polia, supino com halteres com boa descida
- **Costas:** puxada com alongamento total no alto, pullover, remada com alongamento na frente
- **Tríceps:** extensão acima da cabeça (polia ou halter)
- **Bíceps:** rosca no banco inclinado, rosca "bayesiana" na polia (braço atrás do corpo)
- **Panturrilhas:** elevação com pausa de 1 a 2 segundos lá embaixo

## Como usar parciais alongadas

Uma estratégia prática: faça a série com amplitude completa até chegar perto da falha e, quando não conseguir mais completar o movimento, faça **mais 3 a 5 repetições parciais** na metade alongada. Funciona bem em panturrilhas, cadeira extensora, mesa flexora, elevação lateral e crucifixo.

Outra opção é usar parciais alongadas como estilo principal em alguns exercícios, principalmente onde a parte de cima do movimento quase não tem tensão.

## Cuidados

- Amplitude é individual: respeite limitações articulares e dor. Dor aguda é sinal para reduzir.
- Não use "quique" na parte de baixo para ganhar impulso, a não ser que seja intencional e seguro.
- Evite reduzir a amplitude só para usar mais carga (o famoso "meio agachamento pesado" ou a "rosca de meio movimento").

## Resumo

Priorize a parte em que o músculo está alongado. Use amplitude completa e controlada como padrão, escolha exercícios que desafiam o alongamento e, se quiser, acrescente parciais alongadas no fim das séries.`,
    sources: [
      { title: 'Wolf et al. (2023) — Partial vs full range of motion resistance training (meta-análise)', url: 'https://doaj.org/article/99e86b317bec40f5abc2f0008358737e' },
      { title: 'Wolf et al. (2025) — Lengthened partial repetitions elicit similar muscular adaptations as full ROM', url: 'https://peerj.com/articles/18904' },
      { title: 'Maeo et al. (2021) — Mesa flexora sentada vs deitada', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Maeo+2021+greater+hamstrings+muscle+hypertrophy+seated+than+prone+leg+curls' },
      { title: 'Maeo et al. (2023) — Extensão de tríceps acima da cabeça', url: 'https://pubmed.ncbi.nlm.nih.gov/35819335/' },
      { title: 'Kassiano et al. (2023) — Parciais alongadas na panturrilha', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Kassiano+2023+greater+gastrocnemius+muscle+hypertrophy+partial+range+of+motion+long+muscle+lengths' },
    ],
  },
  {
    id: 'sobrecarga-progressiva',
    title: 'Sobrecarga progressiva: como evoluir semana após semana',
    category: 'Programação',
    minutes: 5,
    summary: 'Aumentar carga ou repetições ao longo do tempo é o que mantém o músculo se adaptando. Conheça a dupla progressão e a progressão por RIR.',
    body: `## O princípio

O corpo se adapta ao estímulo que recebe. Se você faz sempre o mesmo treino, com a mesma carga e as mesmas repetições, chega um momento em que ele deixa de ser um desafio. **Sobrecarga progressiva** é aumentar gradualmente a exigência ao longo do tempo.

Você pode progredir:

- **Aumentando a carga** com as mesmas repetições
- **Aumentando as repetições** com a mesma carga
- **Aumentando as séries** (volume)
- Melhorando a **técnica e a amplitude** com a mesma carga

## Carga ou repetições?

**Plotkin e colaboradores (2022)** compararam dois grupos de pessoas treinadas por 8 semanas: um aumentava a carga mantendo as repetições; o outro aumentava as repetições mantendo a carga. A **hipertrofia foi semelhante** nos dois grupos, e a força teve uma pequena vantagem (incerta) para quem aumentava a carga. Ou seja, as duas formas funcionam.

O **ACSM 2026** reforça: modelos diferentes de periodização (linear, ondulatória, em blocos) dão resultados semelhantes **desde que haja progressão**.

## Método 1: dupla progressão (padrão do app)

É simples e funciona para quase todo mundo:

- Escolha uma faixa de repetições, por exemplo **8 a 12**.
- Use uma carga com a qual você consiga pelo menos 8 repetições com o RIR alvo.
- A cada treino, tente fazer mais repetições com a mesma carga.
- Quando **todas as séries** chegarem a 12 repetições, **aumente a carga** (cerca de 2,5% a 5% nos compostos; o menor incremento possível nos isolados) e volte para perto de 8.

Exemplo no supino (3 séries, faixa 8 a 12):

- Semana 1: 60 kg × 9, 8, 8
- Semana 2: 60 kg × 10, 9, 9
- Semana 3: 60 kg × 11, 11, 10
- Semana 4: 60 kg × 12, 12, 12 → próximo treino com 62,5 kg
- Semana 5: 62,5 kg × 9, 8, 8

## Método 2: progressão por RIR (autorregulação)

Em vez de seguir números fixos, você ajusta a carga do dia para terminar a série no RIR planejado. Se a série com o RIR alvo ficou fácil demais (você sentiu que sobravam 2 ou mais repetições além do planejado), aumente a carga na próxima. Esse método respeita os dias bons e ruins e funciona muito bem para intermediários e avançados.

## Método 3: progressão linear (iniciantes)

Nos primeiros meses, muitas pessoas conseguem aumentar a carga quase todo treino: cerca de **2,5 kg** em exercícios de membros superiores e **5 kg** nos inferiores. Aproveite essa fase. Quando não conseguir mais, passe para a dupla progressão.

## Método 4: progressão de volume

Dentro de um ciclo de 4 a 6 semanas, você pode adicionar **1 a 2 séries por músculo por semana**, se estiver recuperando bem (desempenho estável ou subindo, sem dores articulares). Depois de um deload, o volume volta ao ponto de partida.

## Quando o progresso para

Alguns sinais e o que fazer:

- **Desempenho caiu em 2 treinos seguidos:** reduza o volume ou antecipe o deload. Verifique sono e alimentação.
- **Estagnado há 3 ou mais semanas no mesmo exercício:** troque por uma variação parecida, mude a faixa de repetições ou faça um deload.
- **Em déficit calórico:** manter a carga já é uma vitória. Não espere progressos rápidos.

## Registre tudo

Progresso só é visível quando é medido. Registre carga, repetições e RIR de cada série no app. Isso permite que o sistema sugira o próximo passo e que você veja a evolução real, sem depender da memória.

## Resumo

- Sem progressão, não há adaptação contínua.
- **Dupla progressão** é o método mais simples e confiável.
- Aumentar carga ou repetições: ambos funcionam.
- Pequenos aumentos consistentes vencem saltos grandes e irregulares.`,
    sources: [
      { title: 'Plotkin et al. (2022) — Progressive overload without progressing load?', url: 'https://peerj.com/articles/14142' },
      { title: 'Helms et al. (2018) — RPE vs porcentagem de 1RM em programas periodizados', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Helms+2018+RPE+vs+percentage+1RM+loading+in+periodized+programs' },
      { title: 'ACSM (2026) — Resistance training guidelines update', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
    ],
  },
  {
    id: 'mesociclo-e-deload',
    title: 'Ciclos de treino e semana de deload',
    category: 'Recuperação',
    minutes: 5,
    summary: 'Organizar o treino em blocos de 4 a 6 semanas, aumentando o esforço aos poucos e terminando com um deload ativo, ajuda a progredir sem acumular fadiga.',
    body: `## O que é um mesociclo

**Mesociclo** é um bloco de treino de algumas semanas (em geral 4 a 6) com um objetivo definido. Ao longo do bloco, o esforço e o volume sobem gradualmente; ao final, vem uma semana mais leve, o **deload**, para dissipar a fadiga acumulada.

A lógica é simples: o treino duro gera estímulo, mas também fadiga. Se a fadiga só acumula, o desempenho cai e o risco de dores aumenta. Alternar fases de acúmulo com fases de recuperação permite treinar duro por mais tempo.

## Estrutura sugerida pelo app (hipertrofia)

- **Semana 1:** volume moderado (por exemplo, 10 séries por músculo), **3 RIR**
- **Semana 2:** mais 1 a 2 séries por músculo, **2 RIR**
- **Semana 3:** mais 1 a 2 séries, **1 a 2 RIR**
- **Semana 4 (e 5, se houver):** mais 1 a 2 séries, **0 a 1 RIR** (falha apenas em isolados)
- **Semana de deload (5 a 7 dias):** cerca de **metade das séries**, mesma frequência, carga igual ou até 10% menor, **3 a 5 RIR**

Depois do deload, um novo mesociclo começa, geralmente com cargas um pouco maiores do que as do início do anterior.

## O que a ciência diz sobre o deload

O deload é usado por quase todos os atletas de força e fisiculturismo, mas foi pouco estudado.

- **Bell e colaboradores (2023)**, consenso de especialistas: deload é um período de redução do estresse do treino para diminuir a fadiga física e mental, promover a recuperação e preparar para o próximo bloco. A forma mais comum é **reduzir o volume**.
- **Rogerson e colaboradores (2024)**, pesquisa com 246 atletas: o deload típico dura cerca de **6 dias** e acontece a cada **5 a 6 semanas**. Os atletas reduzem séries e repetições, mas mantêm a frequência de treino.
- **Coleman e colaboradores (2024):** pessoas treinadas que **pararam completamente** por uma semana no meio de um programa de 9 semanas tiveram **a mesma hipertrofia**, mas **ganharam um pouco menos de força** do que quem treinou sem parar.

Conclusão prática: se for fazer deload, prefira um **deload ativo** (treinar mais leve) em vez de parar totalmente. E em blocos curtos com volume moderado, o deload pode nem ser necessário.

## Quando fazer deload

- **Planejado:** a cada 4 a 8 semanas para intermediários e avançados.
- **Autorregulado:** quando aparecerem sinais de fadiga acumulada (veja a lista abaixo).
- **Iniciantes:** raramente precisam de deload nos primeiros 3 a 6 meses. Use apenas se estagnar ou se sentir muito cansado.

Sinais de fadiga acumulada:

- Desempenho caindo em vários exercícios por 2 sessões seguidas
- Dores articulares que não passam
- Sono ruim, desânimo, falta de vontade de treinar
- Dor muscular persistente que não some entre os treinos

## Deload também é oportunidade

- Teste novas variações de exercícios com cargas leves
- Revise a técnica com calma
- Coloque o sono e a alimentação em dia
- Faça avaliações (medidas, fotos) em condições mais estáveis

## E se a vida atrapalhar?

Viagens, provas, doenças leves e semanas de trabalho intenso são deloads "naturais". Se uma semana assim acontecer perto do fim do bloco, use-a como deload e recomece em seguida.

## Resumo

- Organize o treino em blocos de **4 a 6 semanas**.
- Aumente o esforço aos poucos: **3 → 2 → 1 → 0 a 1 RIR**.
- Faça um **deload ativo** de 5 a 7 dias com metade das séries.
- Parar totalmente não ajuda a crescer mais e pode custar um pouco de força.`,
    sources: [
      { title: 'Bell et al. (2023) — Integrating deloading into strength and physique sports: Delphi consensus', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10511399/' },
      { title: 'Rogerson et al. (2024) — Deloading practices in strength and physique sports: survey', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10948666/' },
      { title: 'Coleman et al. (2024) — Gaining more from doing less? Deload in resistance-trained individuals', url: 'https://peerj.com/articles/16777' },
    ],
  },
  {
    id: 'selecao-ordem-e-tecnicas',
    title: 'Escolha e ordem dos exercícios, superséries e drop sets',
    category: 'Programação',
    minutes: 5,
    summary: 'Máquinas e pesos livres funcionam igualmente bem. Coloque o mais importante primeiro e use superséries e drop sets para economizar tempo.',
    body: `## Máquinas ou pesos livres?

O **ACSM 2026** concluiu que o tipo de equipamento (máquinas ou pesos livres) **não altera de forma consistente** os resultados de força e hipertrofia para o adulto médio. Elásticos, peso corporal e treino em casa também geram ganhos significativos.

Cada opção tem vantagens:

- **Pesos livres:** exigem mais estabilidade e coordenação; ótimos para força funcional e para quem compete em levantamentos com barra.
- **Máquinas e polias:** mais estáveis, permitem ir mais perto da falha com segurança, facilitam o aprendizado e mantêm a tensão em toda a amplitude.

## Como escolher um bom exercício

- **Estabilidade:** quanto mais estável, mais você consegue focar no músculo e levar perto da falha.
- **Alongamento sob carga:** prefira exercícios que desafiam o músculo na posição alongada.
- **Conforto articular:** se um exercício sempre incomoda, troque por uma variação.
- **Progressão mensurável:** você precisa conseguir aumentar carga ou repetições de forma clara.
- **Gosto pessoal:** você vai treinar com mais vontade aquilo de que gosta.

## Variedade na medida certa

Usar 2 ou 3 exercícios diferentes para o mesmo músculo ao longo da semana ajuda a distribuir o crescimento entre regiões do músculo (por exemplo, agachamento mais cadeira extensora para o quadríceps). Mas trocar todos os exercícios toda semana atrapalha a progressão. Mantenha os principais por pelo menos um ciclo de treino (4 a 8 semanas).

## Ordem dos exercícios

Exercícios feitos no início da sessão, quando você está descansado, tendem a ter **ganhos maiores de força**. Por isso:

- Comece pelo que é **mais importante** para você ou pelo músculo que está atrasado.
- Em geral: compostos principais primeiro, depois compostos secundários, depois isolados.
- Exercícios técnicos e pesados (agachamento livre, levantamento terra) vão melhor no começo.

## Técnicas para economizar tempo

**Krzysztofik e colaboradores (2019)** revisaram técnicas avançadas e concluíram que, com volume equivalente, elas **não geram mais hipertrofia** do que séries tradicionais. A vantagem delas é **economizar tempo**.

- **Superséries:** dois exercícios seguidos, sem descanso entre eles. Uma meta-análise de **Zhang e colaboradores (2025)** mostrou que superséries **reduzem o tempo da sessão sem perder força nem hipertrofia**. As **antagonistas** (por exemplo, supino e remada, rosca e tríceps) são as melhores, porque um músculo descansa enquanto o outro trabalha. Superséries do mesmo músculo reduzem a carga que você consegue usar.
- **Drop set:** ao chegar perto da falha, reduza a carga em 20% a 30% e continue sem descanso. Meta-análises mostram hipertrofia semelhante às séries tradicionais em menos tempo. Use na **última série** de exercícios isolados ou em máquinas.
- **Rest-pause e myo-reps:** após uma série perto da falha, descanse 10 a 20 segundos e faça mini-séries de 3 a 5 repetições com a mesma carga. Eficiente em tempo, ideal para isolados.

Cuidado: essas técnicas aumentam a sensação de esforço e a fadiga. Use com moderação, sem transformar todo treino em uma maratona de drop sets.

## Treino eficiente para quem tem pouco tempo

**Iversen e colaboradores (2021)** sugerem para treinos curtos:

- Priorizar exercícios **compostos** (agachamento, leg press, supino, remada, puxada)
- Pelo menos **4 séries semanais por grupo muscular**
- Faixa de **6 a 15 repetições**, perto da falha
- Usar superséries, drop sets e rest-pause
- Aquecimento específico (séries leves do próprio exercício) em vez de longos aquecimentos gerais

Com isso, treinos de 30 a 45 minutos, 2 a 3 vezes por semana, geram ótimos resultados.

## Resumo

- Escolha exercícios estáveis, confortáveis e que alongam o músculo.
- O mais importante vem primeiro.
- Superséries antagonistas e drop sets economizam tempo sem perder resultado.`,
    sources: [
      { title: 'Zhang et al. (2025) — Superset versus traditional resistance training prescriptions (meta-análise)', url: 'https://doi.org/10.1007/s40279-025-02176-8' },
      { title: 'Krzysztofik et al. (2019) — Maximizing muscle hypertrophy: advanced resistance training techniques', url: 'https://www.mdpi.com/1660-4601/16/24/4897' },
      { title: 'Iversen et al. (2021) — No time to lift? Time-efficient resistance training', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Iversen+2021+no+time+to+lift+time-efficient+resistance+training' },
      { title: 'ACSM (2026) — Resistance training guidelines update', url: 'https://acsm.org/resistance-training-guidelines-update-2026/' },
    ],
  },
  {
    id: 'iniciante-vs-avancado',
    title: 'Iniciante, intermediário ou avançado: o que muda no treino',
    category: 'Força',
    minutes: 5,
    summary: 'Iniciantes evoluem com pouco volume e progressão simples. Quanto mais experiente, mais volume, organização e paciência são necessários.',
    body: `## A curva de ganhos

No começo, quase tudo funciona. Nos primeiros meses, a força sobe rápido, em boa parte porque o sistema nervoso está aprendendo os movimentos (coordenação, recrutamento). A massa muscular também cresce, mas cada vez mais devagar com os anos.

Uma estimativa prática (heurística de educadores como Alan Aragon e Lyle McDonald, não uma lei) para ganho de massa muscular em quem treina e come bem:

- **Ano 1:** cerca de 1% a 1,5% do peso corporal por mês
- **Ano 2:** cerca de 0,5% a 1% por mês
- **Ano 3 em diante:** cerca de 0,25% a 0,5% por mês

Mulheres, pessoas mais velhas e quem tem menos predisposição genética tendem a ganhar em valores absolutos um pouco menores, mas proporcionalmente parecidos.

## Como classificar seu nível

Mais do que o tempo de academia, conta o tempo de **treino consistente e progressivo**:

- **Iniciante:** menos de 1 ano de treino regular, ou ainda consegue aumentar carga quase toda semana.
- **Intermediário:** 1 a 3 anos; o progresso passou a ser semanal ou mensal.
- **Avançado:** mais de 3 anos de treino sério; ganhos lentos, exigem planejamento em blocos.

## Iniciante

- **Divisão:** corpo inteiro, 2 a 3 vezes por semana
- **Volume:** 6 a 10 séries por músculo por semana; 1 a 3 séries por exercício
- **Repetições:** 8 a 15
- **Esforço:** sobrando 2 a 3 repetições, para aprender a técnica com segurança
- **Progressão:** linear (aumentar carga a cada treino) ou dupla progressão
- **Deload:** raramente necessário nos primeiros meses
- **Foco:** aprender os padrões básicos (agachar, empurrar, puxar, dobrar o quadril, carregar) e criar o hábito

Nessa fase, a consistência importa muito mais do que detalhes. Treinar 2 vezes por semana durante um ano inteiro vale muito mais do que 6 vezes por semana durante um mês.

## Intermediário

- **Divisão:** superior/inferior, full body ou push/pull/legs, 3 a 5 dias
- **Volume:** 10 a 16 séries por músculo por semana
- **Esforço:** 1 a 3 RIR, chegando à falha em alguns isolados
- **Progressão:** dupla progressão dentro de ciclos de 4 a 6 semanas com esforço crescente
- **Deload:** a cada 6 a 8 semanas ou quando os sinais de fadiga aparecerem

## Avançado

- **Divisão:** 4 a 6 dias, com frequência de 2 a 3 vezes por músculo
- **Volume:** 14 a 22 séries por músculo; em fases de especialização, até 25 a 30 para um ou dois músculos, mantendo os demais com volume de manutenção
- **Esforço:** 0 a 2 RIR em boa parte das séries de isolados; compostos a 1 a 3 RIR
- **Progressão:** autorregulação por RIR, progressão de volume ao longo do bloco
- **Deload:** a cada 4 a 6 semanas
- **Foco:** pontos fracos, técnica refinada, gerenciamento de fadiga, nutrição e sono

## E para força?

Iniciantes melhoram força com quase qualquer treino. Para intermediários e avançados, a força depende mais de **especificidade**: praticar o levantamento que você quer melhorar, 2 a 3 vezes por semana, com cargas acima de 80% do máximo. A meta-análise de Pelland mostra que poucas séries semanais por exercício já capturam boa parte do ganho de força; o resto vem de frequência, técnica e paciência.

## Voltando depois de uma pausa

Quem já treinou e parou recupera massa e força mais rápido do que quando começou (a chamada "memória muscular"). Volte com cerca de metade do volume e cargas 20% a 30% menores, e aumente nas 2 a 4 semanas seguintes.

## Resumo

- Iniciante: pouco volume, técnica e consistência.
- Intermediário: mais volume, ciclos organizados.
- Avançado: volume alto e individualizado, especialização e deloads regulares.
- Em qualquer nível, a progressão consistente é o que gera resultados.`,
    sources: [
      { title: 'ACSM (2026) — Position Stand: resistance training prescription in healthy adults', url: 'https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx' },
      { title: 'Pelland et al. — Volume, frequência, força e hipertrofia (preprint)', url: 'https://sportrxiv.org/index.php/server/preprint/view/460' },
      { title: 'Schoenfeld, Ogborn, Krieger (2017) — Volume e hipertrofia', url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/' },
    ],
  },
  {
    id: 'musculacao-para-mulheres',
    title: 'Musculação para mulheres: o que a ciência diz',
    category: 'Saúde',
    minutes: 5,
    summary: 'Mulheres ganham músculo e força em proporções semelhantes às dos homens. Não é preciso um treino "feminino" nem ajustar tudo ao ciclo menstrual.',
    body: `## Mulheres crescem tanto quanto homens?

Em termos **relativos**, sim. **Refalo e colaboradores (2025)** reuniram 29 estudos em que homens e mulheres seguiram o mesmo programa de treino. Os homens ganharam mais músculo em termos **absolutos** (principalmente nos membros superiores), porque começam com mais massa muscular. Mas, **proporcionalmente**, os ganhos foram **praticamente iguais**.

Para força, estudos como o de Roberts e colaboradores (2020) mostram ganhos relativos semelhantes nos membros inferiores e até maiores em mulheres nos membros superiores.

Conclusão: **mulheres não precisam de um treino diferente**. Os mesmos princípios valem: volume suficiente, esforço perto da falha, progressão e boa alimentação.

## "Vou ficar muito musculosa?"

Ganhar massa muscular é um processo lento, para homens e mulheres. Mulheres têm níveis de testosterona muito menores, o que limita o ganho absoluto. Uma aparência muito musculosa exige anos de treino específico, dieta e, muitas vezes, fatores genéticos. O resultado mais comum do treino de força é um corpo mais firme, forte e com melhor composição corporal.

## Diferenças que podem importar

- **Resistência à fadiga:** em média, mulheres conseguem fazer **mais repetições** com o mesmo percentual de carga máxima e se recuperam mais rápido entre séries. Na prática, podem tolerar volumes semelhantes ou um pouco maiores e talvez descansos um pouco mais curtos.
- **Membros superiores:** costumam ter menos massa muscular inicial; vale não negligenciar treinos de costas, peito, ombros e braços.
- **Glúteos e pernas:** muitas mulheres priorizam essa região, o que é ótimo. Use exercícios variados (agachamento, búlgaro, elevação pélvica, stiff, abdução) com progressão de carga como qualquer outro músculo.

## E o ciclo menstrual?

Muito se fala em "treinar de acordo com a fase do ciclo". As melhores revisões até agora (McNulty e colaboradores, 2020; Colenso-Semple e colaboradores, 2023) mostram que os efeitos das fases do ciclo sobre força e hipertrofia são **pequenos e inconsistentes**. **Não há base científica para periodizar o treino pela fase do ciclo.**

A recomendação prática é individual:

- Se em alguns dias você sente cólicas, cansaço ou indisposição, reduza o volume ou a intensidade naquele dia.
- Se se sente bem, treine normalmente.
- O peso corporal pode variar 1 a 2 kg ao longo do ciclo por retenção de líquido; compare medidas na mesma fase do ciclo quando possível.

Anticoncepcionais hormonais também não parecem afetar de forma relevante os ganhos com o treino.

## Gestação

Para gestantes saudáveis e com liberação médica, o exercício, incluindo musculação moderada, é **seguro e recomendado** pelo Colégio Americano de Obstetras e Ginecologistas (ACOG). Cuidados:

- Evitar ficar muito tempo deitada de barriga para cima após o primeiro trimestre
- Evitar segurar a respiração com força (manobra de Valsalva intensa) em cargas máximas
- Evitar exercícios com risco de queda ou impacto no abdômen
- Ajustar intensidade pelo conforto; manter-se capaz de conversar durante o esforço

## Menopausa e saúde óssea

Após a menopausa, a queda de estrogênio acelera a perda de massa óssea e muscular. O treino de força com **cargas progressivas** é uma das melhores ferramentas para preservar ossos, músculos e função. Estudos mostram que cargas mais pesadas, quando bem supervisionadas, são seguras e eficazes mesmo em mulheres com baixa densidade óssea.

## Nutrição

As recomendações de proteína são as mesmas: cerca de **1,6 g por kg de peso por dia** (até 2,2 g/kg). Mulheres em dietas restritivas devem ficar atentas a ferro, cálcio e energia suficiente: períodos irregulares ou ausência de menstruação podem indicar baixa disponibilidade de energia e merecem avaliação médica.

## Resumo

- Mulheres ganham músculo e força proporcionalmente como homens.
- Os princípios do treino são os mesmos.
- Ajuste o treino ao ciclo conforme os sintomas, não por regras fixas.
- Força é aliada da saúde em todas as fases da vida.`,
    sources: [
      { title: 'Refalo et al. (2025) — Sex differences in muscle size changes following resistance training (meta-análise)', url: 'https://peerj.com/articles/19042' },
      { title: 'Roberts et al. (2020) — Sex differences in resistance training (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Roberts+2020+sex+differences+resistance+training+meta-analysis' },
      { title: 'McNulty et al. (2020) — Menstrual cycle phase and exercise performance', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=McNulty+2020+menstrual+cycle+phase+exercise+performance+meta-analysis' },
      { title: 'Colenso-Semple et al. (2023) — Menstrual cycle phase and strength adaptations', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Colenso-Semple+2023+current+evidence+shows+no+influence+of+women%27s+menstrual+cycle+phase+on+acute+strength+performance+or+adaptations' },
      { title: 'ACOG — Physical activity and exercise during pregnancy and the postpartum period', url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period' },
    ],
  },
  {
    id: 'idosos-e-adolescentes',
    title: 'Musculação para idosos e adolescentes',
    category: 'Saúde',
    minutes: 5,
    summary: 'Treino de força é seguro e muito benéfico tanto para combater a sarcopenia quanto para jovens em desenvolvimento, desde que bem orientado.',
    body: `## Idosos: força é remédio

A partir dos 30 a 40 anos, perdemos massa e força muscular gradualmente, e esse processo se acelera após os 60. Quando a perda é grande e afeta a função, chamamos de **sarcopenia**. Ela aumenta o risco de quedas, fraturas, dependência e doenças metabólicas.

O treino de força é a intervenção mais eficaz para prevenir e tratar a sarcopenia. Os benefícios incluem:

- Mais força e massa muscular, em qualquer idade (inclusive acima dos 80 e 90 anos)
- Melhor equilíbrio e menor risco de quedas
- Ossos mais fortes
- Melhor controle da glicose e da pressão arterial
- Mais autonomia nas atividades do dia a dia
- Menor risco de mortalidade

## Como treinar (recomendações da NSCA e do ACSM)

O posicionamento da **NSCA (Fragala e colaboradores, 2019)** sugere:

- **Frequência:** 2 a 3 vezes por semana
- **Séries:** 1 a 3 por exercício, 1 a 2 exercícios por grupo muscular
- **Repetições:** 8 a 12, com cargas que evoluam para cerca de 70% a 85% do máximo, começando mais leve
- **Potência:** incluir exercícios com a fase de subida **rápida** (com 40% a 60% do máximo), porque a potência (força com velocidade) é essencial para levantar de uma cadeira ou evitar uma queda
- **Equilíbrio e funcionalidade:** exercícios como levantar e sentar, subir degraus, ficar em um pé só, carregar sacolas
- **Supervisão** no início, principalmente para quem tem doenças ou nunca treinou

A **OMS (2020)** recomenda para maiores de 65 anos: fortalecimento muscular em **2 ou mais dias por semana** e atividades de **equilíbrio funcional em 3 ou mais dias**, além do aeróbico.

## Proteína para idosos

O corpo mais velho responde menos à proteína (a chamada "resistência anabólica"). Por isso, a recomendação é maior do que a mínima para adultos:

- Cerca de **1,2 a 1,6 g por kg de peso por dia**
- Cerca de **0,4 g por kg em cada refeição** (por exemplo, 25 a 40 g), distribuída em 3 a 4 refeições
- Alimentos ricos em leucina: carnes, ovos, laticínios, whey

Pessoas com doença renal devem seguir orientação médica.

## Adolescentes: é seguro?

Sim. O mito de que musculação "atrofia o crescimento" **não tem base científica**. O **consenso internacional (Lloyd e colaboradores, 2014)** e a **NSCA** afirmam que o treino de força bem supervisionado é seguro e benéfico para crianças e adolescentes. Não há evidência de danos à cartilagem de crescimento com técnica adequada e supervisão. As lesões relatadas costumam acontecer em situações sem supervisão, com cargas exageradas ou uso inadequado de equipamentos.

Benefícios para jovens:

- Mais força, coordenação e desempenho esportivo
- Menor risco de lesões no esporte
- Ossos mais fortes
- Melhor composição corporal e autoestima

## Como os adolescentes devem treinar

- **Frequência:** 2 a 3 vezes por semana, em dias não consecutivos
- **Séries e repetições:** 1 a 3 séries de 6 a 15 repetições
- **Início:** peso corporal e cargas leves, foco total na **técnica**
- **Progressão:** aumentar a carga em 5% a 10% quando a técnica estiver consistente
- **Supervisão:** de um profissional qualificado, sempre
- **Variedade:** incluir saltos, corridas, esportes e brincadeiras, não só musculação

A **OMS** recomenda para jovens de 5 a 17 anos pelo menos **60 minutos por dia** de atividade moderada a vigorosa, com fortalecimento muscular e ósseo em **3 dias por semana**.

## Aviso importante

Este app oferece orientação geral. Idosos com doenças crônicas e menores de 18 anos devem ter **acompanhamento profissional** e, no caso de menores, o **consentimento de um responsável**.

## Resumo

- Nunca é tarde (ou cedo demais) para treinar força.
- Idosos: 2 a 3 vezes por semana, cargas progressivas, potência e equilíbrio, proteína suficiente.
- Adolescentes: supervisão, técnica em primeiro lugar e progressão gradual.`,
    sources: [
      { title: 'Fragala et al. (2019) — NSCA position statement: resistance training for older adults', url: 'https://pubmed.ncbi.nlm.nih.gov/31343601/' },
      { title: 'Lloyd et al. (2014) — International consensus on youth resistance training', url: 'https://pubmed.ncbi.nlm.nih.gov/24055781/' },
      { title: 'OMS (2020) — Diretrizes de atividade física e comportamento sedentário', url: 'https://www.who.int/publications/i/item/9789240015128' },
    ],
  },
  {
    id: 'cardio-e-musculacao',
    title: 'Cardio atrapalha o ganho de massa? O efeito de interferência',
    category: 'Cardio',
    minutes: 4,
    summary: 'Para a maioria das pessoas, cardio moderado não prejudica hipertrofia nem força máxima. A potência é o que mais sofre, principalmente na mesma sessão.',
    body: `## O medo do cardio

Muita gente evita o aeróbico com medo de "perder músculo". Essa ideia vem do chamado **efeito de interferência**: a hipótese de que treinar resistência aeróbica e força juntos atrapalharia os ganhos de força e massa muscular, por enviar sinais "contraditórios" ao músculo.

## O que a ciência mostra hoje

A meta-análise mais completa sobre o tema, de **Schumann e colaboradores (2022)**, reuniu 43 estudos e concluiu:

- Adicionar aeróbico ao treino de força **não compromete a hipertrofia**
- Também **não compromete a força máxima**
- A **força explosiva** (potência, saltos) pode ser um pouco prejudicada, principalmente quando os dois treinos são feitos **na mesma sessão**
- Separar os treinos por **pelo menos 3 horas** eliminou essa diferença
- Tipo de aeróbico (corrida ou bicicleta), frequência, nível de treino e idade não mudaram os resultados de forma significativa

Ou seja: para quem faz um volume moderado de cardio, a interferência é pequena ou inexistente. Ela pode aparecer em atletas que fazem volumes muito altos de endurance junto com treino de força.

## Os benefícios do cardio para quem faz musculação

- Saúde do coração e dos vasos
- Melhor capacidade de recuperação entre séries e entre treinos
- Mais gasto calórico, o que ajuda na perda de gordura
- Melhor controle da glicose e da pressão arterial
- Aptidão cardiorrespiratória é um dos maiores preditores de longevidade

## Como combinar sem atrapalhar

- **Ordem:** se o seu foco é força ou hipertrofia, faça a musculação **antes** do cardio na mesma sessão.
- **Separação:** quando possível, deixe pelo menos **3 a 6 horas** entre os dois, ou faça em dias diferentes.
- **Modalidade:** bicicleta, elíptico, remo ergométrico e caminhada inclinada têm menos impacto e menos dano muscular do que a corrida, sendo mais fáceis de recuperar.
- **Intensidade nas pernas:** evite HIIT intenso de pernas no dia anterior ao treino de pernas.
- **Volume:** algo como 2 a 4 sessões de 20 a 40 minutos por semana é compatível com ganhos máximos de massa para a maioria.
- **Alimentação:** se o cardio aumenta muito o gasto, coma o suficiente para não entrar em déficit sem querer (se o objetivo é ganhar massa).

## E para quem quer emagrecer?

O cardio é um ótimo aliado para aumentar o gasto calórico, mas a musculação continua sendo essencial: é ela que sinaliza ao corpo para **preservar a massa muscular** durante o déficit. A combinação ideal é musculação (pelo menos 2 a 4 vezes por semana) + cardio + alimentação ajustada + passos diários.

## Resumo

- Cardio moderado não "come" seus músculos.
- A potência é a qualidade mais sensível à interferência.
- Faça musculação primeiro ou separe os treinos por algumas horas.
- Prefira modalidades de baixo impacto se o foco é ganhar massa.`,
    sources: [
      { title: 'Schumann et al. (2022) — Compatibility of concurrent aerobic and strength training (meta-análise)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8891239/' },
      { title: 'OMS (2020) — Guidelines on physical activity and sedentary behaviour', url: 'https://www.who.int/publications/i/item/9789240015128' },
    ],
  },
  {
    id: 'diretrizes-de-cardio',
    title: 'Quanto cardio fazer? Zona 2, HIIT e as diretrizes da OMS',
    category: 'Cardio',
    minutes: 5,
    summary: 'A OMS recomenda 150 a 300 minutos semanais de atividade moderada. Entenda as zonas de frequência cardíaca, a zona 2 e quando usar o HIIT.',
    body: `## A recomendação oficial

As diretrizes da **Organização Mundial da Saúde (2020)** para adultos são:

- **150 a 300 minutos por semana** de atividade aeróbica **moderada**, ou
- **75 a 150 minutos por semana** de atividade **vigorosa**, ou uma combinação das duas
- Mais **fortalecimento muscular em 2 ou mais dias por semana**
- Fazer mais de 300 minutos traz benefícios adicionais
- Reduzir o tempo sentado: qualquer movimento conta

**Moderado** é quando você consegue conversar, mas não cantar. **Vigoroso** é quando só consegue dizer poucas palavras sem pausar para respirar.

## Zonas de frequência cardíaca

Primeiro, estime a sua frequência cardíaca máxima. A fórmula de Tanaka é mais precisa do que o clássico "220 menos a idade":

**FC máxima ≈ 208 − 0,7 × idade**

Exemplo: 40 anos → 208 − 28 = 180 batimentos por minuto.

Zonas simplificadas (percentual da FC máxima):

- **Zona 1 (50% a 60%):** muito leve, recuperação
- **Zona 2 (60% a 70%):** leve a moderada, conversa fácil
- **Zona 3 (70% a 80%):** moderada a intensa
- **Zona 4 (80% a 90%):** intensa, difícil manter por muito tempo
- **Zona 5 (90% a 100%):** máxima, apenas por curtos períodos

Essas zonas são aproximadas. O **teste da fala** é uma alternativa prática: na zona 2, você consegue falar frases completas com algum esforço na respiração.

## Zona 2: o que é verdade

A zona 2 ficou famosa em podcasts e redes sociais. O que se sabe:

- É uma ótima forma de acumular volume aeróbico com **pouca fadiga**, o que combina bem com a musculação
- Melhora a saúde cardiovascular e metabólica
- É sustentável e acessível para a maioria das pessoas

O que **não está bem comprovado**: que a zona 2 seja **superior** a outras intensidades para "construir mitocôndrias", "queimar gordura" ou melhorar a saúde em pessoas comuns. Para quem tem pouco tempo, intensidades mais altas também trazem grandes benefícios. A zona 2 é uma boa base, não uma intensidade mágica.

## HIIT: muito resultado em pouco tempo

O **treino intervalado de alta intensidade** alterna esforços intensos com recuperação. Ele melhora o **VO2 máximo** (a capacidade aeróbica máxima) de forma muito eficiente em tempo. Para perda de gordura, os resultados são parecidos com os do cardio contínuo quando o gasto de calorias é semelhante (Wewege e colaboradores, 2017).

Um protocolo bem estudado é o **4×4 norueguês**:

- Aquecer 10 minutos
- 4 minutos a 85% a 95% da FC máxima
- 3 minutos de recuperação ativa (caminhada leve)
- Repetir 4 vezes
- Total: cerca de 35 a 40 minutos

Outras opções: 6 a 10 tiros de 30 a 60 segundos fortes com 1 a 2 minutos leves entre eles. Uma a duas sessões de HIIT por semana são suficientes para a maioria das pessoas. Mais do que isso pode atrapalhar a recuperação da musculação.

## Passos diários

Contar passos é uma forma simples de aumentar o movimento. Estudos com centenas de milhares de pessoas associam **7.000 a 10.000 passos por dia** a menor mortalidade, com o benefício se estabilizando por volta de 8.000 a 10.000 em pessoas com menos de 60 anos. Os passos também aumentam o gasto calórico sem atrapalhar o treino de força.

## Exemplo de semana equilibrada

- 3 a 4 treinos de musculação
- 2 a 3 sessões de 30 a 45 minutos em zona 2 (bicicleta, caminhada inclinada, elíptico)
- 1 sessão de HIIT (opcional)
- 7.000 a 10.000 passos por dia

## Resumo

- Meta: 150 a 300 minutos semanais de cardio moderado (ou metade disso em intensidade vigorosa).
- Zona 2 é uma ótima base; HIIT é eficiente para melhorar o condicionamento.
- Combine com musculação pelo menos 2 vezes por semana e movimente-se ao longo do dia.`,
    sources: [
      { title: 'OMS (2020) — Guidelines on physical activity and sedentary behaviour', url: 'https://www.who.int/publications/i/item/9789240015128' },
      { title: 'Tanaka, Monahan, Seals (2001) — Age-predicted maximal heart rate revisited', url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/' },
      { title: 'Wewege et al. (2017) — HIIT vs treino contínuo moderado na composição corporal', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Wewege+2017+HIIT+moderate+intensity+continuous+training+body+composition+meta-analysis' },
      { title: 'Paluch et al. (2022) — Passos diários e mortalidade (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Paluch+2022+daily+steps+and+all-cause+mortality+meta-analysis' },
    ],
  },
  {
    id: 'proteina',
    title: 'Proteína: quanto comer para ganhar e manter músculo',
    category: 'Nutrição',
    minutes: 5,
    summary: 'Cerca de 1,6 g de proteína por kg de peso por dia atende a maioria das pessoas que treinam. Em dieta para emagrecer, um pouco mais ajuda a preservar músculo.',
    body: `## Por que a proteína importa

A proteína fornece os aminoácidos que o corpo usa para construir e reparar o tecido muscular. O treino dá o sinal; a proteína fornece a matéria-prima. Sem proteína suficiente, você ganha menos músculo com o mesmo treino e perde mais músculo quando está em dieta.

## Quanto comer por dia

- **Morton e colaboradores (2018)**, meta-análise com 49 estudos: os ganhos de massa magra com o treino aumentam com a proteína até cerca de **1,6 g por kg de peso corporal por dia**. Algumas pessoas podem se beneficiar de até **2,2 g/kg**.
- **ISSN (Sociedade Internacional de Nutrição Esportiva):** **1,4 a 2,0 g/kg/dia** para quem treina.
- **Em déficit calórico (dieta para perder gordura):** **Helms e colaboradores (2014)** sugerem **2,3 a 3,1 g por kg de massa magra**, o que, na prática, fica em torno de **1,8 a 2,7 g/kg de peso corporal**. Quanto mais magro você é e maior o déficit, mais perto do topo da faixa.

## Exemplos

- Pessoa de 70 kg querendo ganhar massa: 1,6 × 70 = **112 g/dia** (faixa de 100 a 155 g)
- Pessoa de 70 kg em dieta: cerca de 1,8 a 2,4 × 70 = **125 a 170 g/dia**
- Pessoa com obesidade: calcule pelo **peso-alvo** (ou cerca de 1,2 a 1,5 g por kg do peso atual), já que boa parte do peso é gordura

## Quantas refeições?

O **total diário** é o fator mais importante. Mesmo assim, distribuir a proteína ao longo do dia é uma boa estratégia:

- **Schoenfeld e Aragon (2018)** sugerem **pelo menos 4 refeições** com cerca de **0,4 g/kg** cada (por exemplo, 28 g para alguém de 70 kg).
- E aquela história de que o corpo só "aproveita" 25 a 30 g por refeição? Um estudo de **Trommelen e colaboradores (2023)** mostrou que **100 g** de proteína após o treino geraram uma resposta de construção muscular **maior e mais longa (mais de 12 horas)** do que 25 g. Ou seja, **não existe um teto rígido por refeição**. Refeições maiores também são aproveitadas, só que de forma mais lenta.

## Fontes de proteína

- **Animais:** carnes, frango, peixe, ovos, leite, iogurte, queijos, whey. Têm todos os aminoácidos essenciais e são ricas em **leucina**, o aminoácido que mais estimula a síntese muscular.
- **Vegetais:** feijões, lentilha, grão-de-bico, soja, tofu, ervilha, proteínas vegetais em pó. Funcionam muito bem; para veganos, vale mirar no topo da faixa (cerca de 1,8 a 2,0 g/kg) e variar as fontes.
- **Whey e outras proteínas em pó** não são obrigatórios. São apenas uma forma prática de bater a meta.

## Idosos

Com a idade, o músculo responde menos à proteína. Recomenda-se **1,2 a 1,6 g/kg/dia** ou mais, com cerca de **0,4 g/kg por refeição** (25 a 40 g), em 3 a 4 refeições.

## Segurança

Para pessoas saudáveis, dietas com até cerca de 2,5 a 3 g/kg/dia não mostraram prejuízo aos rins em estudos de médio prazo. Quem tem **doença renal** precisa de orientação médica individual.

## Dicas práticas

- Inclua uma fonte de proteína em **todas as refeições**.
- Café da manhã costuma ser a refeição com menos proteína: ovos, iogurte, queijo ou whey resolvem.
- Uma refeição com proteína nas 1 a 3 horas antes ou depois do treino é uma boa ideia, mas não precisa ser imediatamente após.
- Uma refeição rica em proteína antes de dormir (como iogurte ou queijo cottage) ajuda a bater a meta.

## Resumo

- Meta: **1,6 g/kg/dia** (faixa de 1,4 a 2,2).
- Em dieta: **1,8 a 2,7 g/kg/dia**.
- Distribua em 3 a 5 refeições, sem medo de refeições maiores.
- Comida de verdade em primeiro lugar; suplemento é conveniência.`,
    sources: [
      { title: 'Morton et al. (2018) — Protein supplementation and resistance training (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/' },
      { title: 'Jäger et al. (2017) — ISSN position stand: protein and exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/' },
      { title: 'Helms et al. (2014) — Protein intake during caloric restriction in resistance-trained lean athletes', url: 'https://pubmed.ncbi.nlm.nih.gov/24092765/' },
      { title: 'Schoenfeld & Aragon (2018) — How much protein can the body use in a single meal?', url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/' },
      { title: 'Trommelen et al. (2023) — The anabolic response to protein ingestion has no upper limit', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10772463/' },
    ],
  },
  {
    id: 'calorias-deficit-superavit',
    title: 'Calorias: como calcular seu gasto e ajustar para emagrecer ou ganhar massa',
    category: 'Nutrição',
    minutes: 6,
    summary: 'Use a fórmula de Mifflin-St Jeor como ponto de partida, mire em perder 0,5% a 1% do peso por semana ou ganhar devagar, e ajuste pela balança.',
    body: `## Balanço energético

Seu peso muda conforme a diferença entre o que você come e o que você gasta. Para perder gordura, é preciso um **déficit calórico**. Para ganhar massa muscular com o mínimo de gordura, um **pequeno superávit**. Para recomposição (perder gordura e ganhar músculo ao mesmo tempo), algo perto da **manutenção**.

## Passo 1: estimar a taxa metabólica basal (TMB)

A fórmula de **Mifflin-St Jeor** é uma das mais precisas para a população geral:

- **Homens:** TMB = 10 × peso (kg) + 6,25 × altura (cm) − 5 × idade + 5
- **Mulheres:** TMB = 10 × peso (kg) + 6,25 × altura (cm) − 5 × idade − 161

Se você conhece seu percentual de gordura, a fórmula de **Katch-McArdle** pode ser melhor, principalmente para pessoas musculosas:

- TMB = 370 + 21,6 × massa magra (kg)

## Passo 2: multiplicar pelo nível de atividade

O gasto total diário (GET) é a TMB multiplicada por um fator:

- **1,2:** sedentário (pouco ou nenhum exercício)
- **1,375:** levemente ativo (1 a 3 treinos por semana)
- **1,55:** moderadamente ativo (3 a 5 treinos por semana)
- **1,725:** muito ativo (6 a 7 treinos por semana)
- **1,9:** extremamente ativo (trabalho físico pesado + treino)

## Exemplo

Mulher, 30 anos, 65 kg, 165 cm, treina 4 vezes por semana:

- TMB = 650 + 1.031 − 150 − 161 = **1.370 kcal**
- GET = 1.370 × 1,55 ≈ **2.125 kcal**

## Passo 3: definir a meta

- **Perder gordura:** perder **0,5% a 1% do peso por semana**. Para alguém de 80 kg, isso é 0,4 a 0,8 kg por semana. Garthe e colaboradores (2011) mostraram que perder peso mais devagar (cerca de 0,7% por semana) preservou melhor a massa magra e a força do que perder rápido (1,4%). Pessoas mais magras devem ficar perto de 0,5%; quem tem mais gordura pode ir até 1%. Em calorias, isso costuma significar um déficit de **10% a 25%** do gasto.
- **Ganhar massa:** um superávit de **5% a 15%** (cerca de 200 a 400 kcal). Iniciantes podem ganhar **0,25% a 0,5% do peso por semana**; intermediários e avançados, **0,1% a 0,25%**. Ganhar mais rápido do que isso tende a adicionar mais gordura do que músculo.
- **Recomposição:** comer entre a manutenção e um déficit leve (10% a 20%), com proteína alta e treino progressivo. Funciona melhor em iniciantes, em quem está voltando a treinar e em pessoas com mais gordura corporal. Em treinados também é possível, mas mais lento.

## Passo 4: ajustar pela realidade

As fórmulas erram facilmente 10% a 15% para mais ou para menos em cada pessoa. Por isso:

- **Pese-se todos os dias** ao acordar (após ir ao banheiro) e acompanhe a **média semanal**.
- Avalie a tendência depois de **2 a 3 semanas**.
- Se o peso não mudou como esperado, ajuste as calorias em 100 a 200 kcal por dia.
- Na primeira semana de dieta, a balança pode cair rápido por perda de água e glicogênio; não use essa semana para tirar conclusões.

## Divisão de macronutrientes

- **Proteína:** 1,6 a 2,2 g/kg (em dieta, 1,8 a 2,7 g/kg)
- **Gorduras:** 20% a 35% das calorias, com mínimo de cerca de **0,5 a 0,6 g/kg** para manter a saúde hormonal
- **Carboidratos:** o restante. Para quem treina musculação, algo em torno de **3 a 5 g/kg** costuma funcionar bem. Dietas com pouco carboidrato não são necessárias para perder gordura; escolha o que você consegue manter.

Inclua também **fibras** (25 a 38 g por dia), frutas, verduras e água suficiente (um ponto de partida é 30 a 35 mL por kg por dia, mais o que você perde no suor).

## Adaptação metabólica

Ao perder peso, o gasto diminui: você fica mais leve, e o corpo tende a se mexer menos sem perceber. Por isso, **recalcule as calorias a cada 2 a 4 kg perdidos**. Pausas de dieta (1 a 2 semanas na manutenção) podem ajudar na adesão em dietas longas.

## Limites de segurança

- Não coma abaixo da sua TMB sem acompanhamento profissional.
- Evite ficar abaixo de cerca de 1.200 kcal (mulheres) ou 1.500 kcal (homens) sem orientação.
- Se você está abaixo do peso ou tem histórico de transtornos alimentares, procure um profissional antes de fazer dieta.

## Resumo

- Calcule a TMB, multiplique pelo fator de atividade e ajuste pela meta.
- Perder 0,5% a 1% do peso por semana preserva melhor o músculo.
- Ganhe massa devagar.
- A balança (média semanal) é o juiz final, não a fórmula.`,
    sources: [
      { title: 'Mifflin et al. (1990) — A new predictive equation for resting energy expenditure', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
      { title: 'Garthe et al. (2011) — Effect of two different weight-loss rates on body composition and strength', url: 'https://pubmed.ncbi.nlm.nih.gov/21558571/' },
      { title: 'Helms, Aragon, Fitschen (2014) — Evidence-based recommendations for natural bodybuilding contest preparation', url: 'https://pubmed.ncbi.nlm.nih.gov/24864135/' },
      { title: 'Iraki et al. (2019) — Nutrition recommendations for bodybuilders in the off-season', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Iraki+2019+nutrition+recommendations+bodybuilders+off-season' },
      { title: 'Barakat et al. (2020) — Body recomposition: can trained individuals build muscle and lose fat at the same time?', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Barakat+2020+body+recomposition+trained+individuals' },
    ],
  },
  {
    id: 'creatina-e-cafeina',
    title: 'Suplementos que funcionam: creatina e cafeína',
    category: 'Nutrição',
    minutes: 5,
    summary: 'Creatina (3 a 5 g por dia) e cafeína (3 a 6 mg por kg antes do treino) são os suplementos com mais evidência. A maioria dos outros é dispensável.',
    body: `## Antes de tudo

Suplementos são, como o nome diz, um complemento. Treino consistente, alimentação adequada (principalmente proteína e calorias) e sono fazem quase todo o trabalho. Dito isso, dois suplementos têm evidência sólida para quem treina força: **creatina** e **cafeína**.

## Creatina

A creatina é uma substância produzida pelo corpo e encontrada em carnes e peixes. Ela ajuda a regenerar rapidamente a energia (ATP) usada em esforços curtos e intensos, como uma série de musculação.

Segundo o posicionamento da **ISSN (Kreider e colaboradores, 2017)**, a creatina monoidratada:

- Aumenta a **força** e o **desempenho** em séries repetidas
- Aumenta os ganhos de **massa magra** quando combinada ao treino
- Pode melhorar a recuperação
- É **segura** para pessoas saudáveis, inclusive no uso a longo prazo
- É um dos suplementos mais estudados do mundo

## Como tomar

- **Dose diária:** **3 a 5 g por dia**, todos os dias (inclusive nos dias sem treino). Os músculos ficam saturados em cerca de 3 a 4 semanas.
- **Saturação rápida (opcional):** cerca de 0,3 g/kg por dia (aproximadamente 20 g, divididos em 4 doses) por 5 a 7 dias, depois 3 a 5 g por dia.
- **Horário:** pouco importa. Tome no horário em que você não vai esquecer, com ou sem comida.
- **Forma:** a **monoidratada** é a mais estudada e barata. Outras formas não mostraram vantagem.
- **Não precisa** fazer ciclos ou pausas.

## Mitos e efeitos

- Pode aumentar o peso em **1 a 2 kg** nas primeiras semanas, por causa de água **dentro do músculo** (não é "inchaço" nem gordura).
- **Não** causa danos aos rins em pessoas saudáveis. Quem tem doença renal deve consultar um médico.
- A associação com queda de cabelo vem de um único estudo pequeno, nunca replicado; a evidência atual não sustenta esse efeito.
- Vegetarianos e veganos costumam ter menos creatina nos músculos e podem se beneficiar ainda mais.

## Cafeína

A cafeína reduz a percepção de esforço e de cansaço, e aumenta a força, a potência e a resistência.

Segundo o posicionamento da **ISSN (Guest e colaboradores, 2021)**:

- **Dose eficaz:** **3 a 6 mg por kg** de peso, cerca de **30 a 60 minutos antes** do treino. Para uma pessoa de 70 kg, isso é 210 a 420 mg.
- Doses mais baixas (cerca de 2 mg/kg) também podem funcionar, com menos efeitos colaterais.
- Doses acima de 9 mg/kg não trazem mais benefícios e aumentam os efeitos colaterais.

## Cuidados

- O limite diário considerado seguro para adultos saudáveis é de cerca de **400 mg**; para gestantes, **até 200 mg**.
- Evite cafeína nas **6 a 8 horas antes de dormir**: ela prejudica o sono, que é fundamental para a recuperação.
- Pode causar ansiedade, taquicardia e desconforto gástrico em pessoas sensíveis.
- Referências: uma xícara de café coado tem cerca de 80 a 100 mg; um expresso, cerca de 60 a 80 mg; pré-treinos variam muito (leia o rótulo).
- O corpo se acostuma com o uso diário, mas parte do efeito permanece.

## Outros suplementos

- **Whey e proteínas em pó:** úteis apenas para bater a meta de proteína com praticidade.
- **Beta-alanina (3,2 a 6,4 g por dia):** ajuda em esforços de 1 a 4 minutos; benefício pequeno para musculação comum.
- **Vitamina D:** apenas se houver deficiência comprovada em exame.
- **Sem evidência suficiente para recomendar:** BCAA (quando a proteína já é adequada), glutamina para hipertrofia, tribulus, "termogênicos" e boa parte dos "boosters de testosterona".

## Atenção à qualidade

Compre de marcas com laudos de pureza. Suplementos podem ser contaminados com substâncias proibidas ou não declaradas. Atletas que passam por controle antidoping devem usar produtos certificados.

## Resumo

- **Creatina monoidratada:** 3 a 5 g por dia, todos os dias.
- **Cafeína:** 3 a 6 mg/kg, 30 a 60 minutos antes, longe da hora de dormir.
- O resto, na maioria dos casos, é dispensável.`,
    sources: [
      { title: 'Kreider et al. (2017) — ISSN position stand: safety and efficacy of creatine supplementation', url: 'https://pubmed.ncbi.nlm.nih.gov/28615996/' },
      { title: 'Guest et al. (2021) — ISSN position stand: caffeine and exercise performance', url: 'https://pubmed.ncbi.nlm.nih.gov/33388079/' },
    ],
  },
  {
    id: 'sono-e-recuperacao',
    title: 'Sono e recuperação: o treino que acontece fora da academia',
    category: 'Recuperação',
    minutes: 4,
    summary: 'Dormir 7 a 9 horas por noite melhora o desempenho, a construção muscular e a perda de gordura. Veja como dormir melhor e outras estratégias de recuperação.',
    body: `## O músculo cresce no descanso

O treino é o estímulo; a adaptação acontece nas horas e dias seguintes. Sono, alimentação e controle do estresse definem o quanto você aproveita de cada sessão.

## Quanto dormir

Segundo a **National Sleep Foundation**:

- **Adultos (18 a 64 anos):** **7 a 9 horas** por noite
- **Idosos (65+):** 7 a 8 horas
- **Adolescentes (14 a 17 anos):** 8 a 10 horas

## O que acontece quando você dorme pouco

- **Desempenho:** menos força, menos repetições e maior percepção de esforço
- **Construção muscular:** a privação de sono reduz a síntese de proteína muscular
- **Dieta:** mais fome, mais vontade de comer alimentos calóricos e menos autocontrole
- **Composição corporal:** em um estudo clássico (Nedeltcheva e colaboradores, 2010), pessoas em dieta que dormiam 5,5 horas perderam a mesma quantidade de peso que as que dormiam 8,5 horas, mas a parte vinda de **gordura caiu pela metade**, e mais massa magra foi perdida
- **Saúde:** pior controle da glicose, da pressão e do humor; mais risco de lesões

## Como dormir melhor

- **Horário regular:** deite e acorde em horários parecidos, inclusive no fim de semana
- **Quarto escuro, silencioso e fresco** (por volta de 18 a 20 °C)
- **Cafeína:** evite nas 6 a 8 horas antes de dormir
- **Álcool:** atrapalha a qualidade do sono, mesmo que dê sono no começo
- **Luz:** pegue luz natural pela manhã; reduza telas e luzes fortes 1 hora antes de deitar
- **Refeições:** evite jantar muito pesado logo antes de dormir
- **Treino:** treinar à noite é ok para a maioria; se atrapalhar o seu sono, antecipe o horário
- **Cochilos** de 20 a 30 minutos podem ajudar quem dormiu pouco

Se você ronca muito, acorda cansado mesmo dormindo bastante ou tem muita sonolência durante o dia, converse com um médico: pode ser apneia do sono.

## Outras estratégias de recuperação

- **Alimentação:** proteína suficiente e calorias adequadas. Déficits grandes atrapalham a recuperação.
- **Intervalo entre treinos:** em geral, 48 a 72 horas para o mesmo músculo depois de uma sessão dura.
- **Atividade leve:** caminhadas e cardio leve nos dias de descanso podem ajudar a reduzir a rigidez.
- **Estresse:** estresse psicológico alto também prejudica a recuperação. Em fases difíceis, reduza um pouco o volume.
- **Deload:** uma semana mais leve a cada 4 a 8 semanas ajuda a dissipar a fadiga acumulada.

## O que funciona menos do que parece

- **Banho de gelo logo depois da musculação:** pode **reduzir os ganhos de massa muscular** (Roberts e colaboradores, 2015). Se o objetivo é hipertrofia, evite logo após o treino. Pode ser útil para atletas em competições com pouco tempo de recuperação.
- **Alongamento para evitar dor muscular:** não reduz de forma relevante a dor tardia. É útil para flexibilidade, não para recuperação.
- **Massagem e liberação miofascial:** podem reduzir a sensação de dor e trazer bem-estar, mas o efeito sobre a recuperação real do desempenho é pequeno.

## Sinais de que você não está se recuperando

- Desempenho caindo por várias sessões
- Dor muscular que não passa entre os treinos
- Dores articulares persistentes
- Irritabilidade, desânimo, sono ruim
- Frequência cardíaca de repouso mais alta do que o normal por vários dias

Se aparecerem, priorize sono, alimentação e considere um deload.

## Resumo

- Durma **7 a 9 horas**, com horários regulares.
- Proteja o sono da cafeína, do álcool e das telas.
- Recuperação também é alimentação, controle do estresse e deloads.
- Evite banho de gelo logo após o treino se o objetivo é ganhar massa.`,
    sources: [
      { title: 'Hirshkowitz et al. (2015) — National Sleep Foundation sleep duration recommendations', url: 'https://pubmed.ncbi.nlm.nih.gov/29073412/' },
      { title: 'Nedeltcheva et al. (2010) — Insufficient sleep undermines dietary efforts to reduce adiposity', url: 'https://pubmed.ncbi.nlm.nih.gov/20921542/' },
      { title: 'Roberts et al. (2015) — Post-exercise cold water immersion attenuates gains in muscle mass', url: 'https://pubmed.ncbi.nlm.nih.gov/26174323/' },
      { title: 'Bell et al. (2023) — Deload: consenso Delphi', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10511399/' },
    ],
  },
  {
    id: 'aquecimento-e-lesoes',
    title: 'Aquecimento e prevenção de lesões: lombar, joelho e ombro',
    category: 'Técnica',
    minutes: 6,
    summary: 'Um aquecimento curto com séries de aproximação prepara o corpo melhor que longos alongamentos. Saiba também como lidar com dores comuns na lombar, joelhos e ombros.',
    body: `## Para que serve o aquecimento

Aquecer aumenta a temperatura muscular, prepara as articulações e o sistema nervoso e, na maioria dos estudos, **melhora o desempenho**. Também é um momento para "ensaiar" o movimento antes das séries pesadas.

## Protocolo de aquecimento sugerido

- **Geral (3 a 10 minutos):** bicicleta, elíptico, caminhada rápida ou remo, em intensidade leve. Use mais tempo em dias frios ou se você for mais velho.
- **Mobilidade dinâmica (1 a 3 minutos):** movimentos das articulações que você vai usar, como agachamento com peso corporal, rotação de ombros, ponte de glúteo, afundo com rotação.
- **Séries de aproximação** no primeiro exercício composto. Exemplo para uma carga de trabalho de 100 kg × 8:
- Barra ou 40% (40 kg) × 8 a 10
- 60% (60 kg) × 5
- 75% a 80% (75 a 80 kg) × 3
- 85% a 90% × 1 a 2 (opcional, para cargas muito pesadas)
- **Exercícios seguintes** do mesmo grupo muscular: 1 a 2 séries de aproximação bastam.

Séries de aquecimento **não contam** como séries de trabalho no seu volume semanal.

## E o alongamento antes do treino?

Alongamentos estáticos curtos (menos de 60 segundos por músculo) praticamente não atrapalham o desempenho, mas também não são necessários e **não previnem lesões** de forma clara. Se você gosta, faça; se não, prefira mobilidade dinâmica.

## Musculação é perigosa?

Não. A taxa de lesões na musculação é **baixa** (cerca de 1 a 4 lesões a cada 1.000 horas de treino), menor do que em muitos esportes coletivos. A maioria das lesões vem de aumentos bruscos de carga ou volume, técnica ruim sob fadiga e ignorar sinais de dor.

## Regra da dor: quando continuar e quando parar

Um guia prático (baseado no modelo de monitoramento da dor):

- **Dor de 0 a 3 (em uma escala de 0 a 10)** durante o exercício, que volta ao normal em até 24 horas: geralmente aceitável.
- **Dor acima de 4 a 5**, dor aguda e "pontiaguda", dor que piora no dia seguinte, inchaço, formigamento ou perda de força: **pare**, reduza a carga ou a amplitude, troque o exercício e procure um profissional de saúde se persistir.

Desconforto muscular de esforço (queimação) é normal. Dor articular aguda, não.

## Lombar

- Não existe uma única "postura perfeita". Alguma flexão da coluna sob carga **não é automaticamente perigosa**, mas a exposição deve ser **progressiva**.
- Em cargas pesadas, use o **bracing**: inspire fundo para o abdômen, contraia o core como se fosse levar um soco e mantenha durante a parte mais difícil da repetição.
- No levantamento terra e no agachamento, mantenha a coluna em uma posição próxima da neutra e a barra perto do corpo.
- Dor lombar comum costuma melhorar com **movimento e exercício progressivo**, não com repouso total.
- Hipertensos devem evitar prender a respiração por muito tempo em cargas máximas.

## Joelho

- O joelho **passar da ponta do pé** no agachamento é normal e seguro para a maioria. Isso apenas transfere um pouco de carga do quadril para o joelho.
- Um leve movimento do joelho para dentro em cargas máximas é comum; com cargas moderadas, busque controle, com os joelhos acompanhando a direção dos pés.
- Para dor na frente do joelho (patelofemoral), reduza temporariamente a profundidade ou a carga, fortaleça quadríceps e quadril e volte a progredir aos poucos.

## Ombro

- No supino, mantenha as escápulas firmes e os cotovelos a cerca de 45° a 75° do tronco (não totalmente abertos a 90°).
- Inclua exercícios para **rotadores externos** e **deltoide posterior** (face pull, crucifixo invertido, rotação externa na polia).
- Evite amplitudes que causam dor, como desenvolvimento atrás da nuca ou mergulho muito profundo, se você tiver sintomas.
- Ajuste a pegada: halteres e pegadas neutras costumam ser mais confortáveis para ombros sensíveis.

## Regras gerais de prevenção

- Aumente carga e volume **gradualmente** (evite saltos de mais de 10% a 20% de uma semana para outra).
- Domine a técnica com cargas moderadas antes de usar cargas altas.
- Durma bem e respeite os deloads.
- Use máquinas e apoios para levar séries mais perto da falha com segurança.
- Grave seus exercícios de vez em quando para revisar a técnica.

## Aviso

Este conteúdo é educativo e não substitui avaliação médica ou fisioterapêutica. Em caso de dor persistente, lesão ou condição de saúde, procure um profissional.`,
    sources: [
      { title: 'Fradkin et al. (2010) — Effects of warming-up on physical performance (revisão)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Fradkin+2010+effects+of+warming-up+on+physical+performance+systematic+review' },
      { title: 'Behm et al. (2016) — Acute effects of muscle stretching on physical performance', url: 'https://pubmed.ncbi.nlm.nih.gov/26642915/' },
      { title: 'Keogh & Winwood (2017) — The epidemiology of injuries across the weight-training sports', url: 'https://pubmed.ncbi.nlm.nih.gov/27328853/' },
      { title: 'Silbernagel et al. (2007) — Pain-monitoring model', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Silbernagel+2007+continued+sports+activity+using+a+pain-monitoring+model' },
      { title: 'Saraceni et al. (2020) — To flex or not to flex? Lifting posture and low back pain', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Saraceni+2020+to+flex+or+not+to+flex+lifting+posture+low+back+pain' },
    ],
  },
  {
    id: 'cadencia-e-conexao-mente-musculo',
    title: 'Cadência das repetições e conexão mente-músculo',
    category: 'Técnica',
    minutes: 4,
    summary: 'Repetições de 0,5 a 8 segundos geram crescimento semelhante. Controle a descida, suba com intenção e use o foco no músculo em exercícios isolados.',
    body: `## O que é cadência

**Cadência** (ou "tempo") é a velocidade de cada fase da repetição: a descida (fase excêntrica), a pausa e a subida (fase concêntrica). Alguns programas usam códigos como "3-1-1" (3 segundos descendo, 1 de pausa, 1 subindo).

## O que dizem os estudos

- **Schoenfeld, Ogborn e Krieger (2015)**, meta-análise: repetições com duração total entre **0,5 e 8 segundos** produziram **hipertrofia semelhante**. Repetições **muito lentas** (acima de 10 segundos) pareceram **inferiores**, provavelmente porque obrigam a usar cargas muito baixas.
- **ACSM 2026:** tempo sob tensão, cadência e configuração das séries têm **efeitos independentes mínimos** quando o volume e a intensidade são equiparados.

Ou seja: não é preciso contar segundos obsessivamente. Mas controlar o movimento tem vantagens.

## Recomendação prática

- **Descida (excêntrica):** controlada, cerca de **2 a 3 segundos**. Isso aumenta a segurança, mantém a tensão na parte alongada e evita usar o "quique" para subir.
- **Pausa:** opcional, de cerca de **1 segundo na posição alongada** (por exemplo, no fundo do agachamento ou com o calcanhar lá embaixo na panturrilha). Ótima para panturrilhas e para evitar impulso.
- **Subida (concêntrica):** com **intenção de velocidade**. Empurre ou puxe com força, mesmo que a carga suba devagar nas últimas repetições. Isso ajuda a recrutar mais fibras.
- **Duração total:** algo entre **2 e 6 segundos por repetição** atende muito bem.

Descidas muito lentas (5 a 10 segundos) aumentam a dor muscular e reduzem a carga e as repetições possíveis, sem benefício claro para o crescimento.

## Conexão mente-músculo

A ideia de "sentir o músculo trabalhando" é popular entre fisiculturistas. A ciência tem algum apoio para ela:

- **Schoenfeld e colaboradores (2018):** iniciantes que focaram em **contrair o músculo** (foco interno) durante a rosca direta tiveram cerca de **12% de crescimento do bíceps**, contra cerca de **7%** do grupo que focou apenas em **mover o peso** (foco externo). No **quadríceps** (agachamento e cadeira extensora), **não houve diferença**.

É apenas um estudo, com iniciantes, mas sugere que o foco no músculo pode ajudar, principalmente em músculos menores e exercícios isolados.

## Foco interno ou externo?

- **Para hipertrofia em exercícios isolados** (rosca, tríceps, elevação lateral, crucifixo, cadeira extensora): pense no músculo, sinta-o alongar e contrair.
- **Para força e desempenho em exercícios compostos e pesados** (agachamento, supino, terra): o **foco externo** costuma funcionar melhor. Exemplos: "empurre o chão para longe", "afaste a barra do peito", "empurre o quadril para a frente".

## Dicas para melhorar a conexão

- Use cargas que permitam controlar o movimento
- Faça uma pausa breve na contração máxima de exercícios isolados
- Toque ou olhe o músculo durante a série (quando for seguro)
- Faça 1 série de aquecimento leve focando apenas em sentir o músculo

## Resumo

- Controle a descida (2 a 3 segundos), suba com intenção de velocidade.
- Qualquer cadência entre 0,5 e 8 segundos por repetição funciona; evite repetições superlentas.
- Use o foco no músculo em isolados e o foco externo em levantamentos pesados.`,
    sources: [
      { title: 'Schoenfeld, Ogborn, Krieger (2015) — Effect of repetition duration on muscle hypertrophy (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/25601394/' },
      { title: 'Schoenfeld et al. (2018) — Differential effects of attentional focus strategies during long-term resistance training', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Schoenfeld+2018+differential+effects+of+attentional+focus+strategies+during+long-term+resistance+training' },
      { title: 'ACSM (2026) — Position Stand: resistance training prescription', url: 'https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx' },
    ],
  },
  {
    id: 'medir-progresso',
    title: 'Como medir seu progresso: percentual de gordura, medidas e fotos',
    category: 'Saúde',
    minutes: 6,
    summary: 'A balança sozinha engana. Combine média semanal de peso, medidas com fita, o método da Marinha para estimar gordura e fotos padronizadas.',
    body: `## Por que não confiar só na balança

O peso corporal varia **0,5 a 2 kg de um dia para o outro** por causa de água, sal, carboidratos, intestino e ciclo menstrual. Além disso, quem treina pode ganhar músculo enquanto perde gordura, e a balança mal se mexe. Por isso, use várias ferramentas.

## 1. Peso: use a média semanal

- Pese-se **todos os dias** (ou pelo menos 3 a 4 vezes por semana), ao acordar, depois de ir ao banheiro, antes de comer ou beber, com a mesma balança.
- Olhe a **média da semana** e compare com a semana anterior. A tendência importa; o número de um dia, não.

## 2. Medidas com fita métrica

A cada **2 a 4 semanas**, de manhã, em jejum, com uma fita flexível justa sem apertar e o músculo relaxado:

- **Pescoço:** logo abaixo do "pomo de Adão"
- **Tórax:** na linha dos mamilos
- **Braço:** no meio do braço, relaxado (e, se quiser, contraído)
- **Cintura:** na altura do umbigo
- **Quadril:** na maior circunferência dos glúteos
- **Coxa:** no ponto médio entre o quadril e o joelho
- **Panturrilha:** na maior circunferência

Meça 2 vezes cada local e use a média. A **cintura** é uma das medidas mais úteis: se ela diminui enquanto o braço e a coxa se mantêm ou aumentam, você está no caminho certo.

## Relação cintura/altura

Divida a cintura pela altura (ambas em cm). Um valor **abaixo de 0,5** está associado a menor risco cardiometabólico. Exemplo: 85 cm ÷ 175 cm = 0,49.

## 3. Estimando o percentual de gordura: método da Marinha dos EUA

Um método simples que usa apenas a fita métrica (medidas em centímetros):

- **Homens:** %G = 495 ÷ (1,0324 − 0,19077 × log10(cintura − pescoço) + 0,15456 × log10(altura)) − 450
- **Mulheres:** %G = 495 ÷ (1,29579 − 0,35004 × log10(cintura + quadril − pescoço) + 0,22100 × log10(altura)) − 450

Onde medir:

- **Pescoço:** logo abaixo da laringe
- **Cintura (homens):** na altura do umbigo
- **Cintura (mulheres):** no ponto mais estreito do abdômen
- **Quadril (mulheres):** na maior circunferência dos glúteos

O app faz a conta para você. Saiba que o erro típico é de **3 a 4 pontos percentuais** em relação a métodos de referência, e ele erra mais em pessoas muito musculosas ou com obesidade. Use-o para acompanhar a **tendência** ao longo do tempo, e não como um número exato.

Com o percentual estimado, você calcula:

- **Massa de gordura** = peso × %G ÷ 100
- **Massa magra** = peso − massa de gordura

## Faixas de referência aproximadas (ACE)

- **Homens:** atletas 6% a 13%; boa forma 14% a 17%; média 18% a 24%; obesidade 25% ou mais
- **Mulheres:** atletas 14% a 20%; boa forma 21% a 24%; média 25% a 31%; obesidade 32% ou mais

Gordura muito baixa (abaixo de cerca de 5% em homens e 12% em mulheres) não é saudável a longo prazo.

## Outros métodos

- **Dobras cutâneas:** boas quando feitas por avaliador experiente e sempre pelo mesmo
- **Bioimpedância (balanças de gordura):** muito sensível à hidratação; use sempre nas mesmas condições
- **DEXA:** referência prática, mas também tem erro e custo maior

## 4. Fotos de progresso

Fotos mostram mudanças que números não captam. Para que sejam comparáveis:

- **Frequência:** a cada 2 a 4 semanas
- **Mesmas condições:** mesmo local, mesma iluminação (luz difusa de frente), mesmo horário (manhã, em jejum), mesma roupa
- **Câmera:** na altura do umbigo ou do peito, a cerca de 2 a 3 metros, na vertical, sem zoom de grande angular. Use timer ou tripé.
- **Poses:** de frente, de lado (os dois lados) e de costas, relaxado. Opcionalmente, repita contraindo.
- **Comparação:** coloque fotos lado a lado com pelo menos 4 semanas de diferença.

O app guarda suas fotos de forma privada.

## 5. Desempenho

Ficar mais forte é um dos melhores sinais de progresso. Se as cargas e repetições sobem ao longo dos meses, e a cintura não aumenta muito, você provavelmente está ganhando músculo.

## Resumo

- Use a **média semanal** do peso.
- Meça a fita a cada 2 a 4 semanas, especialmente a **cintura**.
- O método da Marinha é útil para ver **tendências**.
- Fotos padronizadas e registro de cargas completam o quadro.`,
    sources: [
      { title: 'Hodgdon & Beckett (1984) — Prediction of percent body fat for U.S. Navy men and women', url: 'https://apps.dtic.mil/sti/citations/ADA143890' },
      { title: 'ACE — Percent body fat calculator e faixas de referência', url: 'https://www.acefitness.org/resources/everyone/tools-calculators/percent-body-fat-calculator/' },
      { title: 'Ashwell et al. (2012) — Waist-to-height ratio as a screening tool (meta-análise)', url: 'https://pubmed.ncbi.nlm.nih.gov/22106927/' },
    ],
  },
]
