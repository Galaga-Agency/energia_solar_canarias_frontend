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
    <div className="bg-white/30 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm backdrop-blur-sm backdrop-filter">
      <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
        {t("companyDocuments")}
      </h2>
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
            <p className="text-gray-600 dark:text-gray-400">
              {doc.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyDocumentsCard;
