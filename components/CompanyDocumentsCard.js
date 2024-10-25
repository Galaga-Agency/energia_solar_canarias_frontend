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
    <div className="w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter md:mt-6 xl:mt-0">
      <h2 className="text-xl mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
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
