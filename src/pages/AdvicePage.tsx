import { Link, useParams } from 'react-router-dom';
import { ADVICE_TOPICS, getTopic } from './advice/topics';

function Disclaimer() {
  return (
    <p className="disclaimer">
      General preparedness information for planning — not a substitute for
      emergency-service instructions. In immediate danger call <strong>999</strong>.
      Sources include UK Be Ready and British Red Cross public guidance; tailor
      actions to your household.
    </p>
  );
}

export function AdviceIndexPage() {
  return (
    <article className="prose panel">
      <h1>Advice</h1>
      <Disclaimer />
      <p>
        Short guides for common disruption scenarios. Cross-check your{' '}
        <Link to="/">supplies list</Link> against the related categories, and see{' '}
        <Link to="/help">Help</Link> for how scaling and preseed work.
      </p>
      <div className="topic-grid">
        {ADVICE_TOPICS.map((t) => (
          <Link key={t.slug} className="topic-card" to={`/advice/${t.slug}`}>
            <h3>{t.title}</h3>
            <p>{t.summary}</p>
          </Link>
        ))}
      </div>
      <p className="muted">
        Further reading:{' '}
        <a
          href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
          target="_blank"
          rel="noreferrer"
        >
          Be Ready
        </a>
        {' · '}
        <a
          href="https://www.redcross.org.uk/get-help/prepare-for-emergencies/prepare-an-emergency-kit"
          target="_blank"
          rel="noreferrer"
        >
          British Red Cross emergency kit
        </a>
      </p>
    </article>
  );
}

export function AdviceTopicPage() {
  const { slug } = useParams();
  const topic = slug ? getTopic(slug) : undefined;

  if (!topic) {
    return (
      <article className="prose panel">
        <h1>Topic not found</h1>
        <p>
          <Link to="/advice">Back to advice index</Link>
        </p>
      </article>
    );
  }

  return (
    <article className="prose panel">
      <p className="muted">
        <Link to="/advice">Advice</Link> / {topic.title}
      </p>
      <h1>{topic.title}</h1>
      <Disclaimer />
      <p>{topic.summary}</p>
      <p>
        <strong>Related inventory categories:</strong>{' '}
        {topic.relatedCategories.join(', ')}
      </p>
      {topic.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <p style={{ marginTop: '2rem' }}>
        <Link to="/advice">← All advice topics</Link>
        {' · '}
        <Link to="/">Supplies</Link>
      </p>
    </article>
  );
}
