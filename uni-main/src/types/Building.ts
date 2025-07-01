export interface Building {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  services: string[];
  isMainBuilding?: boolean;
}

export interface MapLink {
  title: string;
  url: string;
  description: string;
  submaps?: MapLink[];
}

export interface BuildingPageData {
  id: string;
  title: string;
  description: string;
  content: string;
  links: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  backgroundColor: string;
  textColor: string;
  maps?: MapLink[];
  showForum?: boolean;
}