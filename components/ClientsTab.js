"use client";

import React, { useEffect, useState } from "react";
import { fetchClientsAPI } from "@/services/api";
import Loading from "@/components/Loading";

const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await fetchClientsAPI();
        setClients(clientsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-custom-dark-blue text-custom-light-gray">
        <p>Error fetching clients: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-auto w-auto">
      <h1 className="text-4xl font-primary mb-6 text-custom-yellow">
        Clients List
      </h1>
      {clients.length > 0 ? (
        <ul className="space-y-4">
          {clients.map((client) => (
            <li
              key={client.id}
              className="p-4 bg-white dark:bg-custom-dark-blue rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              <p className="text-lg text-custom-dark-blue dark:text-custom-yellow">
                {client.nombre}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">No clients found.</p>
      )}
    </div>
  );
};

export default ClientsTab;
