# Meu Personal

Personal trainer baseado em evidências: monta o treino a partir dos seus dados, dias, tempo, equipamentos, lesões e objetivos, com execução detalhada de cada exercício, progressão automática de carga, fotos, medidas, nutrição e um coach com IA (opcional).

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Para usar no celular na mesma rede Wi-Fi, abra `http://IP-DO-PC:5173`.

Para gerar a versão de produção (PWA instalável): `npm run build` e publique a pasta `dist/` em um host com HTTPS (Vercel, Netlify, Cloudflare Pages).

## Estrutura

- `src/data/exercises.ts`: 189 exercícios em PT-BR (músculos, equipamentos, passo a passo, erros, dicas, imagens da free-exercise-db).
- `src/data/articles.ts`: 24 artigos sobre ciência do treino, com fontes.
- `docs/base-de-conhecimento.md`: base de conhecimento completa (volume, RIR, descanso, deload, nutrição…) usada para calibrar o motor.
- `src/lib/generator.ts`: motor que gera o programa (divisão, volume semanal com contagem fracionada, seleção de exercícios, ajuste ao tempo, mesociclo, cardio).
- `src/lib/progression.ts`: progressão dupla com RIR, 1RM estimado e recordes.
- `src/lib/nutrition.ts`: gasto calórico, macros, % de gordura (Marinha), FFMI.
- `src/lib/ai.ts`: coach, análise de físico e reconhecimento de aparelhos por foto (Claude API; precisa da sua chave).

Os dados ficam no navegador (localStorage + IndexedDB para fotos). Use Mais → Configurações → Backup para exportar.

As orientações são educativas e não substituem avaliação médica ou de um profissional de educação física.
