import { useEffect } from 'react';
import { useStore } from './lib/store';
import { useNav, go, type Tab } from './lib/nav';
import { Icon } from './components/ui';
import ExerciseSheet from './components/ExerciseSheet';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Plan from './screens/Plan';
import Workout from './screens/Workout';
import Progress from './screens/Progress';
import Coach from './screens/Coach';
import More from './screens/More';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Hoje' },
  { id: 'plan', icon: 'dumbbell', label: 'Treino' },
  { id: 'progress', icon: 'chart', label: 'Evolução' },
  { id: 'coach', icon: 'chat', label: 'Coach' },
  { id: 'more', icon: 'more', label: 'Mais' },
];

export default function App() {
  const profile = useStore((s) => s.profile);
  const theme = useStore((s) => s.settings.theme);
  const active = useStore((s) => s.active);
  const nav = useNav();

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  if (!profile) return <Onboarding />;

  const inWorkout = nav.screen === 'workout';
  return (
    <>
      <div className="app">
        {inWorkout ? <Workout /> : (
          <>
            {nav.tab === 'home' && <Home />}
            {nav.tab === 'plan' && <Plan />}
            {nav.tab === 'progress' && <Progress />}
            {nav.tab === 'coach' && <Coach />}
            {nav.tab === 'more' && <More />}
          </>
        )}
      </div>
      {active && !inWorkout && (
        <button className="btn primary fab" onClick={() => go({ screen: 'workout', workoutDay: active.dayId })}>
          <Icon name="play" fill size={16} /> Treino em andamento
        </button>
      )}
      {!inWorkout && (
        <nav className="tabbar">
          <div className="tabbar-inner">
            {TABS.map((t) => (
              <button key={t.id} className={`tab ${nav.tab === t.id ? 'on' : ''}`} onClick={() => go({ tab: t.id, screen: null, article: null })}>
                <Icon name={t.icon} />{t.label}
              </button>
            ))}
          </div>
        </nav>
      )}
      <ExerciseSheet />
    </>
  );
}
