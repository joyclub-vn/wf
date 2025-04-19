export type PlanConnection = {
    id: string;
    active: boolean;
    status: string;
    planId: string;
    type: string;
    payment: null;
  };
  
  export type AuthProvider = {
    provider: string;
  };
  
  export type AuthInfo = {
    email: string;
    hasPassword: boolean;
    providers: AuthProvider[];
  };
  
  export type TeamInfo = {
    belongsToTeam: boolean;
    ownedTeams: any[];   // You can replace `any` with a proper type if you have it
    joinedTeams: any[];
  };
  
  export type CommentInfo = {
    isModerator: boolean;
  };
  
  export type MemberData = {
    planConnections?: PlanConnection[];
    id?: string;
    verified?: boolean;
    createdAt?: string;
    profileImage?: string;
    lastLogin?: string;
    auth?: AuthInfo;
    metaData?: Record<string, any>;
    customFields?: Record<string, any>;
    permissions?: string[];
    stripeCustomerId?: string | null;
    loginRedirect?: string;
    teams?: TeamInfo;
    _comments?: CommentInfo;
  };
  
  export type MemberStackResponse = {
    data?: MemberData;
  };
  