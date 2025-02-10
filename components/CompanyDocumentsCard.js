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
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li key={doc.key}>
          <a
            href={doc.url}
            className="text-custom-dark-blue dark:text-custom-light-gray underline underline-offset-2 hover:opacity-80 transition-opacity font-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(doc.key)}
            <FaExternalLinkAlt className="inline ml-1" />
          </a>
          <p className="text-gray-600 dark:text-gray-400">{doc.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default CompanyDocumentsCard;
