import Section from '../components/Section';

interface Referral {
  name: string;
  title: string;
  company: string;
  relationship: string;
  text: string;
  contact?: string;
}

const referrals: Referral[] = [
  // Add your referrals here
  // Example:
  // {
  //   name: 'John Doe',
  //   title: 'Senior Software Engineer',
  //   company: 'Tech Corp',
  //   relationship: 'Former Manager',
  //   text: 'Jarom is an exceptional developer who consistently delivers high-quality work...',
  //   contact: 'john.doe@techcorp.com',
  // },
];

const Referrals = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Referrals</h1>
            <p className="text-gray-300 text-lg">
              Recommendations and references from colleagues and mentors
            </p>
          </div>

          {referrals.length === 0 ? (
            <Section>
              <div className="glass-card rounded-lg p-8 text-center">
                <p className="text-gray-300 text-lg mb-4">
                  Referrals will be displayed here once added.
                </p>
                <p className="text-gray-400 text-sm">
                  To add a referral, edit the referrals array in{' '}
                  <code className="text-[color:var(--link)]">src/pages/Referrals.tsx</code>
                </p>
              </div>
            </Section>
          ) : (
            referrals.map((referral, index) => (
              <Section key={index}>
                <div className="glass-card rounded-lg p-8 mb-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                      {referral.name}
                    </h3>
                    <p className="text-gray-400 mb-1">
                      {referral.title} at {referral.company}
                    </p>
                    <p className="text-gray-500 text-sm">{referral.relationship}</p>
                  </div>
                  <blockquote className="text-gray-300 italic mb-4 border-l-4 border-[color:var(--link)] pl-4">
                    "{referral.text}"
                  </blockquote>
                  {referral.contact && (
                    <p className="text-sm text-gray-400">
                      Contact:{' '}
                      <a
                        href={`mailto:${referral.contact}`}
                        className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                      >
                        {referral.contact}
                      </a>
                    </p>
                  )}
                </div>
              </Section>
            ))
          )}
        </Section>
      </div>
    </div>
  );
};

export default Referrals;

