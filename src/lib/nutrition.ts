import type { Measurement, Profile } from './types';

export function bmr(p: Profile) {
  if (p.bodyFat && p.bodyFat > 3 && p.bodyFat < 60) {
    const lbm = p.weightKg * (1 - p.bodyFat / 100);
    return { value: 370 + 21.6 * lbm, method: 'Katch-McArdle (usa massa magra)' };
  }
  const v = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'M' ? 5 : -161);
  return { value: v, method: 'Mifflin-St Jeor' };
}

const NEAT = { sedentary: 1.25, light: 1.4, moderate: 1.55, high: 1.7 };

export function tdee(p: Profile) {
  const b = bmr(p);
  const neat = b.value * NEAT[p.activity];
  // gasto aproximado da musculação: ~5 kcal/min de sessão (inclui descansos)
  const training = (p.days.length * p.sessionMinutes * 5) / 7;
  return { bmr: Math.round(b.value), method: b.method, neat: Math.round(neat), training: Math.round(training), total: Math.round(neat + training) };
}

export function bmi(p: Profile) {
  const h = p.heightCm / 100;
  return p.weightKg / (h * h);
}

export function bmiLabel(v: number) {
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25) return 'Normal';
  if (v < 30) return 'Sobrepeso';
  return 'Obesidade';
}

export interface Macros {
  kcal: number; protein: number; fat: number; carbs: number; fiber: number; waterL: number;
  deltaPct: number; weeklyChangeKg: number; notes: string[];
}

export function macros(p: Profile): Macros {
  const t = tdee(p).total;
  const notes: string[] = [];
  let delta = 0;
  switch (p.goal) {
    case 'fat_loss': delta = -0.2; notes.push('Déficit de ~20%: mira perder 0,5–1% do peso por semana, preservando massa magra.'); break;
    case 'recomp': delta = -0.07; notes.push('Recomposição: leve déficit (~5–10%) com proteína alta. Funciona melhor para iniciantes, destreinados ou quem tem mais gordura.'); break;
    case 'hypertrophy': delta = p.experience === 'beginner' ? 0.1 : p.experience === 'intermediate' ? 0.07 : 0.05; notes.push('Superávit leve: ganho de ~0,25–0,5% do peso por mês (avançados no limite inferior) minimiza ganho de gordura.'); break;
    case 'strength': delta = 0.05; notes.push('Leve superávit ajuda o desempenho e a recuperação nos treinos pesados.'); break;
    case 'endurance': delta = 0; notes.push('Manutenção. Aumente carboidratos em dias de treinos longos.'); break;
    case 'health': delta = 0; notes.push('Manutenção do peso com alimentação de qualidade.'); break;
  }
  const kcal = Math.round((t * (1 + delta)) / 10) * 10;
  // proteína: 1,6 g/kg (ponto de saturação médio, Morton 2018) a 2,2 g/kg; mais alta em déficit (Helms 2014)
  const b = bmi(p);
  const refWeight = b > 30 ? 25 * (p.heightCm / 100) ** 2 + 0.25 * (p.weightKg - 25 * (p.heightCm / 100) ** 2) : p.weightKg;
  if (b > 30) notes.push('Com IMC > 30, a proteína é calculada sobre um peso ajustado (evita metas exageradas).');
  const gPerKg = { fat_loss: 2.2, recomp: 2.2, hypertrophy: 1.8, strength: 1.8, endurance: 1.6, health: 1.6 }[p.goal];
  const protein = Math.round(refWeight * gPerKg);
  const fat = Math.round(Math.max(0.7 * p.weightKg, (kcal * 0.27) / 9));
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const fiber = Math.round((kcal / 1000) * 14);
  const waterL = Math.round(((p.weightKg * 35) / 1000 + (p.sessionMinutes / 60) * 0.5) * 10) / 10;
  const weeklyChangeKg = Math.round(((t * delta * 7) / 7700) * 100) / 100;
  return { kcal, protein, fat, carbs, fiber, waterL, deltaPct: Math.round(delta * 100), weeklyChangeKg, notes };
}

