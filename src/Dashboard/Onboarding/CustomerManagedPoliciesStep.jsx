import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
  Link,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";
const costAuditPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CostAudit",
      "Effect": "Allow",
      "Action": [
        "dms:Describe*",
        "dms:List*",
        "kafka:Describe*",
        "kafka:Get*",
        "kafka:List*"
      ],
      "Resource": "*"
    }
  ]
}`;

const secondPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOnlyAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:List*"
      ],
      "Resource": "*"
    }
  ]
}`;

const thirdPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CostExplorer",
      "Effect": "Allow",
      "Action": [
        "ce:StartSavingsPlansPurchaseRecommendationGeneration",
        "ce:UpdatePreferences"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ListEC2SPReservations",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeReservedInstances",
        "ec2:DescribeInstanceTypeOfferings"
      ],
      "Resource": "*"
    }
  ]
}`;
const inlinePolicyExample = `{
    "Sid": "S3LimitedRead",
    "Effect": "Allow",
    "Action": [
      "s3:GetObjectRetention",
      "s3:GetObjectLegalHold",
      "s3:GetObject"
    ],
    "Resource": [
      "arn:aws:s3:::ck-tuner-27559855473",
      "arn:aws:s3:::ck-tuner-27559855473/*"
    ]
  }`;
const policyName = "cktuner-CostAuditPolicy";
const secondPolicyName = "cktuner-SecAuditPolicy";
const thirdPolicyName = "cktuner-TunerReadEssentials";
const policyNameForStep17 = 'S3CrossAccountReplication';

const AddCustomerManagedPoliciesStep = ({ onNext, onBack }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Customer Managed Policies
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Create an Inline policy for the role by following these steps
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={4}>
            {/* Step 1 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="1" color="primary" />
              <Typography>
                Go to the{" "}
                <Link
                  href="https://console.aws.amazon.com/iam/home#/policies$new?step=edit"
                  target="_blank"
                  rel="noopener"
                >
                  Create Policy
                </Link>{" "}
                Page.
              </Typography>
            </Stack>

            {/* Step 2 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="2" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Click on the <strong>JSON</strong> tab and paste the following
                  policy and click on Next:
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: "#f9f9f9",
                    maxHeight: 300,
                    overflow: "auto",
                    fontFamily: "monospace",
                  }}
                >
                  <pre>{costAuditPolicy}</pre>
                  <Tooltip title="Copy Policy">
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => handleCopy(costAuditPolicy)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            {/* Step 3 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="3" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Name</strong> field, enter the below-mentioned
                  policy name and click on Create Policy:
                </Typography>
                <TextField
                  fullWidth
                  value={policyName}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Policy Name">
                          <IconButton onClick={() => handleCopy(policyName)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Stack>

            {/* Step 4 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="4" color="primary" />
              <Typography>
                Again, go to the{" "}
                <Link
                  href="https://console.aws.amazon.com/iam/home#/policies$new?step=edit"
                  target="_blank"
                  rel="noopener"
                >
                  Create Policy
                </Link>{" "}
                Page.
              </Typography>
            </Stack>

            {/* Step 5 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="5" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Click on the <strong>JSON</strong> tab and paste the following
                  policy and click on Next:
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: "#f9f9f9",
                    maxHeight: 300,
                    overflow: "auto",
                    fontFamily: "monospace",
                  }}
                >
                  <pre>{secondPolicy}</pre>
                  <Tooltip title="Copy Policy">
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => handleCopy(secondPolicy)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            {/* Step 6 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="6" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Name</strong> field, enter the below-mentioned
                  policy name and click on Create Policy:
                </Typography>
                <TextField
                  fullWidth
                  value={secondPolicyName}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Policy Name">
                          <IconButton
                            onClick={() => handleCopy(secondPolicyName)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Stack>

            {/* Step 7 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="7" color="primary" />
              <Typography>
                Again, go to the{" "}
                <Link
                  href="https://console.aws.amazon.com/iam/home#/policies$new?step=edit"
                  target="_blank"
                  rel="noopener"
                >
                  Create Policy
                </Link>{" "}
                Page.
              </Typography>
            </Stack>

            {/* Step 8 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="8" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Click on the <strong>JSON</strong> tab and paste the following
                  policy and click on Next:
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: "#f9f9f9",
                    maxHeight: 300,
                    overflow: "auto",
                    fontFamily: "monospace",
                  }}
                >
                  <pre>{thirdPolicy}</pre>
                  <Tooltip title="Copy Policy">
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => handleCopy(thirdPolicy)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            {/* Step 9 */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="9" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Name</strong> field, enter the below-mentioned
                  policy name and click on Create Policy:
                </Typography>
                <TextField
                  fullWidth
                  value={thirdPolicyName}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Policy Name">
                          <IconButton
                            onClick={() => handleCopy(thirdPolicyName)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="10" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Go to the{" "}
                  <Link
                    href="https://console.aws.amazon.com/iam/home#/roles"
                    target="_blank"
                    rel="noopener"
                  >
                    CK-Tuner-Role
                  </Link>{" "}
                  page and attach these policies to the role.
                </Typography>
                <img
                  src={img2} 
                  alt="CK-Tuner-Role Summary"
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    marginTop: 16,
                  }}
                />
              </Box>
            </Stack>

            {/* Footer Buttons */}

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="11" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In <strong>Permission policies</strong>, click on{" "}
                  <strong>Add permissions &gt; Attach Policy</strong>.
                </Typography>
                <img
                  src={img3}
                  alt="Add Permissions - Attach Policy"
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    marginTop: 16,
                  }}
                />
              </Box>
            </Stack>

            {/* Step 12 */}
            {/* <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="12" color="primary" />
              <Typography>
                Filter by <strong>Type &gt; Customer managed</strong> and search for the following:
              </Typography>
              <ul>
                <li><strong>{policyName}</strong></li>
                <li><strong>{secondPolicyName}</strong></li>
                <li><strong>{thirdPolicyName}</strong></li>
              </ul>
              <Typography gutterBottom>
                Select all the policies and click <strong>Add permissions</strong>.
              </Typography>
            </Stack> */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="12" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  Filter by <strong>Type &gt; Customer managed</strong> and
                  search for the following:
                </Typography>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  <strong>{policyName}</strong>,{" "}
                  <strong>{secondPolicyName}</strong>,{" "}
                  <strong>{thirdPolicyName}</strong>
                </Typography>
                <Typography gutterBottom>
                  Select all the policies and click{" "}
                  <strong>Add permissions</strong>.
                </Typography>
                <img
                  src={img4} 
                  alt="Filter by Type - Customer managed"
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    marginTop: 16,
                  }}
                />
              </Box>
            </Stack>

            {/* Step 13 */}

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="13" color="primary" />
              <Typography>
                After attaching the policies, verify that the selected policies
                are listed under the <strong>Permissions policies</strong> tab.
              </Typography>
            </Stack>
          </Stack>
          <Box pt={3} />
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="14" color="primary" />
            <Box width="100%">
              <Typography gutterBottom>
                In <strong>Permission policies</strong>, click on{" "}
                <strong>Add permissions &gt; Create inline policy</strong>.
              </Typography>
              <img
                src={img5} 
                alt="Add permissions - Create inline policy"
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  marginTop: 16,
                }}
              />
            </Box>
          </Stack>

          {/* Step 15 */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="15" color="primary" />
            <Box width="100%">
              <Typography gutterBottom>
                Click on the <strong>JSON</strong> tab and paste the following
                policy:
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  maxHeight: 300,
                  overflow: "auto",
                  fontFamily: "monospace",
                }}
              >
                <pre>{inlinePolicyExample}</pre>
                <Tooltip title="Copy Policy">
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => handleCopy(inlinePolicyExample)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>

          {/* Step 16 */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Chip label="16" color="primary" />
            <Box width="100%">
              <Typography gutterBottom>
                Now, click on <strong>Review policy</strong>.
              </Typography>
            
            </Box>
          </Stack>
          <Box pt={2} />
          <Stack direction="row" spacing={2} alignItems="flex-start">
              <Chip label="17" color="primary" />
              <Box width="100%">
                <Typography gutterBottom>
                  In the <strong>Name</strong> field, enter the below-mentioned policy name and click on <strong>Create Policy</strong>:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 1,
                    backgroundColor: '#f9f9f9',
                    maxWidth: 400,
                  }}
                >
                  <Typography sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                    {policyNameForStep17}
                  </Typography>
                  <Tooltip title="Copy Policy Name">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(policyNameForStep17)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

          <Stack direction="row" justifyContent="space-between" pt={2}>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" onClick={onNext}>
              Next Cost and Usage
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddCustomerManagedPoliciesStep;
