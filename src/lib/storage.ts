/**
 * Local storage utility functions for Idea Saver
 * Handles saving and retrieving recordings from localStorage
 */

import { AudioRecording } from '@/src/types';

/**
 * Save a recording to localStorage
 * @param userId - The user ID to associate the recording with
 * @param recording - The recording to save
 */
export function saveRecordingLocally(userId: string, recording: AudioRecording): void {
  try {
    // Get existing recordings for this user
    const recordings = loadRecordingsLocally(userId);
    
    // Add the new recording
    recordings.push(recording);
    
    // Save back to localStorage
    localStorage.setItem(`recordings_${userId}`, JSON.stringify(recordings));
  } catch (error) {
    console.error('Error saving recording to localStorage:', error);
    throw error;
  }
}

/**
 * Load all recordings for a user from localStorage
 * @param userId - The user ID to load recordings for
 * @returns Array of recordings
 */
export function loadRecordingsLocally(userId: string): AudioRecording[] {
  try {
    const recordingsJson = localStorage.getItem(`recordings_${userId}`);
    if (!recordingsJson) return [];
    
    return JSON.parse(recordingsJson);
  } catch (error) {
    console.error('Error loading recordings from localStorage:', error);
    return [];
  }
}

/**
 * Delete a recording from localStorage
 * @param userId - The user ID the recording belongs to
 * @param recordingId - The ID of the recording to delete
 */
export function deleteRecordingLocally(userId: string, recordingId: string): void {
  try {
    // Get existing recordings
    const recordings = loadRecordingsLocally(userId);
    
    // Filter out the recording to delete
    const updatedRecordings = recordings.filter(rec => rec.id !== recordingId);
    
    // Save back to localStorage
    localStorage.setItem(`recordings_${userId}`, JSON.stringify(updatedRecordings));
  } catch (error) {
    console.error('Error deleting recording from localStorage:', error);
    throw error;
  }
}

/**
 * Update a recording in localStorage
 * @param userId - The user ID the recording belongs to
 * @param recordingId - The ID of the recording to update
 * @param updates - Partial recording object with fields to update
 */
export function updateRecordingLocally(userId: string, recordingId: string, updates: Partial<AudioRecording>): void {
  try {
    // Get existing recordings
    const recordings = loadRecordingsLocally(userId);
    
    // Find and update the recording
    const updatedRecordings = recordings.map(rec => {
      if (rec.id === recordingId) {
        return { ...rec, ...updates };
      }
      return rec;
    });
    
    // Save back to localStorage
    localStorage.setItem(`recordings_${userId}`, JSON.stringify(updatedRecordings));
  } catch (error) {
    console.error('Error updating recording in localStorage:', error);
    throw error;
  }
}

/**
 * Save user settings to localStorage
 * @param userId - The user ID to associate settings with
 * @param settings - The settings object to save
 */
export function saveSettingsLocally(userId: string, settings: Record<string, any>): void {
  try {
    localStorage.setItem(`settings_${userId}`, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
    throw error;
  }
}

/**
 * Load user settings from localStorage
 * @param userId - The user ID to load settings for
 * @returns Settings object or null if not found
 */
export function loadSettingsLocally(userId: string): Record<string, any> | null {
  try {
    const settingsJson = localStorage.getItem(`settings_${userId}`);
    if (!settingsJson) return null;
    
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return null;
  }
}