import React from 'react';
import { Box, Typography } from '@mui/material';
import SectionPaper from './SectionPaper.tsx';
const TermsSections: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* 1. Eligibility */}
      <SectionPaper id="eligibility" title="1. Eligibility">
        You must be at least 18 years old or have legal parental or guardian consent to use this Platform. By using
        the Platform, you confirm that you meet these requirements.
      </SectionPaper>

      {/* 2. Our Services */}
      <SectionPaper id="services" title="2. Our Services">
        We provide Ayurvedic wellness services, including:
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
          <li>AI-based Prakriti analysis</li>
          <li>Personalized wellness recommendations</li>
          <li>Access to verified Ayurvedic experts</li>
          <li>A community for sharing experiences and success stories</li>
        </Box>
        These services are provided for informational and educational purposes only and are not a substitute for
        professional medical advice or treatment.
      </SectionPaper>

      {/* 3. User Data and Privacy */}
      <SectionPaper id="user-data" title="3. User Data and Privacy">
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Personal Info Collected
        </Typography>
        We collect personal information such as:
        <Box component="ul" sx={{ pl: 4, mb: 3 }}>
          <li>Name, age, gender</li>
          <li>Health-related information (used for Prakriti analysis)</li>
          <li>Contact information (for account and consultation purposes)</li>
        </Box>
        By using our services, you agree to our collection, storage, and use of your data as described in our Privacy Policy.
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
          Your Consent:
        </Typography>
        You explicitly consent to the collection and processing of your personal and health data when you register
        and interact with our platform. We will never sell or misuse your data.
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
          Data Security:
        </Typography>
        We use industry-standard measures to protect your information. However, no system is 100% secure. By
        using our Platform, you acknowledge this risk.
      </SectionPaper>

      {/* 4. User Responsibilities */}
      <SectionPaper id="responsibilities" title="4. User Responsibilities">
        You agree:
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
          <li>To provide accurate, current, and complete information</li>
          <li>To not misuse the Platform for illegal or harmful purposes</li>
          <li>To respect the rights and privacy of other users and experts</li>
        </Box>
        You are solely responsible for any content you submit, including stories, posts, and health information.
      </SectionPaper>

      {/* 5. Community Guidelines */}
      <SectionPaper id="community" title="5. Community Guidelines">
        You must not post:
        <Box component="ul" sx={{ pl: 4, mb: 2 }}>
          <li>False or misleading health claims</li>
          <li>Offensive, abusive, or unlawful content</li>
          <li>Content that impersonates others or violates copyrights</li>
        </Box>
        Expert reviews and verifications are done in good faith but do not constitute medical approval or certification.
      </SectionPaper>

      {/* 6. Medical Disclaimer */}
      <SectionPaper id="disclaimer" title="6. Medical Disclaimer">
        We are not a healthcare provider. Any content, recommendation, or interaction on the Platform should not be
        considered medical advice. Always consult a licensed healthcare professional before making any
        health-related decisions.
      </SectionPaper>

      {/* 7. Third-Party Links */}
      <SectionPaper id="third-party" title="7. Third-Party Links">
        Our Platform may contain links to third-party sites or services. We are not responsible for their content,
        privacy practices, or accuracy.
      </SectionPaper>

      {/* 8. Intellectual Property */}
      <SectionPaper id="ip" title="8. Intellectual Property">
        All content on the Platform, including logos, designs, AI tools, and wellness plans, are our property or that of
        our partners. You may not use them without our written permission.
      </SectionPaper>

      {/* 9. Account Termination */}
      <SectionPaper id="termination" title="9. Account Termination">
        We reserve the right to suspend or delete any user account found in violation of these Terms or engaged in
        suspicious or abusive behavior.
      </SectionPaper>

      {/* 10. Modifications */}
      <SectionPaper id="modifications" title="10. Modifications">
        We may revise these Terms at any time. Continued use of the Platform after such changes constitutes your
        acceptance of the updated Terms.
      </SectionPaper>

      {/* 11. Governing Law */}
      <SectionPaper id="governing-law" title="11. Governing Law">
        These Terms are governed by the laws of India. Any disputes will be resolved in the
        jurisdiction of Mangalore, Karnataka.
      </SectionPaper>

      {/* 12. Contact Us */}
      <SectionPaper id="contact" title="12. Contact Us">
        If you have any questions about these Terms, your data, or our services, please contact us at:
        <Box sx={{ 
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          mt: 2,
          borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
        }}>
          <Typography variant="body1" paragraph sx={{ mb: 1 }}>
            <strong>Email:</strong> teamparakram16@gmail.com
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 1 }}>
            <strong>Address:</strong> Sahyadri College of Engineering & Management, Mangalore, India
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Phone:</strong> +91-8904156468
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          By using this Platform, you agree to these Terms and Conditions and our Privacy Policy.
        </Typography>
      </SectionPaper>
    </Box>
  );
};

export default TermsSections;