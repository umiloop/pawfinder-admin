import React, { useState, useEffect } from "react";
import { MissingPetReport, getPendingMissingPetReports, getApprovedMissingPetReports, approveMissingPetReport, rejectMissingPetReport } from "../services/AdminReviewService";
import "./ManageLostReports.css";

const ManageLostReports: React.FC = () => {
  const [pendingReports, setPendingReports] = useState<MissingPetReport[]>([]);
  const [approvedReports, setApprovedReports] = useState<MissingPetReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MissingPetReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);
  const [reportsPerPage] = useState(5);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch pending reports
      const pendingData = await getPendingMissingPetReports();
      setPendingReports(pendingData);

      // Fetch approved reports
      const approvedData = await getApprovedMissingPetReports();
      setApprovedReports(approvedData);

      setError(null);
    } catch (err) {
      setError("Failed to fetch reports. Please try again later.");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve a report
  const handleApprove = async (id: number) => {
    try {
      await approveMissingPetReport(id);
      // Remove from pending and add to approved
      const approvedReport = pendingReports.find(report => report.id === id);
      if (approvedReport) {
        setPendingReports(pendingReports.filter(report => report.id !== id));
        setApprovedReports([...approvedReports, { ...approvedReport, reviewStatus: "Approved" }]);
      }
    } catch (err) {
      setError("Failed to approve report. Please try again.");
      console.error("Error approving report:", err);
    }
  };

  // Reject a report
  const handleReject = async (id: number) => {
    try {
      await rejectMissingPetReport(id);
      setPendingReports(pendingReports.filter(report => report.id !== id));
    } catch (err) {
      setError("Failed to reject report. Please try again.");
      console.error("Error rejecting report:", err);
    }
  };

  // View report details
  const handleViewDetails = (report: MissingPetReport) => {
    setSelectedReport(report);
  };

  // Close the details modal
  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  // Pagination logic for pending reports
  const indexOfLastPending = currentPendingPage * reportsPerPage;
  const indexOfFirstPending = indexOfLastPending - reportsPerPage;
  const currentPendingReports = pendingReports.slice(
    indexOfFirstPending,
    indexOfLastPending
  );

  // Pagination logic for approved reports
  const indexOfLastApproved = currentApprovedPage * reportsPerPage;
  const indexOfFirstApproved = indexOfLastApproved - reportsPerPage;
  const currentApprovedReports = approvedReports.slice(
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
    for (let i = 1; i <= Math.ceil(totalItems / reportsPerPage); i++) {
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

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="manage-lost-reports">
      <h2>Missing Pet Reports</h2>

      {/* Pending Reports Table */}
      <h3>Pending Reports</h3>
      {pendingReports.length === 0 ? (
        <p className="no-reports">No pending reports found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPendingReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.petName}</td>
                  <td>{report.petType}</td>
                  <td>{report.location_city}</td>
                  <td>
                    <span className={`status ${report.reviewStatus.toLowerCase()}`}>
                      {report.reviewStatus}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(report)}
                      >
                        View
                      </button>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(report.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(report.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(pendingReports.length, currentPendingPage, setCurrentPendingPage)}
        </>
      )}

      {/* Approved Reports Table */}
      <h3>Approved Reports</h3>
      {approvedReports.length === 0 ? (
        <p className="no-reports">No approved reports found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentApprovedReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.petName}</td>
                  <td>{report.petType}</td>
                  <td>{report.location_city}</td>
                  <td>
                    <span className={`status ${report.reviewStatus.toLowerCase()}`}>
                      {report.reviewStatus}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(report)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(approvedReports.length, currentApprovedPage, setCurrentApprovedPage)}
        </>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal">
          <div className="modal-content">
            <h2>Report Details</h2>

            {/* Photos */}
            {selectedReport.photoURLs && selectedReport.photoURLs.length > 0 && (
              <div className="details-section">
                <h3>Photos</h3>
                <div className="photos">
                  {selectedReport.photoURLs.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Report Photo ${index + 1}`}
                      className="photo"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pet Details */}
            <div className="details-section">
              <h3>Pet Information</h3>
              <p><strong>Name:</strong> {selectedReport.petName}</p>
              <p><strong>Type:</strong> {selectedReport.petType}</p>
              <p><strong>Breed:</strong> {selectedReport.breed}</p>
              <p><strong>Age:</strong> {selectedReport.age} {selectedReport.ageUnit}</p>
              <p><strong>Gender:</strong> {selectedReport.gender}</p>
              <p><strong>Description:</strong> {selectedReport.description}</p>
            </div>

            {/* Location */}
            <div className="details-section">
              <h3>Location</h3>
              <p><strong>Address:</strong> {selectedReport.location_address}</p>
              <p><strong>City:</strong> {selectedReport.location_city}</p>
              <p><strong>Details:</strong> {selectedReport.location_details}</p>
            </div>

            {/* Owner Information */}
            <div className="details-section">
              <h3>Owner Information</h3>
              <p><strong>Name:</strong> {selectedReport.ownerName}</p>
              <p><strong>Phone:</strong> {selectedReport.phoneNumber}</p>
              <p><strong>Email:</strong> {selectedReport.email}</p>
              <p><strong>Preferred Contact:</strong> {selectedReport.contactPreference}</p>
            </div>

            {/* Reward Information */}
            <div className="details-section">
              <h3>Reward</h3>
              <p>
                <strong>Reward Offered:</strong>{" "}
                {selectedReport.offerReward ? "Yes" : "No"}
              </p>
              {selectedReport.offerReward && (
                <p><strong>Amount:</strong> ${selectedReport.rewardAmount}</p>
              )}
            </div>

            <button className="close-btn" onClick={handleCloseDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLostReports;