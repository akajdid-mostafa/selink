import Image from 'next/image';
import Link from 'next/link';
import type { SocialLink } from '@/types';
import { Button } from '@/components/ui/button';
import IconRenderer from '@/components/IconRenderer';

interface HeaderProps {
  name: string;
  bio: string;
  imageUrl: string;
  socialLinks: SocialLink[];
}

export default function Header({ name, bio, imageUrl, socialLinks }: HeaderProps) {
  return (
    <header className="flex flex-col items-center text-center mb-12 md:mb-16">
      <Image
        src={imageUrl}
        alt={name}
        width={96}
        height={96}
        className="rounded-full mb-4 shadow-lg"
        priority
        data-ai-hint="profile avatar"
      />
      <h1 className="text-3xl font-bold text-foreground mb-2">{name}</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{bio}</p>
      <div className="flex space-x-4">
        {socialLinks.map((social) => (
          <Button key={social.platform} variant="ghost" size="icon" asChild>
            <Link href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
              <IconRenderer iconName={social.iconName} className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </Button>
        ))}
      </div>
    </header>
  );
}
