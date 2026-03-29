import React, { useState, useEffect } from "react";
import { StrayAnimalReport, getPendingStrayAnimalReports, getApprovedStrayAnimalReports, approveStrayAnimalReport, rejectStrayAnimalReport } from "../services/AdminReviewService";
import "./ReportedStrayAnimals.css";

const ReportedStrayAnimals: React.FC = () => {
  const [pendingReports, setPendingReports] = useState<StrayAnimalReport[]>([]);
  const [approvedReports, setApprovedReports] = useState<StrayAnimalReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<StrayAnimalReport | null>(null);
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
      const pendingData = await getPendingStrayAnimalReports();
      setPendingReports(pendingData);

      // Fetch approved reports
      const approvedData = await getApprovedStrayAnimalReports();
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
      await approveStrayAnimalReport(id);
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
      await rejectStrayAnimalReport(id);
      setPendingReports(pendingReports.filter(report => report.id !== id));
    } catch (err) {
      setError("Failed to reject report. Please try again.");
      console.error("Error rejecting report:", err);
    }
  };

  // Open details modal
  const openDetailsModal = (report: StrayAnimalReport) => {
    setSelectedReport(report);
  };

  // Close details modal
  const closeDetailsModal = () => {
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
    <div className="reported-strays">
      <h2>Reported Stray Animals</h2>

      {/* Pending Reports Table */}
      <h3>Pending Reports</h3>
      {pendingReports.length === 0 ? (
        <p className="no-reports">No pending reports found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Animal Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPendingReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.locationText}, {report.city}</td>
                  <td>{report.animalType}</td>
                  <td>
                    <span className={`status ${report.reviewStatus.toLowerCase()}`}>
                      {report.reviewStatus}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="details-btn"
                        onClick={() => openDetailsModal(report)}
                      >
                        View Details
                      </button>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(report.id)}
                      >
                        Resolve
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
      <h3>Resolved Reports</h3>
      {approvedReports.length === 0 ? (
        <p className="no-reports">No approved reports found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Animal Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentApprovedReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.locationText}, {report.city}</td>
                  <td>{report.animalType}</td>
                  <td>
                    <span className={`status ${report.reviewStatus.toLowerCase()}`}>
                      {report.reviewStatus === 'Approved' ? 'Resolved' : report.reviewStatus}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="details-btn"
                        onClick={() => openDetailsModal(report)}
                      >
                        View Details
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

      {/* Details Modal */}
      {selectedReport && (
        <div className="modal">
          <div className="modal-content">
            <h2>Report Details</h2>

            {/* Photos */}
            {selectedReport.photoUrls && selectedReport.photoUrls.length > 0 && (
              <div className="details-section">
                <h3>Photos</h3>
                <div className="photos">
                  {selectedReport.photoUrls.map((photo, index) => (
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

            {/* Location */}
            <div className="details-section">
              <h3>Location</h3>
              <p>{selectedReport.locationText}</p>
              <p>{selectedReport.city}, {selectedReport.postalCode}</p>
              <p>{selectedReport.locationDetails}</p>
            </div>

            {/* Animal Details */}
            <div className="details-section">
              <h3>Animal Details</h3>
              <p><strong>Type:</strong> {selectedReport.animalType}</p>
              <p><strong>Condition:</strong> {selectedReport.injured ? "Injured, " : ""}
                {selectedReport.stray ? "Stray, " : ""}
                {selectedReport.malnourished ? "Malnourished" : ""}
              </p>
              <p><strong>Status:</strong> {selectedReport.animalStatus}</p>
              <p><strong>Action Required:</strong> {selectedReport.actionRequired}</p>
            </div>

            {/* Description */}
            <div className="details-section">
              <h3>Description</h3>
              <p>{selectedReport.description}</p>
            </div>

            {/* Contact Information */}
            <div className="details-section">
              <h3>Contact Information</h3>
              <p><strong>Name:</strong> {selectedReport.contactName}</p>
              <p><strong>Phone:</strong> {selectedReport.contactPhone}</p>
              <p><strong>Email:</strong> {selectedReport.contactEmail}</p>
            </div>

            <button className="close-btn" onClick={closeDetailsModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedStrayAnimals;