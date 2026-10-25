import { useStore } from '../lib/store';
import { macros, tdee, FOODS, SUPPLEMENTS, bmi, bmiLabel } from '../lib/nutrition';

export default function Nutrition() {
  const p = useStore((s) => s.profile)!;
  const m = macros(p);
  const t = tdee(p);
  const meals = p.goal === 'fat_loss' ? 4 : 4;
  const perMeal = Math.round(m.protein / meals);
  const pct = (g: number, k: number) => Math.round(((g * k) / m.kcal) * 100);
  return (
    <div>
      <div className="card hero">
        <div className="muted">Meta diária</div>
        <div className="kpi">{m.kcal} kcal</div>
        <p className="muted">{m.deltaPct === 0 ? 'Manutenção' : `${m.deltaPct > 0 ? '+' : ''}${m.deltaPct}% do gasto`} · variação esperada ~{m.weeklyChangeKg > 0 ? '+' : ''}{m.weeklyChangeKg} kg/semana</p>
        <div className="grid3">
          <div className="stat"><div className="v">{m.protein}g</div><div className="l">Proteína · {pct(m.protein, 4)}%</div></div>
          <div className="stat"><div className="v">{m.carbs}g</div><div className="l">Carboidrato · {pct(m.carbs, 4)}%</div></div>
          <div className="stat"><div className="v">{m.fat}g</div><div className="l">Gordura · {pct(m.fat, 9)}%</div></div>
        </div>
        <div className="row mt wrap">
          <span className="tag">Fibras ≥ {m.fiber} g</span><span className="tag">Água ~{m.waterL} L</span><span className="tag">{(m.protein / p.weightKg).toFixed(1)} g/kg proteína</span>
        </div>
      </div>
      <div className="card">
        <h3>Como calculamos</h3>
        <table className="t"><tbody>
          <tr><td>Metabolismo basal ({t.method})</td><td><b>{t.bmr} kcal</b></td></tr>
          <tr><td>Com atividade diária (NEAT)</td><td><b>{t.neat} kcal</b></td></tr>
          <tr><td>Treinos (média por dia)</td><td><b>+{t.training} kcal</b></td></tr>
          <tr><td>Gasto total estimado</td><td><b>{t.total} kcal</b></td></tr>
          <tr><td>IMC</td><td>{bmi(p).toFixed(1)} · {bmiLabel(bmi(p))}</td></tr>
        </tbody></table>
        <ul className="list mt">{m.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
        <div className="info-box">Equações são estimativas (erro de ±10%). Use por 2–3 semanas, acompanhe a média do peso e ajuste ~100–200 kcal se a tendência não bater com o objetivo.</div>
      </div>
      <div className="card">
        <h3>Distribuição da proteína</h3>
        <p>Divida em {meals} refeições de ~<b>{perMeal} g</b> (≈0,4 g/kg por refeição), incluindo uma refeição com proteína 1–2h antes e outra até 2h depois do treino.</p>
        <p className="muted" style={{ marginBottom: 0 }}>Ex.: 150 g de frango ≈ 45 g · 3 ovos ≈ 18 g · 1 scoop de whey ≈ 24 g · 170 g iogurte grego ≈ 15 g · 100 g de feijão cozido ≈ 5 g.</p>
      </div>
      <div className="card">
        <h3>Exemplo de dia</h3>
        <ul className="list">
          <li><b>Café da manhã:</b> ovos mexidos + pão integral + fruta + café.</li>
          <li><b>Almoço:</b> arroz + feijão + {Math.round(perMeal / 0.3)} g de carne/frango + salada + legumes + azeite.</li>
          <li><b>Pré-treino:</b> iogurte com aveia e banana (ou whey com fruta).</li>
          <li><b>Jantar:</b> batata/mandioca + peixe ou carne magra + vegetais.</li>
          {p.goal === 'hypertrophy' && <li><b>Ceia:</b> iogurte, queijo cottage ou leite + castanhas.</li>}
        </ul>
        <p className="muted">Ajuste porções de carboidrato e gordura para bater as calorias. A base é comida de verdade.</p>
      </div>
      <div className="card">
        <h3>Escolhas inteligentes</h3>
        {FOODS.map((g) => (
          <div key={g.group} className="mb"><b>{g.group}</b><div className="muted">{g.items.join(' · ')}</div></div>
        ))}
      </div>
      <div className="card">
        <h3>Suplementos com evidência</h3>
        {SUPPLEMENTS.map((s) => (
          <div key={s.name} className="mb">
            <div className="row between"><b>{s.name}</b><span className={`tag ${s.evidence.startsWith('Forte') ? 'accent' : ''}`}>{s.evidence}</span></div>
            <div className="muted">{s.dose}</div>
            <div style={{ fontSize: 14 }}>{s.note}</div>
          </div>
        ))}
        <div className="warn-box">Consulte um nutricionista ou médico, especialmente se tiver condições de saúde, usar medicamentos, estiver grávida ou for menor de idade.</div>
      </div>
    </div>
  );
}
