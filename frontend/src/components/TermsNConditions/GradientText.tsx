import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled gradient typography
const StyledGradientText = styled(Typography)(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
  letterSpacing: '0.5px',
  display: 'inline-block',
}));

const GradientText: React.FC<TypographyProps> = (props) => {
  return <StyledGradientText {...props} />;
};

export default GradientText;
