import { useTranslation } from "next-i18next";

const CompanyDocumentsCard = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl  mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
        {t("companyDocuments")}
      </h2>
      <ul className="space-y-3">
        {["cookiesPolicy", "privacyPolicy", "legalNotice"].map((doc) => (
          <li key={doc}>
            <a
              href={`https://www.energiasolarcanarias.es/${doc.toLowerCase()}`}
              className="text-custom-dark-blue dark:text-custom-yellow hover:opacity-80 transition-opacity font-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(doc)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyDocumentsCard;
