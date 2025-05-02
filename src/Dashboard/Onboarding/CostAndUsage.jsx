
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Link,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import img6 from "../../assets/img6.png";
import img7 from "../../assets/img7.png";
import img8 from "../../assets/img8.png";
import { useSelector, useDispatch } from "react-redux";
import { resetForm } from "../../Redux/OnboardingSlice";


const CostAndUsage = ({ onNext, onBack }) => {
  const formData = useSelector((state) => state.onboarding);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
   

  
  const reportName = "ck-tuner-27559855473-hourly-cur";
  
  const s3PathPrefix = "27559855473";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };


  const handleSubmit = async () => {
    if (!formData.arn || !formData.accountId || !formData.accountName || !formData.accountProvider || !formData.region) {
      alert("All fields are required. Please fill out the form completely.");
      return;
    }
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    const payload = {
      arn: formData.arn,
      accountId: formData.accountId,
      accountName: formData.accountName,
      provider: formData.accountProvider,
      region: formData.region,
    };

    try {
      console.log("Payload being sent:", payload);
      console.log("Token:", token);

      const response = await axios.post(
        `${process.env.REACT_APP_REACT_APP_API_BASE_URL}/onboarding/onboard`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Data successfully submitted:", response.data);
        dispatch(resetForm());
        onNext();

      
      } else {
        console.error("Failed to submit data:", response.statusText);
        alert("Something went wrong while submitting. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error.response?.data || error.message);
      alert(error.response?.data || "An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create Cost & Usage Report
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Create a Cost & Usage Report by following these steps
      </Typography>

      <Stack spacing={4} mt={3}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography>
            <strong>1.</strong> Go to{" "}
            <Link
              href="https://console.aws.amazon.com/billing/home#/reports"
              target="_blank"
              rel="noopener"
            >
              Cost and Usage Reports
            </Link>{" "}
            in the Billing Dashboard and click on <strong>Create report</strong>
            .
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Typography>
            <strong>2.</strong> Name the report as shown below and select the{" "}
            <strong>Include resource IDs</strong> checkbox -
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 1,
              backgroundColor: "#f9f9f9",
              maxWidth: 400,
            }}
          >
            <Typography sx={{ flexGrow: 1, fontFamily: "monospace" }}>
              {reportName}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleCopy(reportName)}
              aria-label="Copy Report Name"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Include Resource IDs"
          />
        </Stack>

        <Stack spacing={2}>
          <Typography>
            <strong>3.</strong> Specify the report details as shown in the
            screenshot below:
          </Typography>
          <Box
            sx={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
            }}
          >
            <img
              src={img6} 
              alt="Cost & Usage Report Screenshot"
              style={{ width: "100%", borderRadius: 4 }}
            />
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Typography>
            <strong>4.</strong> Select an existing bucket or create a new bucket
            as shown below:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography>
              <strong>Set delivery options:</strong>
            </Typography>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <img
                src={img7}
                alt="Select Existing Bucket Screenshot"
                style={{ width: "100%", borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Typography>
            <strong>5.</strong> In the <strong>Delivery options</strong> section, enter the below-mentioned Report path prefix -
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 1,
              backgroundColor: "#f9f9f9",
              maxWidth: 400,
            }}
          >
            <Typography sx={{ flexGrow: 1, fontFamily: "monospace" }}>
              {s3PathPrefix}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleCopy(s3PathPrefix)}
              aria-label="Copy S3 Path Prefix"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography>Additionally, ensure that the following checks are in place:</Typography>
          <RadioGroup defaultValue="hourly">
            <FormControlLabel
              value="hourly"
              control={<Radio />}
              label="Time granularity: Hourly"
            />
          </RadioGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Amazon Athena"
          />
          <Box
            sx={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
            }}
          >
            <img
              src={img8}
              alt="Report Delivery Options Screenshot"
              style={{ width: "100%", borderRadius: 4 }}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>

          {loading ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CostAndUsage;