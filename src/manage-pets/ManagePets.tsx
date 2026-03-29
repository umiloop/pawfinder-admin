import React, { useState, useEffect } from "react";
import "./ManagePets.css";
import { getPendingPetListings, getApprovedPetListings, approvePetListing, rejectPetListing } from "../services/AdminPetListingService";

interface Pet {
  id: string;
  type: "Rehome" | "Shelter";
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: string;
  status: "Pending" | "Approved" | "Rejected" | "Removed";
  submissionDate: string; 
  details: {
    location?: string;
    reason?: string;
    description: string;
    contactNumber: string;
    shelterName?: string;
    shelterAddress?: string;
    petPhotos: string[];
  };
}

const ManagePets: React.FC = () => {
  const [pendingPets, setPendingPets] = useState<Pet[]>([]);
  const [approvedPets, setApprovedPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);
  const [submissionsPerPage] = useState(5); // Number of listings per page

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Fetch pending listings
        const pendingData = await getPendingPetListings();
        const transformedPendingPets: Pet[] = pendingData.map((item: any) => ({
          id: item.id.toString(),
          type: item.listingType === "SHELTER_PET" ? "Shelter" : "Rehome",
          petName: item.petName,
          petType: item.petType,
          breed: item.breed,
          age: `${item.age} ${item.ageUnit}`,
          gender: item.gender,
          status: item.reviewStatus as "Pending" | "Approved" | "Rejected" | "Removed",
          submissionDate: "", 
          details: {
            location: item.location,
            reason: "", 
            description: item.description,
            contactNumber: item.contactNumber,
            shelterName: item.shelterName,
            shelterAddress: item.shelterAddress,
            petPhotos: item.photoUrls,
          },
        }));
        setPendingPets(transformedPendingPets);

        // Fetch approved listings
        const approvedData = await getApprovedPetListings();
        const transformedApprovedPets: Pet[] = approvedData.map((item: any) => ({
          id: item.id.toString(),
          type: item.listingType === "SHELTER_PET" ? "Shelter" : "Rehome",
          petName: item.petName,
          petType: item.petType,
          breed: item.breed,
          age: `${item.age} ${item.ageUnit}`,
          gender: item.gender,
          status: item.reviewStatus as "Pending" | "Approved" | "Rejected" | "Removed",
          submissionDate: "", 
          details: {
            location: item.location,
            reason: "", 
            description: item.description,
            contactNumber: item.contactNumber,
            shelterName: item.shelterName,
            shelterAddress: item.shelterAddress,
            petPhotos: item.photoUrls,
          },
        }));
        setApprovedPets(transformedApprovedPets);
      } catch (error) {
        console.error("Failed to fetch pet listings", error);
      }
    };
  
    fetchSubmissions();
  }, []);

  // Handle approve action
  const handleApprove = async (id: string, listingType: string) => {
    try {
      await approvePetListing(id, listingType);
      // Remove from pending and add to approved
      const approvedPet = pendingPets.find(pet => pet.id === id);
      if (approvedPet) {
        setPendingPets(pendingPets.filter(pet => pet.id !== id));
        setApprovedPets([...approvedPets, { ...approvedPet, status: "Approved" }]);
      }
      console.log(`Pet with ID ${id} approved.`);
    } catch (error) {
      console.error(`Failed to approve pet with ID ${id}.`);
    }
  };

  // Handle reject action
  const handleReject = async (id: string, listingType: string) => {
    try {
      await rejectPetListing(id, listingType);
      setPendingPets(pendingPets.filter(pet => pet.id !== id));
      console.log(`Pet with ID ${id} rejected.`);
    } catch (error) {
      console.error(`Failed to reject pet with ID ${id}.`);
    }
  };

  // Handle remove action
  const handleRemove = (id: string) => {
    setApprovedPets(approvedPets.filter(pet => pet.id !== id));
    // Add API call to remove the listing on the backend
    console.log(`Pet with ID ${id} removed.`);
  };

  // Open details modal
  const openDetailsModal = (pet: Pet) => {
    setSelectedPet(pet);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedPet(null);
  };

  // Pagination logic for pending listings
  const indexOfLastPending = currentPendingPage * submissionsPerPage;
  const indexOfFirstPending = indexOfLastPending - submissionsPerPage;
  const currentPendingListings = pendingPets.slice(
    indexOfFirstPending,
    indexOfLastPending
  );

  // Pagination logic for approved listings
  const indexOfLastApproved = currentApprovedPage * submissionsPerPage;
  const indexOfFirstApproved = indexOfLastApproved - submissionsPerPage;
  const currentApprovedListings = approvedPets.slice(
    indexOfFirstApproved,
    indexOfLastApproved
  );

  // Render pagination controls
  const renderPagination = (
    totalItems: number,
    currentPage: number,
    setPage: (page: number) => void
  ) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / submissionsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="manage-pets">
      <h2>Manage Pet Listings</h2>

      {/* Pending Listings Table */}
      <h3>Pending Listings</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Pet Name</th>
            <th>Pet Type</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPendingListings.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.type}</td>
              <td>{pet.petName}</td>
              <td>{pet.petType}</td>
              <td>{pet.breed}</td>
              <td>{pet.age}</td>
              <td>{pet.gender}</td>
              <td>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(pet.id, pet.type)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(pet.id, pet.type)}
                >
                  Reject
                </button>
                <button
                  className="details-btn"
                  onClick={() => openDetailsModal(pet)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(pendingPets.length, currentPendingPage, setCurrentPendingPage)}

      {/* Approved Listings Table */}
      <h3>Approved Listings</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Pet Name</th>
            <th>Pet Type</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentApprovedListings.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.type}</td>
              <td>{pet.petName}</td>
              <td>{pet.petType}</td>
              <td>{pet.breed}</td>
              <td>{pet.age}</td>
              <td>{pet.gender}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(pet.id)}
                >
                  Remove
                </button>
                <button
                  className="details-btn"
                  onClick={() => openDetailsModal(pet)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(approvedPets.length, currentApprovedPage, setCurrentApprovedPage)}

      {/* View Details Modal */}
      {selectedPet && (
        <div className="modal">
          <div className="modal-content">
            <h2>Submission Details</h2>

            {/* Pet Information */}
            <div className="details-section">
              <h3>Pet Information</h3>
              <p><strong>Name:</strong> {selectedPet.petName}</p>
              <p><strong>Type:</strong> {selectedPet.petType}</p>
              <p><strong>Breed:</strong> {selectedPet.breed}</p>
              <p><strong>Age:</strong> {selectedPet.age}</p>
              <p><strong>Gender:</strong> {selectedPet.gender}</p>
            </div>

            {/* Form-Specific Details */}
            <div className="details-section">
              <h3>{selectedPet.type === "Rehome" ? "Rehoming Details" : "Shelter Details"}</h3>
              {selectedPet.type === "Rehome" ? (
                <>
                  <p><strong>Location:</strong> {selectedPet.details.location}</p>
                  <p><strong>Reason for Rehoming:</strong> {selectedPet.details.reason}</p>
                </>
              ) : (
                <>
                  <p><strong>Shelter Name:</strong> {selectedPet.details.shelterName}</p>
                  <p><strong>Shelter Address:</strong> {selectedPet.details.shelterAddress}</p>
                </>
              )}
            </div>

            {/* Contact Information */}
            <div className="details-section">
              <h3>Contact Information</h3>
              <p><strong>Contact Number:</strong> {selectedPet.details.contactNumber}</p>
            </div>

            {/* Description */}
            <div className="details-section">
              <h3>Description</h3>
              <p>{selectedPet.details.description}</p>
            </div>

            {/* Pet Photos */}
            <div className="details-section">
              <h3>Pet Photos</h3>
              <div className="pet-photos">
                {selectedPet.details.petPhotos.map((photo: string, index: number) => (
                  <img key={index} src={photo} alt={`Pet Photo ${index + 1}`} className="pet-photo" />
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePets;