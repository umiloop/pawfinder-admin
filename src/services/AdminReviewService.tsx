import axios from 'axios';

const API_URL = "http://localhost:8080/api/admin";

export interface StrayAnimalReport {
  id: number;
  animalType: string;
  injured: boolean;
  stray: boolean;
  malnourished: boolean;
  description: string;
  animalStatus: string;
  actionRequired: string;
  locationText: string;
  city: string;
  postalCode: string;
  locationDetails: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  userId: number;
  username: string;
  reviewStatus: string;
  photoUrls: string[];
  createdAt: string;
}

export interface MissingPetReport {
  id: number;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  ageUnit: string;
  gender: string;
  description: string;
  location_coordinates: string;
  location_address: string;
  location_city: string;
  location_details: string;
  userId: number;
  username: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  contactPreference: string;
  offerReward: boolean;
  rewardAmount: number;
  reviewStatus: string;
  photoURLs: string[];
}

// Get all pending stray animal reports
export const getPendingStrayAnimalReports = async (): Promise<StrayAnimalReport[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports/stray-animals/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending stray animal reports:", error);
    throw error;
  }
};

export const getApprovedStrayAnimalReports = async (): Promise<StrayAnimalReport[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports/stray-animals/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved stray animal reports:", error);
    throw error;
  }
};

// Get all pending missing pet reports
export const getPendingMissingPetReports = async (): Promise<MissingPetReport[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports/missing-pets/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending missing pet reports:", error);
    throw error;
  }
};

export const getApprovedMissingPetReports = async (): Promise<MissingPetReport[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports/missing-pets/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved missing pet reports:", error);
    throw error;
  }
};

// Approve a stray animal report
export const approveStrayAnimalReport = async (id: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}/reports/stray-animals/${id}/approve`);
  } catch (error) {
    console.error("Error approving stray animal report:", error);
    throw error;
  }
};

// Approve a missing pet report
export const approveMissingPetReport = async (id: number): Promise<void> => {
  try {
    await axios.post(`${API_URL}/reports/missing-pets/${id}/approve`);
  } catch (error) {
    console.error("Error approving missing pet report:", error);
    throw error;
  }
};

// Reject a stray animal report
export const rejectStrayAnimalReport = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/reports/stray-animals/${id}`);
  } catch (error) {
    console.error("Error rejecting stray animal report:", error);
    throw error;
  }
};

// Reject a missing pet report
export const rejectMissingPetReport = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/reports/missing-pets/${id}`);
  } catch (error) {
    console.error("Error rejecting missing pet report:", error);
    throw error;
  }
}; 