import { PREMIUM_PLAN_ID } from './consts'

type MemberStackResponse = {
  data?: {
    planConnections?: Array<{
      id: string;
      active: boolean;
      status: string;
      planId: string;
      type: string;
      payment: null;
    }>;
    id?: string;
    verified?: boolean;
    createdAt?: string;
    profileImage?: string;
    lastLogin?: string;
    auth?: {
      email: string;
      hasPassword: boolean;
      providers: Array<{
        provider: string;
      }>;
    };
    metaData?: Record<string, any>;
    customFields?: Record<string, any>;
    permissions?: string[];
    stripeCustomerId?: string | null;
    loginRedirect?: string;
    teams?: {
      belongsToTeam: boolean;
      ownedTeams: any[];
      joinedTeams: any[];
    };
    _comments?: {
      isModerator: boolean;
    };
  };
};

/**
 * Protects a page with membership and permission checks
 * Access is granted if user either has the premium plan OR has the required permission
 * @param run Function to execute if access is granted
 * @param deniedPage URL to redirect to if access is denied
 * @param permission Optional permission to check (if null, only plan check is performed)
 */
function protected_page(
  run: () => void,
  deniedPage: string,
  permission: string | null = null
): void {
  // Helper function to handle access denial
  const denyAccess = (reason: string): void => {
    console.debug(`No access: ${reason}`);
    window.location.replace(deniedPage);
  };

  // @ts-ignore - We know this exists at runtime
  window.$memberstackDom.getCurrentMember()
    .then((member: MemberStackResponse) => {
      // Check if member exists
      if (!member?.data) {
        denyAccess('No login detected');
        return;
      }

      // Check if member has premium plan
      const hasPremiumPlan = member.data.planConnections?.some(
        plan => plan.planId === PREMIUM_PLAN_ID
      );

      // Check if member has required permission
      const hasPermission = permission ?
        member.data.permissions?.some(p => p === permission) :
        false;

      // Grant access if user has either the premium plan OR the required permission
      if (hasPremiumPlan || hasPermission) {
        // Access granted, run the function
        run();
      } else {
        denyAccess('Member does not have required plan or permission');
      }
    })
    .catch((error) => {
      console.error('Error checking member status:', error);
      window.location.replace(deniedPage);
    });
}

export default protected_page;