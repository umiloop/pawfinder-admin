import axios from 'axios';

const API_URL = "http://localhost:8080/api/admin/pet-listings";

export const getPendingPetListings = async () => {
  try {
    const response = await axios.get(`${API_URL}/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending pet listings:", error);
    throw error;
  }
};

export const getApprovedPetListings = async () => {
  try {
    const response = await axios.get(`${API_URL}/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved pet listings:", error);
    throw error;
  }
};

// approve a pet listing
export const approvePetListing = async (id: string, listingType: string) => {
  try {
    await axios.post(`${API_URL}/${id}/approve`, null, {
      params: {
        listingType: listingType === 'Shelter' ? 'SHELTER_PET' : 'REHOME_PET'
      },
    });
    console.log(`Pet with ID ${id} approved on the backend.`);
  } catch (error) {
    console.error(`Error approving pet listing with ID ${id}:`, error);
    throw error;
  }
};

// reject pet listing
export const rejectPetListing = async (id: string, listingType: string) => {
  try {
    await axios.post(`${API_URL}/${id}/reject`, null, {
      params: {
        listingType: listingType === 'Shelter' ? 'SHELTER_PET' : 'REHOME_PET'
      },
    });
    console.log(`Pet with ID ${id} rejected on the backend.`);
  } catch (error) {
    console.error(`Error rejecting pet listing with ID ${id}:`, error);
    throw error;
  }
};

export const getAdoptionPetListings = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/admin/adoptionrequests");
    return response.data;
  } catch (error) {
    console.error("Error fetching adoption pet listings:", error);
    throw error;
  }
};