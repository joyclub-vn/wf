import {PREMIUM_PLAN_ID} from './consts'


function protected_page(
    run: () => void,
    denied_page: string
): void {
    window.$memberstackDom.getCurrentMember().then((member) => {
        if (member?.data && member.data.planConnections?.some(plan => plan.planId === PREMIUM_PLAN_ID)) {
            run();
        } else if (!member?.data) {
            console.log('No login detected.');
            window.location.replace(denied_page);
        } else {
            console.log('No access: Member does not have the required plan.');
            window.location.replace(denied_page);
        }
    }).catch((error) => {
        console.error('Error checking member status:', error);
        window.location.replace(denied_page);
    });
}

// Add type declaration for window.$memberstackDom
declare global {
    interface Window {
        $memberstackDom: {
            getCurrentMember: () => Promise<{
                data?: {
                    planConnections?: Array<{
                        planId: string;
                    }>;
                };
            }>;
        };
    }
}

export default protected_page;