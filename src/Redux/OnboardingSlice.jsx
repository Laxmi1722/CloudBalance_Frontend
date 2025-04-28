import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  arn: '',
  accountId: '',
  accountName: '',
  provider: '',
  region: '',
};

const OnboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
    
  },
});

export const { updateField, resetForm } = OnboardingSlice.actions;

export default OnboardingSlice.reducer;