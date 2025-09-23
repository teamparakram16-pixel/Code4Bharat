export interface FilterCategory {
    selectType: "single" | "double";
    subFilters: string[];
  }
  
  export interface Filters {
    dosha: FilterCategory;
    category: FilterCategory;
    time: FilterCategory;
    userType?: FilterCategory;
  }
  
  export interface FilterProps {
    setData: (data: any[]) => void;
    filters: Filters;
    setLoading: (value: boolean) => void;
  }