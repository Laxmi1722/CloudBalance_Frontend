
import React, { useState } from "react";
import { Box, Typography, Stepper, Step, StepLabel, Paper, Container, useMediaQuery, useTheme } from "@mui/material";
import IAMRoleStep from "./IAMRoleStep";
import CustomerManagedPoliciesStep from "./CustomerManagedPoliciesStep";
import CostAndUsage from "./CostAndUsage";
import Submit from "./Submit";

const OnboardingDashboard = () => {
  const [step, setStep] = useState(0);

  const stepTitles = ["Create IAM Role", "Add Customer Managed Policies", "Cost and Usage", "Submit"];

  const steps = [
    <IAMRoleStep onNext={() => setStep(1)} />,
    <CustomerManagedPoliciesStep onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <CostAndUsage onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <Submit />,
  ];
  const theme = useTheme(); 
  const isMediumScreen = useMediaQuery("(max-width:1225px)"); 


  return (
    <Container maxWidth={isMediumScreen ? "md" : "xl"} sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {stepTitles.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{steps[step]}</Box>
      </Paper>
      <Box
              sx={{
                marginTop:"12em",
                textAlign: "left",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                CloudBalance 2025 | All Rights Reserved
              </Typography>
            </Box>
    </Container>
  );
};

export default OnboardingDashboard;