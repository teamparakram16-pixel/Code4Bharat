export interface ContentTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  postsCount: number;
  routinesCount: number;
  savedCount: number;
  aboutVisible: boolean;
}

export interface TabItem {
  label: string;
  icon: React.ReactNode;
  count: number;
  value: number;
}
