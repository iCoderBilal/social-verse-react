import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import {
    selectProfileData,
    selectProfileLoading,
    selectProfileError,
    selectUserMemberships,
    selectIsMemberOfSubverse,
    selectMembershipById,
    selectMembershipStatuses,
    setProfileLoading,
    setProfileData,
    setProfileError,
    addSubverseMembership,
    removeSubverseMembership,
} from '../../store/profile';

/**
 * Custom hook for profile management and subverse membership checking
 */
export const useProfile = () => {
    const dispatch = useDispatch();
    const profileData = useSelector(selectProfileData);
    const isLoading = useSelector(selectProfileLoading);
    const error = useSelector(selectProfileError);
    const memberships = useSelector(selectUserMemberships);

    /**
     * Fetch user profile data
     * @param {string} username - Username to fetch profile for
     * @param {boolean} forceRefresh - Force refresh even if data exists
     */
    const fetchProfile = async (username, forceRefresh = false) => {
        // Don't fetch if data exists and not forcing refresh
        if (profileData && !forceRefresh) {
            return;
        }

        try {
            dispatch(setProfileLoading(true));
            const response = await axios.get(`/profile/${username}`);
            
            if (response.data) {
                dispatch(setProfileData(response.data));
            } else {
                dispatch(setProfileError('No profile data received'));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            dispatch(setProfileError(error.response?.data?.message || 'Failed to fetch profile'));
        }
    };

    /**
     * Join a subverse
     * @param {number} subverseId - ID of subverse to join
     * @param {object} subverseData - Subverse data to add to memberships
     */
    const joinSubverse = async (subverseId, subverseData) => {
        try {
            const response = await axios.put('/memberships/join', {
                subverse_id: subverseId
            });
            
            if (response.data && response.data.status === 'success') {
                // Add to Redux state
                dispatch(addSubverseMembership(subverseData));
                return { success: true, message: 'Successfully joined subverse!' };
            } else {
                return { success: false, message: response.data?.message || 'Failed to join subverse' };
            }
        } catch (error) {
            console.error('Error joining subverse:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to join subverse. Please try again.' 
            };
        }
    };

    /**
     * Leave a subverse
     * @param {number} subverseId - ID of subverse to leave
     */
    const leaveSubverse = async (subverseId) => {
        try {
            const response = await axios.delete('/memberships/leave', {
                data: { subverse_id: subverseId }
            });
            
            if (response.data && response.data.status === 'success') {
                // Remove from Redux state
                dispatch(removeSubverseMembership(subverseId));
                return { success: true, message: 'Successfully left subverse!' };
            } else {
                return { success: false, message: response.data?.message || 'Failed to leave subverse' };
            }
        } catch (error) {
            console.error('Error leaving subverse:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to leave subverse. Please try again.' 
            };
        }
    };

    return {
        profileData,
        isLoading,
        error,
        memberships,
        fetchProfile,
        joinSubverse,
        leaveSubverse,
    };
};

/**
 * Custom hook for checking subverse membership status
 * @param {number} subverseId - ID of subverse to check
 */
export const useSubverseMembership = (subverseId) => {
    const isMember = useSelector(state => selectIsMemberOfSubverse(state, subverseId));
    const membershipData = useSelector(state => selectMembershipById(state, subverseId));
    
    return {
        isMember,
        membershipData,
    };
};

/**
 * Custom hook for checking multiple subverse memberships at once
 * @param {number[]} subverseIds - Array of subverse IDs to check
 */
export const useMultipleSubverseMemberships = (subverseIds) => {
    const membershipStatuses = useSelector(state => selectMembershipStatuses(state, subverseIds));
    
    return {
        membershipStatuses,
        isMemberOf: (subverseId) => membershipStatuses[subverseId] || false,
    };
};

export default useProfile;
