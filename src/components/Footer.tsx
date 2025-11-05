const Footer = () => {
  return (
    <footer className="glass-card mt-auto py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-[color:var(--muted-foreground)]">© 2025 Jarom Bradshaw</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="mailto:jarombrads@gmail.com"
              className="text-[color:var(--link)] hover:text-[color:var(--accent)] transition-colors"
            >
              Email
            </a>
            <span className="text-[color:var(--muted-foreground)]/70">|</span>
            <a
              href="https://www.linkedin.com/in/jarom-bradshaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--link)] hover:text-[color:var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-[color:var(--muted-foreground)]/70">|</span>
            <a
              href="https://github.com/jarom-bradshaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--link)] hover:text-[color:var(--accent)] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[color:var(--muted-foreground)]/70">|</span>
            <span className="text-[color:var(--muted-foreground)]">859-420-4178</span>
            <span className="text-[color:var(--muted-foreground)]/70">|</span>
            <span className="text-[color:var(--muted-foreground)]/80">
              Star animation by{' '}
              <a
                href="https://github.com/alphardex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
              >
                alphardex
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

