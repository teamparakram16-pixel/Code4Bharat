import { ApiResponse, canDoPkType } from "@/pages/User/PrakrithiAnalysis/PrakrithiAnalysis.types";

export interface PrakrithiAnalysisFormProps {
  currentSection: number;
  setCurrentSection: (section: number) => void;
  setLoading: (loading: boolean) => void;
  generatePDF: (responseData: ApiResponse) => Promise<void>;
  TOTAL_SECTIONS: number;
  setAnalysisComplete: (value: boolean) => void;
  setResponseData: (value: ApiResponse) => void;
  setCanDoPk:(value:canDoPkType)=> void;
   canDoPk: canDoPkType | null;
}
