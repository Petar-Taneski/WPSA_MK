import React from "react";

const Partners: React.FC = () => {
  const partners = [
    {
      name: "World's Poultry Science Association",
      description:
        "International organization dedicated to advancing poultry science globally.",
    },
    {
      name: "European Federation of WPSA Branches",
      description: "Coordinating body for European WPSA branches.",
    },
    {
      name: "Mediterranean Poultry Network",
      description:
        "Network connecting poultry science professionals across the Mediterranean region.",
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        PARTNERS & RESOURCES
      </h2>
      <p className="text-gray-700 mb-8">
        The Macedonian Branch of the World Poultry Science Association
        collaborates with numerous national and international organizations,
        educational institutions, and industry partners to advance poultry
        science in North Macedonia and beyond. Below are some of our key
        partners and resources.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{partner.name}</h3>
            <p className="text-gray-600">{partner.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Contact Information:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Address</h4>
            <address className="not-italic text-gray-600">
              <p>Faculty of Veterinary Medicine</p>
              <p>Lazar Pop Trajkov 5-7</p>
              <p>1000 Skopje, North Macedonia</p>
            </address>
          </div>
          <div>
            <h4 className="font-medium mb-2">Contact</h4>
            <p className="text-gray-600">Email: info@wpsa-mk.org</p>
            <p className="text-gray-600">Phone: +389 2 3240 700</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
