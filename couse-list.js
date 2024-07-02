window.$memberstackDom.getCurrentMember().then((member) => {
	if (member.data) {
		if (member.data.planConnections.some(plan => plan.planId === 'pln_jc-premium-5v1700rlv')) {
			$("a.course-item").each(function () {
				const OutlineLink = $(this).data("course-outline-href");
				if (OutlineLink) {
					$(this).attr("href", `/course-learning/${OutlineLink}`);
				}
			});
		} else {
			console.log('no access', member);
		}

	} else {
		console.log('no member', member);
	}
});