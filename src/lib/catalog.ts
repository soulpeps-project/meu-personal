import type { EquipmentId, Muscle, Injury, Pattern } from '../data/exercises';

export const MUSCLE_LABEL: Record<Muscle, string> = {
  chest: 'Peitoral',
  lats: 'Dorsais (latíssimo)',
  upperBack: 'Costas médias (romboides/trapézio médio)',
  traps: 'Trapézio superior',
  frontDelts: 'Deltoide anterior',
  sideDelts: 'Deltoide lateral',
  rearDelts: 'Deltoide posterior',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearms: 'Antebraços',
  quads: 'Quadríceps',
  hamstrings: 'Posteriores de coxa',
  glutes: 'Glúteos',
  adductors: 'Adutores',
  abductors: 'Abdutores (glúteo médio)',
  calves: 'Panturrilhas',
  abs: 'Abdômen',
  obliques: 'Oblíquos',
  lowerBack: 'Lombar (eretores)',
};

export const MUSCLE_SHORT: Record<Muscle, string> = {
  chest: 'Peito', lats: 'Dorsal', upperBack: 'Costas méd.', traps: 'Trapézio', frontDelts: 'Ombro ant.',
  sideDelts: 'Ombro lat.', rearDelts: 'Ombro post.', biceps: 'Bíceps', triceps: 'Tríceps', forearms: 'Antebraço',
  quads: 'Quadríceps', hamstrings: 'Posterior', glutes: 'Glúteos', adductors: 'Adutores', abductors: 'Abdutores',
  calves: 'Panturrilha', abs: 'Abdômen', obliques: 'Oblíquos', lowerBack: 'Lombar',
};

export const ALL_MUSCLES = Object.keys(MUSCLE_LABEL) as Muscle[];

/** Músculos que o usuário pode marcar como prioridade (agrupados de forma intuitiva). */
export const PRIORITY_OPTIONS: { id: Muscle; label: string }[] = [
  { id: 'chest', label: 'Peito' },
  { id: 'lats', label: 'Costas (largura)' },
  { id: 'upperBack', label: 'Costas (espessura)' },
  { id: 'sideDelts', label: 'Ombros (largura)' },
  { id: 'rearDelts', label: 'Ombro posterior' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'quads', label: 'Quadríceps' },
  { id: 'hamstrings', label: 'Posteriores' },
  { id: 'glutes', label: 'Glúteos' },
  { id: 'calves', label: 'Panturrilhas' },
  { id: 'abs', label: 'Abdômen' },
  { id: 'traps', label: 'Trapézio' },
  { id: 'forearms', label: 'Antebraços' },
  { id: 'adductors', label: 'Adutores' },
  { id: 'abductors', label: 'Abdutores' },
];

export const INJURY_LABEL: Record<Injury, string> = {
  lower_back: 'Lombar / hérnia',
  knee: 'Joelho',
  shoulder: 'Ombro',
  elbow: 'Cotovelo',
  wrist: 'Punho',
  neck: 'Pescoço / cervical',
  hip: 'Quadril',
};

export const PATTERN_LABEL: Record<Pattern, string> = {
  horizontal_push: 'Empurrar horizontal', incline_push: 'Empurrar inclinado', vertical_push: 'Empurrar vertical',
  horizontal_pull: 'Puxar horizontal', vertical_pull: 'Puxar vertical', squat: 'Agachar', hinge: 'Dobradiça de quadril',
  lunge: 'Avanço / unilateral', knee_extension: 'Extensão de joelho', knee_flexion: 'Flexão de joelho',
  hip_extension: 'Extensão de quadril', hip_abduction: 'Abdução de quadril', hip_adduction: 'Adução de quadril',
  elbow_flexion: 'Flexão de cotovelo', elbow_extension: 'Extensão de cotovelo', lateral_raise: 'Elevação lateral',
  chest_fly: 'Crucifixo', rear_delt: 'Deltoide posterior', shrug: 'Encolhimento', calf: 'Panturrilha',
  core_flexion: 'Flexão de tronco', core_anti_extension: 'Anti-extensão', core_rotation: 'Rotação / anti-rotação',
  wrist: 'Punho', carry: 'Carregamento',
};

export interface EquipmentInfo { id: EquipmentId; label: string; group: string }

