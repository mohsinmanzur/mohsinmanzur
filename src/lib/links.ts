export const personalLinks = {
  linkedin: 'https://www.linkedin.com/in/mohsinmanzur/',
  github: 'https://github.com/mohsinmanzur',
  discord: 'https://discord.com/users/312555861463531530',
  email: 'mailto:mohsinmanzoor32@gmail.com',
  rawEmail: 'mohsinmanzoor32@gmail.com',
  cv: 'https://docs.google.com/document/d/1L-79IDiN0WmxvK9mUevO-3x7iNYYjU0kq4Fq3eMaC34/edit?usp=sharing',
} as const;

export const footerLinks = [
  { name: 'LinkedIn', href: personalLinks.linkedin },
  { name: 'GitHub', href: personalLinks.github },
  { name: 'Discord', href: personalLinks.discord },
  { name: 'Email', href: personalLinks.email },
  { name: 'CV', href: personalLinks.cv },
] as const;
