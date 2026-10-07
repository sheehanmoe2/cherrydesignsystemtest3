import { useState } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from './components/Button';
import { Badge, type BadgeAppearance, type BadgeSize, type BadgeVariant } from './components/Badge';
import { Card, type CardPadding, type CardVariant } from './components/Card';
import './App.css';

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
const cardVariants: CardVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
const paddings: CardPadding[] = ['sm', 'md', 'lg'];
const badgeVariants: BadgeVariant[] = ['neutral', 'info', 'success', 'warning', 'danger'];
const badgeAppearances: BadgeAppearance[] = ['subtle', 'solid', 'outline'];
const badgeSizes: BadgeSize[] = ['sm', 'md', 'lg'];

export default function App() {
  const [clicks, setClicks] = useState(0);
  const [last, setLast] = useState('nothing yet');
  const [cardClicks, setCardClicks] = useState(0);

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

      <h1 className="demo__title demo__title--spaced">Cherry Card</h1>
      <p className="demo__muted" aria-live="polite">
        Interactive card clicks: {cardClicks}
      </p>

      <section className="demo__section">
        <h2 className="demo__heading">Variants × padding</h2>
        {cardVariants.map((variant) => (
          <div className="demo__grid" key={variant}>
            {paddings.map((padding) => (
              <Card key={padding} variant={variant} padding={padding}>
                {variant} {padding}
              </Card>
            ))}
          </div>
        ))}
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Interactive</h2>
        <div className="demo__grid">
          {cardVariants.map((variant) => (
            <Card key={variant} variant={variant} interactive onClick={() => setCardClicks((n) => n + 1)}>
              <Card.Header>{variant} interactive</Card.Header>
              <Card.Body>Click, or Tab here and press Enter or Space.</Card.Body>
            </Card>
          ))}
        </div>
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Disabled</h2>
        <div className="demo__grid">
          {cardVariants.map((variant) => (
            <Card key={variant} variant={variant} interactive disabled>
              {variant} disabled
            </Card>
          ))}
        </div>
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Header, body and footer</h2>
        <div className="demo__grid">
          <Card as="article" variant="secondary">
            <Card.Header>Delete project</Card.Header>
            <Card.Body>This removes the project and its history. You can't undo this.</Card.Body>
            <Card.Footer>
              <Button variant="danger" size="sm" onClick={handle('card delete')}>
                Delete
              </Button>
              <Button variant="tertiary" size="sm" onClick={handle('card cancel')}>
                Cancel
              </Button>
            </Card.Footer>
          </Card>
          <Card as="section" variant="primary" padding="lg">
            <Card.Body>
              Slots are optional and composable. This card has only a body and larger padding.
            </Card.Body>
          </Card>
        </div>
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Long content</h2>
        <div className="demo__grid">
          <Card variant="secondary">
            <Card.Header>A header that is long enough to need wrapping onto a second line at narrow widths</Card.Header>
            <Card.Body>
              https://example.com/a/very/long/unbroken/path/that/would/overflow/a/narrow/card/if/it/could/not/wrap
            </Card.Body>
          </Card>
        </div>
      </section>

      <h1 className="demo__title demo__title--spaced">Cherry Badge</h1>
      <p className="demo__muted">Status indicators. Use subtle by default, solid for counts and high-attention states, outline for quiet emphasis. Meaning is always carried by the label, never by colour alone.</p>

      <section className="demo__section">
        <h2 className="demo__heading">Variants × appearance × size</h2>
        {badgeVariants.map((variant) =>
          badgeAppearances.map((appearance) => (
            <div className="demo__row" key={`${variant}-${appearance}`}>
              {badgeSizes.map((size) => (
                <Badge key={size} variant={variant} appearance={appearance} size={size}>
                  {variant} {appearance} {size}
                </Badge>
              ))}
            </div>
          )),
        )}
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">With status dot</h2>
        {badgeAppearances.map((appearance) => (
          <div className="demo__row" key={appearance}>
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant} appearance={appearance} dot>
                {variant}
              </Badge>
            ))}
          </div>
        ))}
      </section>

      <section className="demo__section">
        <h2 className="demo__heading">Counts, long labels and RTL</h2>
        <p className="demo__muted">
          Counts carry their context as hidden text. A truncated label shows its full text on hover.
        </p>
        <div className="demo__row">
          <Badge variant="danger" appearance="solid" size="sm">
            3<span className="badge__sr"> unread notifications</span>
          </Badge>
          <Badge variant="info" appearance="solid" size="sm">
            128<span className="badge__sr"> messages</span>
          </Badge>
          <Badge variant="neutral" appearance="outline" size="sm">
            99+<span className="badge__sr"> items</span>
          </Badge>
          <span className="demo__badge-cell">
            <Badge variant="warning" dot>
              A very long label that must truncate instead of breaking the layout
            </Badge>
          </span>
          <Badge variant="success" dot dir="rtl" lang="ar">
            مكتمل
          </Badge>
        </div>
      </section>
    </main>
  );
}
