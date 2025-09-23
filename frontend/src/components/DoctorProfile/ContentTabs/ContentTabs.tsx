import {
  Box,
  Tab,
  Tabs,
  Badge,
  useTheme,
} from "@mui/material";
import {
  GridViewRounded,
  FitnessCenterRounded,
  BookmarkBorderRounded,
  PersonRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ContentTabsProps } from "./ContentTabs.types";

const ContentTabs = ({
  activeTab,
  onTabChange,
  postsCount,
  routinesCount,
  savedCount,
  aboutVisible,
}: ContentTabsProps) => {
  const theme = useTheme();

  const tabItems = [
    {
      label: "Posts",
      icon: <GridViewRounded />,
      count: postsCount,
      value: 0,
    },
    {
      label: "Routines",
      icon: <FitnessCenterRounded />,
      count: routinesCount,
      value: 1,
    },
    {
      label: "Saved",
      icon: <BookmarkBorderRounded />,
      count: savedCount,
      value: 2,
    },
  ];

  if (aboutVisible) {
    tabItems.push({
      label: "About",
      icon: <PersonRounded />,
      count: 0,
      value: 3,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              py: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                bgcolor: "rgba(102, 126, 234, 0.05)",
              },
            },
          }}
        >
          {tabItems.map((item) => (
            <Tab
              key={item.value}
              icon={
                item.count > 0 && item.value !== 3 ? (
                  <Badge
                    badgeContent={item.count}
                    color="primary"
                    max={999}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.75rem",
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )
              }
              label={item.label}
              iconPosition="start"
              sx={{
                gap: 1,
                flexDirection: "row",
                minHeight: "64px",
              }}
            />
          ))}
        </Tabs>
      </Box>
    </motion.div>
  );
};

export default ContentTabs;
