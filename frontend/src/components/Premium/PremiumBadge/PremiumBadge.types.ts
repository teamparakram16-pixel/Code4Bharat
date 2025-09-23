export interface PremiumBadgeProps {
  premiumNo?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export interface PremiumCircleBadgeProps {
  premiumNo?: number;
  size?: 'small' | 'medium' | 'large';
}

export interface PremiumInfo {
  premiumNo?: number;
  premiumOption?: any;
  validTill?: string;
}
