import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [designs, setDesigns] = useState([]);
  const [design, setDesign] = useState(null);
  const [userDesigns, setUserDesigns] = useState([]);
  const [aiDesigns, setAiDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get all designs
  const getDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/designs');
      
      setDesigns(res.data.data);
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to load designs');
      return [];
    }
  };
  
  // Get single design
  const getDesign = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/designs/${id}`);
      
      setDesign(res.data.data);
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to load design');
      return null;
    }
  };
  
  // Create design
  const createDesign = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/designs', formData);
      
      setDesigns([res.data.data, ...designs]);
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to create design');
      return null;
    }
  };
  
  // Update design
  const updateDesign = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/designs/${id}`, formData);
      
      // Update designs state
      setDesigns(
        designs.map(design =>
          design._id === id ? res.data.data : design
        )
      );
      
      // Update current design if viewing
      if (design && design._id === id) {
        setDesign(res.data.data);
      }
      
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to update design');
      return null;
    }
  };
  
  // Delete design
  const deleteDesign = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`/api/designs/${id}`);
      
      // Remove from designs state
      setDesigns(designs.filter(design => design._id !== id));
      
      setLoading(false);
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to delete design');
      return false;
    }
  };
  
  // Get user designs
  const getUserDesigns = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/designs/user/${userId}`);
      
      setUserDesigns(res.data.data);
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to load user designs');
      return [];
    }
  };
  
  // Get AI-generated designs
  const getAiDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/designs/ai/generated');
      
      setAiDesigns(res.data.data);
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to load AI designs');
      return [];
    }
  };
  
  // Generate AI design
  const generateAiDesign = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/ai/generate', formData);
      
      // Add to designs and AI designs states
      setDesigns([res.data.data, ...designs]);
      setAiDesigns([res.data.data, ...aiDesigns]);
      
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to generate AI design');
      return null;
    }
  };
  
  // Process evaluations
  const processEvaluations = async (designId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`/api/ai/evaluations/${designId}`);
      
      // Add to designs and AI designs states
      setDesigns([res.data.data, ...designs]);
      setAiDesigns([res.data.data, ...aiDesigns]);
      
      setLoading(false);
      
      return res.data.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to process evaluations');
      return null;
    }
  };
  
  // Clear current design
  const clearDesign = () => {
    setDesign(null);
  };
  
  return (
    <DesignContext.Provider
      value={{
        designs,
        design,
        userDesigns,
        aiDesigns,
        loading,
        error,
        getDesigns,
        getDesign,
        createDesign,
        updateDesign,
        deleteDesign,
        getUserDesigns,
        getAiDesigns,
        generateAiDesign,
        processEvaluations,
        clearDesign
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export default DesignContext;
