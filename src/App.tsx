import { useState } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from './components/Button';
import './App.css';

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export default function App() {
  const [clicks, setClicks] = useState(0);
  const [last, setLast] = useState('nothing yet');

  const handle = (label: string) => () => {
    setClicks((n) => n + 1);
    setLast(label);
  };

  return (
    <main className="demo">
      <h1 className="demo__title">Cherry Button</h1>
      <p className="demo__muted" aria-live="polite">
        Clicks: {clicks} · Last clicked: {last}
      </p>

      <section className="demo__section">
        <h2 className="demo__heading">Variants × sizes</h2>
        {variants.map((variant) => (
          <div className="demo__row" key={variant}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size} onClick={handle(`${variant} ${size}`)}>
                {variant} {size}
              </Button>
            ))}
          </div>
        ))}
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Disabled</h2>
        <div className="demo__row">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} disabled onClick={handle(`disabled ${variant}`)}>
              {variant} disabled
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
}
