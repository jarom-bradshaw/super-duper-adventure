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
    name: 'Garrett Saunders',
    title: 'Statistics Professor',
    company: 'BYU-Idaho',
    relationship: 'November 12, 2025, Garrett was Jarom\'s teacher',
    text: 'Jarom is a deep thinker, hard worker, and creative problem solver. He is extremely talented. Most students fluff up their resumes to look great. Jarom has to water his down so that it is fits on a page. He just has that much experience already. He was my student for Applied Linear Regression (Math 425) at BYU-Idaho, an advanced undergraduate course that covers predictive data modeling using R. I authorized him to skip the pre-requisite course and he still was top 20% in the class. He asks excellent questions, works well independently, and is a strong team player that gets along easily with others and has high integrity.',
  },
  {
    name: 'Shi-Jia Wang',
    title: 'Software Engineer | Web Developer | Computer Science | React.js | Python | Java | JavaScript | Next.js | HTML | Tailwind CSS',
    company: 'BYUI Support Center',
    relationship: 'November 10, 2025, Shi-Jia worked with Jarom on the same team',
    text: "It's such a pleasure working with Jarom in the BYUI Support Center! My favorite part of working with Jarom is his desire to help others and his outgoing, warm personality. I can confidently say that he brought both technical expertise and a positive view to every challenge. In the Business Solution Team for the BSC at BYU-I, there is a variety of issues waiting for us to solve across 18 different offices, and he works with multiple of them. I've seen him break the technical complexity of convoluted problems that include multiple systems into simple steps that can be easily explained to non-technical personnel and used to quickly and correctly solve problems. During this, he's shown outstanding thinking and coding skills in Java and JavaScript. I'd highly recommend anyone to take him on to their team.",
  },
  {
    name: 'Felipe Dos Santos',
    title: 'Lead Software Developer',
    company: 'BYUI Support Center',
    relationship: 'November 7, 2025, Felipe managed Jarom directly',
    text: "I've had the pleasure of managing Jarom on our software development team, and he's been an outstanding contributor. He's highly skilled in Java Spring Boot, full-stack development, and JavaScript, consistently delivering clean, efficient, and reliable code. Beyond his technical ability, Jarom is a fantastic teammate—collaborative, dependable, and always willing to help others. His positive attitude and professionalism make him a true asset to any team.",
  },
  {
    name: 'Ashish Jain',
    title: 'System Developer',
    company: 'Business Solutions BYU-Idaho',
    relationship: 'November 6, 2025, Ashish worked with Jarom on the same team',
    text: 'His gift in math and stats helps him to be very analytically minded and solve problems related to data (Python, PowerBI) and full-stack development with a focus on what the client wants first. Beyond that, he is a pleasure to work with, is fun, and is the type of person I would hang out with outside of work. He is not only gifted with the knowledge of technology; he is also a people person.',
  },
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
            <p className="text-gray-300 text-lg">
              Recommendations and references from colleagues and mentors
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Referrals available upon request
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

