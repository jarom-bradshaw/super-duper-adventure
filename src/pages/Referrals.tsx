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
  {
    name: 'Tyler Skalka',
    title: 'Business System Analyst',
    company: 'the Boise Centre',
    relationship: 'November 5, 2025, Tyler managed Jarom directly',
    text: "I had the pleasure of working with Jarom while serving as his project manager, and I was genuinely impressed by how quickly he was able to make an impact and provide value. He has a keen eye for identifying system improvements and applies strong OOP principles to build scalable, efficient solutions. Jarom is a quick learner who picks up new concepts with ease, works confidently with REST APIs, and consistently delivers high-quality work. He'd be a fantastic addition to any development team!",
  },
  {
    name: 'Hunter Bird',
    title: 'Computer Science Student | Teacher\'s Assistant | Graduate Applicant',
    company: 'BYU-I',
    relationship: 'November 5, 2025, Hunter and Jarom studied together',
    text: "Having worked with Jarom on the 2025 BYU-I Hackathon as well as being a fellow student. He was able to bring multiple employers to our Hackathon's networking and judging event which contributed to the overall success of the event. He displayed a strong understanding of Javascript and Datastructures through his projects and in the classes that I have assisted in as a Teacher's Assistant.",
  },
];

const Referrals = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Referrals</h1>
            <p className="text-[color:var(--gray-300)] text-lg">
              Recommendations and references from colleagues and mentors
            </p>
            <p className="text-[color:var(--gray-400)] text-sm mt-2">
              Referrals available upon request
            </p>
          </div>

          {referrals.length === 0 ? (
            <Section>
              <div className="glass-card rounded-lg p-8 text-center">
                <p className="text-[color:var(--gray-300)] text-lg mb-4">
                  Referrals will be displayed here once added.
                </p>
                <p className="text-[color:var(--gray-400)] text-sm">
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
                    <p className="text-[color:var(--gray-400)] mb-1">
                      {referral.title} at {referral.company}
                    </p>
                    <p className="text-[color:var(--gray-500)] text-sm">{referral.relationship}</p>
                  </div>
                  <blockquote className="text-[color:var(--gray-300)] italic mb-4 border-l-4 border-[color:var(--link)] pl-4">
                    "{referral.text}"
                  </blockquote>
                  {referral.contact && (
                    <p className="text-sm text-[color:var(--gray-400)]">
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

