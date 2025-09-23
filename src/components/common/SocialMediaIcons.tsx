import { SOCIAL_MEDIA_LINKS } from "@/utils/consts";

const SocialMediaIcons = () => {
  return (
    <div className="flex items-center space-x-3 -ml-14">
      {SOCIAL_MEDIA_LINKS.map((social) => (
        <div
          key={social.name}
          className="transition-all duration-100 rounded-sm hover:scale-102 hover:shadow-sm shadow-primary hover:border-1 p-0.5 hover:border-primary"
        >
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-primary"
          >
            <img
              src={social.icon}
              alt={social.name}
              className="w-full h-full bg-transparent"
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