/** Método da Marinha dos EUA (medidas em cm). */
export function navyBodyFat(sex: 'M' | 'F', heightCm: number, waist?: number, neck?: number, hip?: number): number | null {
  if (!waist || !neck) return null;
  if (sex === 'M') {
    if (waist - neck <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  if (!hip || waist + hip - neck <= 0) return null;
  return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(heightCm)) - 450;
}

export function ffmi(weightKg: number, heightCm: number, bf: number) {
  const lean = weightKg * (1 - bf / 100);
  const h = heightCm / 100;
  const raw = lean / (h * h);
  return { raw, normalized: raw + 6.1 * (1.8 - h) };
}

/** Média móvel de 7 dias do peso e taxa de variação semanal. */
export function weightTrend(ms: Measurement[]) {
  const pts = ms.filter((m) => m.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length < 2) return null;
  const avg = (from: number, to: number) => {
    const sel = pts.filter((m) => {
      const t = new Date(m.date).getTime();
      return t >= from && t <= to;
    });
    return sel.length ? sel.reduce((a, m) => a + (m.weightKg || 0), 0) / sel.length : null;
  };
  const last = new Date(pts[pts.length - 1].date).getTime();
  const day = 86400000;
  const now = avg(last - 6 * day, last);
  const prev = avg(last - 13 * day, last - 7 * day);
  if (now == null || prev == null) return { avg: now, perWeek: null };
  return { avg: now, perWeek: now - prev };
}

export const FOODS = [
  { group: 'Proteínas', items: ['Peito de frango', 'Ovos', 'Carne magra (patinho, alcatra)', 'Peixe (tilápia, salmão, sardinha)', 'Atum em lata', 'Iogurte natural / grego', 'Queijo cottage / minas frescal', 'Whey protein', 'Tofu, lentilha, grão-de-bico'] },
  { group: 'Carboidratos', items: ['Arroz', 'Feijão', 'Batata / batata-doce', 'Mandioca', 'Aveia', 'Pão integral', 'Macarrão', 'Frutas (banana, maçã, mamão)', 'Cuscuz / tapioca'] },
  { group: 'Gorduras boas', items: ['Azeite de oliva', 'Abacate', 'Castanhas e amendoim', 'Pasta de amendoim', 'Gema de ovo', 'Peixes gordos', 'Chia / linhaça'] },
  { group: 'Vegetais (fibras)', items: ['Folhas verdes', 'Brócolis', 'Cenoura', 'Tomate', 'Abobrinha', 'Couve', 'Beterraba'] },
];

export const SUPPLEMENTS = [
  { name: 'Creatina monohidratada', dose: '3–5 g/dia, todo dia, qualquer horário', evidence: 'Forte', note: 'O suplemento mais estudado: mais força, mais massa magra e possíveis benefícios cognitivos. Não precisa de fase de saturação.' },
  { name: 'Whey protein', dose: 'Conforme necessidade para fechar a proteína', evidence: 'Forte (como alimento)', note: 'É só comida prática. Não é obrigatório se você bate a meta de proteína com alimentos.' },
  { name: 'Cafeína', dose: '3–6 mg/kg, 30–60 min antes', evidence: 'Forte', note: 'Melhora desempenho. Evite 8h antes de dormir — sono ruim custa mais do que a cafeína ajuda.' },
  { name: 'Vitamina D', dose: 'Se houver deficiência (exame de sangue)', evidence: 'Moderada', note: 'Corrigir deficiência ajuda saúde óssea e muscular. Converse com seu médico.' },
  { name: 'Ômega-3', dose: '1–3 g EPA+DHA/dia se come pouco peixe', evidence: 'Moderada (saúde)', note: 'Benefícios cardiovasculares; efeito direto em hipertrofia é pequeno/incerto.' },
  { name: 'Beta-alanina', dose: '3,2–6,4 g/dia', evidence: 'Moderada', note: 'Ajuda em esforços de 1–4 min (séries longas, intervalados). Causa formigamento inofensivo.' },
];
