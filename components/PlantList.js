import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectPlants,
  selectLoading,
  selectError,
} from "@/store/slices/plantsSlice";
import FilterInput from "@/components/FilterInput";
import SortMenu from "@/components/SortMenu";
import Pagination from "@/components/Pagination";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import { useTranslation } from "next-i18next";
import PlantCard from "@/components/PlantCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import { FaMapMarkedAlt } from "react-icons/fa";
import useGeocode from "@/hooks/useGeocode";
import { selectUser } from "@/store/slices/userSlice";

const PlantList = ({ onClose, isOpen, openMap, userId, tab }) => {
  const { t } = useTranslation();
  const plants = useSelector(selectPlants);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 6;

  const { filteredItems: filteredPlants, filterItems } = useFilter(
    plants,
    "name"
  );
  const { sortedItems: sortedPlants, sortItems } = useSort(filteredPlants);

  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  if (loading) {
    return (
      <p className="text-center text-lg text-custom-yellow">
        {t("loadingPlants")}
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="py-10 lg:py-4 space-y-6">
      <FilterInput onFilterChange={filterItems} />
      <div className="flex gap-4 justify-start">
        <SortMenu onSortChange={sortItems} />
        <button
          onClick={openMap}
          className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex-shrink-0 button-shadow"
        >
          <FaMapMarkedAlt className="text-2xl" />
        </button>
      </div>

      {paginatedPlants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                userId={userId}
                tab={tab}
              />
            ))}
          </div>

          <PlantsMapModal
            isOpen={isOpen}
            onClose={onClose}
            plants={sortedPlants}
          />

          {sortedPlants.length > plantsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p className="text-center text-lg text-custom-dark-gray">
          {t("noPlantsFound")}
        </p>
      )}
    </div>
  );
};

export default PlantList;
