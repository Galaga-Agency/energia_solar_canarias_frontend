import { useTranslation } from "next-i18next";
import { FaExternalLinkAlt } from "react-icons/fa";

const CompanyDocumentsCard = () => {
  const { t } = useTranslation();

  const documents = [
    {
      key: "cookiesPolicy",
      url: "https://www.energiasolarcanarias.es/politica-de-cookies",
      description: t("cookiesPolicyDescription"),
    },
    {
      key: "privacyPolicy",
      url: "https://www.energiasolarcanarias.es/politica-de-privacidad",
      description: t("privacyPolicyDescription"),
    },
    {
      key: "legalNotice",
      url: "https://www.energiasolarcanarias.es/aviso-legal",
      description: t("legalNoticeDescription"),
    },
  ];

  return (
    <ul className="flex flex-col h-full">
      {documents.map((doc) => (
        <li key={doc.key} className="mb-8 last:mb-0">
          <a
            href={doc.url}
            className="text-custom-dark-blue dark:text-custom-light-gray underline underline-offset-2 hover:opacity-80 transition-opacity font-secondary inline-flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(doc.key)}
            <FaExternalLinkAlt className="w-3 h-3 opacity-80" />
          </a>
          <p className="text-gray-600 dark:text-gray-400 mt-1.5">
            {doc.description}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default CompanyDocumentsCard;
