import { createSlice, createSelector } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profileData: null,
        isLoading: false,
        error: null,
        lastFetched: null,
    },
    reducers: {
        // Set loading state
        setProfileLoading: (state, action) => {
            state.isLoading = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },
        
        // Set profile data
        setProfileData: (state, action) => {
            state.profileData = action.payload;
            state.isLoading = false;
            state.error = null;
            state.lastFetched = Date.now();
        },
        
        // Set error state
        setProfileError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        // Clear profile data
        clearProfileData: (state) => {
            state.profileData = null;
            state.isLoading = false;
            state.error = null;
            state.lastFetched = null;
        },
        
        // Update subverse membership status
        updateSubverseMembership: (state, action) => {
            const { subverseId, isJoined } = action.payload;
            
            if (!state.profileData || !state.profileData.subverses_member_in) {
                return;
            }
            
            if (isJoined) {
                // Add subverse to membership list if not already present
                const existingIndex = state.profileData.subverses_member_in.findIndex(
                    subverse => subverse.id === subverseId
                );
                
                if (existingIndex === -1) {
                    // If subverse not found, we need to add it
                    // This would typically come from the subverse data
                    console.warn(`Subverse ${subverseId} not found in profile data. Cannot add membership.`);
                }
            } else {
                // Remove subverse from membership list
                state.profileData.subverses_member_in = state.profileData.subverses_member_in.filter(
                    subverse => subverse.id !== subverseId
                );
            }
        },
        
        // Add subverse to membership (when joining)
        addSubverseMembership: (state, action) => {
            const subverseData = action.payload;
            
            if (!state.profileData) {
                state.profileData = { subverses_member_in: [] };
            }
            
            if (!state.profileData.subverses_member_in) {
                state.profileData.subverses_member_in = [];
            }
            
            // Check if subverse already exists
            const existingIndex = state.profileData.subverses_member_in.findIndex(
                subverse => subverse.id === subverseData.id
            );
            
            if (existingIndex === -1) {
                state.profileData.subverses_member_in.push(subverseData);
            }
        },
        
        // Remove subverse from membership (when leaving)
        removeSubverseMembership: (state, action) => {
            const subverseId = action.payload;
            
            if (state.profileData && state.profileData.subverses_member_in) {
                state.profileData.subverses_member_in = state.profileData.subverses_member_in.filter(
                    subverse => subverse.id !== subverseId
                );
            }
        },
    },
});

// Export actions
export const {
    setProfileLoading,
    setProfileData,
    setProfileError,
    clearProfileData,
    updateSubverseMembership,
    addSubverseMembership,
    removeSubverseMembership,
} = profileSlice.actions;

// Selectors
export const selectProfileData = (state) => state.profile.profileData;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;
export const selectLastFetched = (state) => state.profile.lastFetched;

// Memoized selectors
export const selectUserMemberships = createSelector(
    [selectProfileData],
    (profileData) => profileData?.subverses_member_in || []
);

export const selectIsMemberOfSubverse = createSelector(
    [selectUserMemberships, (state, subverseId) => subverseId],
    (memberships, subverseId) => 
        memberships.some(subverse => subverse.id === subverseId)
);

export const selectMembershipById = createSelector(
    [selectUserMemberships, (state, subverseId) => subverseId],
    (memberships, subverseId) => 
        memberships.find(subverse => subverse.id === subverseId)
);

// Utility selector for checking multiple subverses at once
export const selectMembershipStatuses = createSelector(
    [selectUserMemberships, (state, subverseIds) => subverseIds],
    (memberships, subverseIds) => {
        const statusMap = {};
        subverseIds.forEach(id => {
            statusMap[id] = memberships.some(subverse => subverse.id === id);
        });
        return statusMap;
    }
);

export default profileSlice.reducer;
