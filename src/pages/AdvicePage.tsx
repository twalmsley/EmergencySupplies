import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { slugId } from '../data/defaults';
import { isProfileActive } from '../utils';
import {
  ADVICE_TOPICS,
  getTopic,
  topicMatchesProfile,
  type AdviceTopic,
} from './advice/topics';

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

function TopicCard({ topic, highlighted }: { topic: AdviceTopic; highlighted?: boolean }) {
  return (
    <Link
      className={`topic-card ${highlighted ? 'topic-card-highlight' : ''}`}
      to={`/advice/${topic.slug}`}
    >
      <h3>{topic.title}</h3>
      <p>{topic.summary}</p>
      {highlighted && <span className="badge ok">Suggested for your household</span>}
    </Link>
  );
}

export function AdviceIndexPage() {
  const { state } = useApp();
  const profileOn = isProfileActive(state.settings.profile);
  const [onlySuggested, setOnlySuggested] = useState(false);

  const topics = useMemo(() => {
    if (!profileOn || !onlySuggested) return ADVICE_TOPICS;
    return ADVICE_TOPICS.filter((t) =>
      topicMatchesProfile(t, state.settings.profile),
    );
  }, [onlySuggested, profileOn, state.settings.profile]);

  return (
    <article className="prose panel">
      <h1>Advice</h1>
      <Disclaimer />
      <p>
        Short guides for common disruption scenarios. Cross-check your{' '}
        <Link to="/">supplies list</Link> against the related categories, and see{' '}
        <Link to="/help">Help</Link> for how scaling and preseed work.
      </p>
      {profileOn && (
        <label className="check" style={{ marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={onlySuggested}
            onChange={(e) => setOnlySuggested(e.target.checked)}
          />
          Show topics suggested for my household profile only
        </label>
      )}
      <div className="topic-grid">
        {topics.map((t) => (
          <TopicCard
            key={t.slug}
            topic={t}
            highlighted={
              profileOn && topicMatchesProfile(t, state.settings.profile)
            }
          />
        ))}
      </div>
      {topics.length === 0 && (
        <p className="muted">No topics match the current profile filter.</p>
      )}
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
  const { addScenarioSeed } = useApp();

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

  const related = topic.relatedCategories.map((name) => ({
    name,
    id: slugId(name),
  }));

  return (
    <article className="prose panel">
      <p className="muted">
        <Link to="/advice">Advice</Link> / {topic.title}
      </p>
      <h1>{topic.title}</h1>
      <Disclaimer />
      <p>{topic.summary}</p>
      <p>
        <strong>Related inventory:</strong>{' '}
        {related.map((r, i) => (
          <span key={r.id}>
            {i > 0 ? ', ' : ''}
            <Link to={`/?category=${r.id}&filter=understocked`}>{r.name}</Link>
          </span>
        ))}
      </p>
      <p className="no-print">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            const n = addScenarioSeed(topic.relatedCategories);
            alert(
              n > 0
                ? `Added ${n} missing essential${n === 1 ? '' : 's'} for this scenario.`
                : 'Your list already includes the seeded essentials for these categories.',
            );
          }}
        >
          Add missing essentials for this scenario
        </button>{' '}
        <Link className="btn" to="/?filter=understocked">
          View understocked supplies
        </Link>
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
