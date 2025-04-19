import { PREMIUM_PLAN_ID } from './consts'
import type { MemberStackResponse, MemberData } from './types/member';

export async function getMsMember(): Promise<MemberData | null> {
  // 1. Try to load from localStorage
  const local = localStorage.getItem('_ms-mem');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      return parsed ?? null;
    } catch (e) {
      console.error('Invalid _ms-mem in localStorage:', e);
    }
  }

  // 2. Fallback to Memberstack API
  try {
    // @ts-ignore - We know this exists at runtime
    const response: MemberStackResponse = await window.$memberstackDom.getCurrentMember();
    return response?.data ?? null;
  } catch (err) {
    console.error('Error getting Memberstack member:', err);
    return null;
  }
}

/**
 * Protects a page with membership and permission checks
 * Access is granted if user either has the premium plan OR has the required permission
 * @param run Function to execute if access is granted
 * @param deniedPage URL to redirect to if access is denied
 * @param permission Optional permission to check (if null, only plan check is performed)
 */
export function protected_page(
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
  getMsMember().then((member: MemberData) => {
    // Check if member exists
    if (!member) {
      denyAccess('No login detected');
      return;
    }

    // Check if member has premium plan
    const hasPremiumPlan = member.planConnections?.some(
      plan => plan.planId === PREMIUM_PLAN_ID
    );

    // Check if member has required permission
    const hasPermission = permission ?
      member.permissions?.some(p => p === permission) :
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

/**
 * Checks user permissions and removes elements from the DOM based on permission attributes.
 * Elements with `ms-permission` attribute are removed if the user does not have the specified permission,
 * or if the permission is negated with a '!' prefix and the user does have it.
 * Elements with `ms-not-permission` attribute are removed if the user does not have the specified permission.
 */
function check_permissions() {
  getMsMember().then((member: MemberData) => {
    const permissions = member?.permissions || [];

    // Handle elements with ms-permission attribute
    document.querySelectorAll('[ms-permission]').forEach(element => {
      const perm = element.getAttribute('ms-permission') || '';
      const shouldRemove = perm.startsWith('!')
        ? permissions.includes(perm.slice(1))
        : !permissions.includes(perm);
      if (shouldRemove) element.remove();
    });

    // Handle elements with ms-not-permission attribute
    document.querySelectorAll('[ms-not-permission]').forEach(element => {
      const perm = element.getAttribute('ms-not-permission') || '';
      if (!permissions.includes(perm)) element.remove();
    });
  
  }).catch(error => {
    console.error('Error checking permissions:', error);
  });
}

export function initCustomMember() {
  document.querySelectorAll('[data-ms-not-content]').forEach((element: HTMLElement) => {
    const contentID = element.getAttribute('data-ms-not-content');
    element.setAttribute('data-ms-content', `!${contentID}`);
    element.removeAttribute('data-ms-not-content');
  });

  check_permissions()
}