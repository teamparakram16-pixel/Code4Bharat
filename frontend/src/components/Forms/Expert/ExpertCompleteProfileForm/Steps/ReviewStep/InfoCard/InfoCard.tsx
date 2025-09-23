import { Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const InfoCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{ borderLeft: `4px solid ${theme.palette.primary.main}` }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          {icon}
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default InfoCard;