export const EQUIPMENT: EquipmentInfo[] = [
  { id: 'barbell', label: 'Barra olímpica + anilhas', group: 'Pesos livres' },
  { id: 'dumbbell', label: 'Halteres', group: 'Pesos livres' },
  { id: 'ez_bar', label: 'Barra W (EZ)', group: 'Pesos livres' },
  { id: 'trap_bar', label: 'Barra hexagonal (trap bar)', group: 'Pesos livres' },
  { id: 'kettlebell', label: 'Kettlebell', group: 'Pesos livres' },
  { id: 'bands', label: 'Elásticos / faixas', group: 'Pesos livres' },
  { id: 'landmine', label: 'Landmine (barra no canto)', group: 'Pesos livres' },
  { id: 'squat_rack', label: 'Rack / gaiola de agachamento', group: 'Estruturas' },
  { id: 'smith', label: 'Smith (barra guiada)', group: 'Estruturas' },
  { id: 'bench_flat', label: 'Banco reto', group: 'Estruturas' },
  { id: 'bench_adjustable', label: 'Banco regulável (inclinado/declinado)', group: 'Estruturas' },
  { id: 'preacher_bench', label: 'Banco Scott', group: 'Estruturas' },
  { id: 'pullup_bar', label: 'Barra fixa', group: 'Estruturas' },
  { id: 'dip_station', label: 'Paralelas', group: 'Estruturas' },
  { id: 'hyperextension', label: 'Banco de hiperextensão / 45°', group: 'Estruturas' },
  { id: 'ab_wheel', label: 'Roda abdominal', group: 'Estruturas' },
  { id: 'cable', label: 'Cross over / polia ajustável', group: 'Polias' },
  { id: 'lat_pulldown', label: 'Puxador (pulldown)', group: 'Polias' },
  { id: 'seated_row', label: 'Remada baixa na polia', group: 'Polias' },
  { id: 'chest_supported_row', label: 'Remada máquina (apoio no peito)', group: 'Máquinas de costas' },
  { id: 't_bar_row', label: 'Remada cavalinho (T-bar)', group: 'Máquinas de costas' },
  { id: 'assisted_pullup', label: 'Barra fixa assistida (gravitron)', group: 'Máquinas de costas' },
  { id: 'chest_press_machine', label: 'Supino máquina', group: 'Máquinas de peito e ombro' },
  { id: 'incline_press_machine', label: 'Supino inclinado máquina', group: 'Máquinas de peito e ombro' },
  { id: 'pec_deck', label: 'Voador / peck deck', group: 'Máquinas de peito e ombro' },
  { id: 'shoulder_press_machine', label: 'Desenvolvimento máquina', group: 'Máquinas de peito e ombro' },
  { id: 'lateral_raise_machine', label: 'Elevação lateral máquina', group: 'Máquinas de peito e ombro' },
  { id: 'biceps_curl_machine', label: 'Rosca bíceps máquina', group: 'Máquinas de braço e core' },
  { id: 'triceps_machine', label: 'Tríceps máquina', group: 'Máquinas de braço e core' },
  { id: 'ab_crunch_machine', label: 'Abdominal máquina', group: 'Máquinas de braço e core' },
  { id: 'leg_press', label: 'Leg press', group: 'Máquinas de pernas' },
  { id: 'hack_squat', label: 'Hack squat', group: 'Máquinas de pernas' },
  { id: 'pendulum_squat', label: 'Agachamento pêndulo', group: 'Máquinas de pernas' },
  { id: 'leg_extension', label: 'Cadeira extensora', group: 'Máquinas de pernas' },
  { id: 'leg_curl_seated', label: 'Cadeira flexora', group: 'Máquinas de pernas' },
  { id: 'leg_curl_lying', label: 'Mesa flexora', group: 'Máquinas de pernas' },
  { id: 'hip_thrust_machine', label: 'Máquina de elevação pélvica', group: 'Máquinas de pernas' },
  { id: 'glute_kickback_machine', label: 'Glúteo máquina (coice)', group: 'Máquinas de pernas' },
  { id: 'abductor_machine', label: 'Cadeira abdutora', group: 'Máquinas de pernas' },
  { id: 'adductor_machine', label: 'Cadeira adutora', group: 'Máquinas de pernas' },
  { id: 'calf_standing_machine', label: 'Panturrilha em pé (máquina)', group: 'Máquinas de pernas' },
  { id: 'calf_seated_machine', label: 'Panturrilha sentado (máquina)', group: 'Máquinas de pernas' },
];

export const EQUIPMENT_LABEL: Record<string, string> = Object.fromEntries(
  [...EQUIPMENT.map((e) => [e.id, e.label]), ['none', 'Peso corporal']],
);

const ALL_EQUIP = EQUIPMENT.map((e) => e.id);

export const EQUIPMENT_PRESETS: { id: string; label: string; desc: string; items: EquipmentId[] }[] = [
  { id: 'full', label: 'Academia completa', desc: 'Academia comercial grande, tem de tudo', items: ALL_EQUIP },
  {
    id: 'standard', label: 'Academia de bairro', desc: 'Pesos livres, polias e máquinas básicas',
    items: ['barbell', 'dumbbell', 'ez_bar', 'squat_rack', 'smith', 'bench_flat', 'bench_adjustable', 'preacher_bench',
      'pullup_bar', 'dip_station', 'cable', 'lat_pulldown', 'seated_row', 'pec_deck', 'leg_press', 'leg_extension',
      'leg_curl_seated', 'leg_curl_lying', 'abductor_machine', 'adductor_machine', 'calf_standing_machine', 'hyperextension'],
  },
  { id: 'home', label: 'Em casa (halteres)', desc: 'Halteres, banco e elásticos', items: ['dumbbell', 'bench_adjustable', 'bench_flat', 'bands', 'pullup_bar'] },
  { id: 'bodyweight', label: 'Só peso corporal', desc: 'Barra fixa e elásticos', items: ['pullup_bar', 'bands'] },
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
