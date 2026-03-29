import React, { useState, useEffect } from "react";
import "./AdminAdoptionRequests.css";
import { getAdoptionPetListings } from "../services/AdminPetListingService";

interface AdoptionRequest {
  id: string;
  petId: number;
  petName: string;
  adopterName: string;
  email: string;
  contactNumber: string;
  address: string;
  livingSituation: string;
  hasOtherPets: string;
  experienceWithPets: string;
  status: "Pending" | "Approved" | "Rejected";
  submissionDate: string;
}

const AdminAdoptionRequests: React.FC = () => {
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  useEffect(() => {
  const fetchSubmissions = async () => {
    try {
      const data = await getAdoptionPetListings();

      const transformedPets: AdoptionRequest[] = data.map((item: any) => ({
        id: item.id.toString(),
        petId: item.petId,
        petName: item.petName,
        adopterName: item.name,
        email: item.email,
        contactNumber: item.contactNumber,
        address: item.address,
        livingSituation: item.livingSituation,
        hasOtherPets: item.hasOtherPets,
        experienceWithPets: item.experienceWithPets,
        status: item.reviewStatus as "Pending" | "Approved" | "Rejected",
        submissionDate: item.submissionDate || "",
      }));

      setAdoptionRequests(transformedPets); 
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
    }
  };

  fetchSubmissions(); 
}, []);


  // Open details modal
  const openDetailsModal = (request: AdoptionRequest) => {
    setSelectedRequest(request);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = adoptionRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(adoptionRequests.length / requestsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="admin-adoption-requests">
      <h2>Adoption Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Adopter Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.petName}</td>
              <td>{request.adopterName}</td>
              <td>{request.email}</td>
              <td>{request.contactNumber}</td>
              <td>
                <span className={`status ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </td>
              <td>
                <button
                  className="details-btn"
                  onClick={() => openDetailsModal(request)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {renderPagination()}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adoption Request Details</h2>
            <div className="details-section">
              <h3>Adopter Information</h3>
              <p><strong>Name:</strong> {selectedRequest.adopterName}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Contact Number:</strong> {selectedRequest.contactNumber}</p>
              <p><strong>Address:</strong> {selectedRequest.address}</p>
            </div>
            <div className="details-section">
              <h3>Living Situation</h3>
              <p><strong>Living Situation:</strong> {selectedRequest.livingSituation}</p>
              <p><strong>Has Other Pets:</strong> {selectedRequest.hasOtherPets}</p>
            </div>
            <div className="details-section">
              <h3>Experience with Pets</h3>
              <p>{selectedRequest.experienceWithPets}</p>
            </div>
            <button onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptionRequests;